from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from django.template.loader import render_to_string
from django.core.mail import send_mail, EmailMultiAlternatives, get_connection
import secrets
from django.http import JsonResponse
from accounts.models import UserAccount
from invitations.models import Partner, Child
from .serializers import GuestUserSerializer, UserAccountDetailSerializer
from django.conf import settings
from django.utils import timezone
from rest_framework.decorators import action
from django.db.models import Prefetch
from invitations.models import RSVP, Partner, Child


class UserAccountViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/users/       -> list all users with nested partner/children/rsvps
    GET /api/users/{pk}/  -> detail for a single user
    """
    permission_classes = [IsAdminUser]

    queryset = UserAccount.objects.all().prefetch_related(
        # prefetch children and RSVP, partner fetched in serializer
        Prefetch("child_set", queryset=Child.objects.all()),
        Prefetch("rsvp_set", queryset=RSVP.objects.select_related("room").prefetch_related("allergies")),
    )
    serializer_class = UserAccountDetailSerializer

    @action(detail=False, methods=["get"])
    def summary(self, request):
        """
        Optional: aggregated summary across all users (e.g., counts of coming/rsvped)
        """
        from django.db.models import Count, Q

        qs = UserAccount.objects.annotate(
            total_children=Count("child", distinct=True),
            coming_children=Count("child", filter=Q(child__coming=True)),
            rsvped_children=Count("child", filter=Q(child__rsvped=True)),
        )

        data = []
        for u in qs:
            data.append({
                "id": u.id,
                "email": u.email,
                "full_name": u.get_full_name(),
                "rsvped": u.rsvped,
                "coming": u.coming,
                "total_children": u.total_children,
                "coming_children": u.coming_children,
                "rsvped_children": u.rsvped_children,
            })
        return Response(data)


DATA = [
  {
    "fname": "Sarah",
    "lname": "Smith",
    "email": "sarah@example.com",
    "partner": "Tom Smith",
    "children": [
      { "name": "Lily", "age": 4 },
      { "name": "James", "age": 2 }
    ]
  },
  {
    "fname": "Jake",
    "lname": "Turner",
    "email": "jake@example.com"
  }
]


context = {
    "name": "Alex",
    "email": "alex@example.com",
    "password": "secure-temporary-pass",
    "domain": "https://wedding-portal.example.com/login",
    "update_title": "Schedule Update",
    "update_body": "We've finalized the weekend timeline. Ceremony starts at 4pm on Saturday, followed by cocktails and dinner. Please RSVP by August 10th.",
    "extras": " and your plus one" ,  # if needed in other sections
    "extra_actions": ["View the weekend itinerary", "Submit dietary preferences"],
    "preheader": "Final details & your personal portal login for Emily & Tom's wedding.",
    "current_year": 2025,
    "subject": "Wedding Update & Your RSVP Portal",
}


class MessageAllView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        if not request.user.is_superuser:
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data
        include_all = data.get('include_all', False)
        if include_all:
            users = UserAccount.objects.filter(is_active=True).exclude(rsvped=True, coming=False)
        else:
            users = UserAccount.objects.filter(is_active=True, rsvped=False).exclude(rsvped=True, coming=False)
        sent = []
        failed = []

        connection = get_connection(fail_silently=False)  # reuse single SMTP connection
        connection.open()

        host = settings.HOST
        update_title = data.get('update_title', 'Wedding Update & Your RSVP Portal')
        update_body = data.get('update_body')
        tagline = data.get("tagline", "")
        extra_actions = data.get("extra_actions", [])
        preheader = data.get(
            "preheader",
            "Final details & your personal portal login for Emily & Tom's wedding.",
        )
        subject = data.get("subject", "Wedding Update & Your RSVP Portal")

        for user in users:
            try:
                context = {
                    "name": user.get_short_name(),
                    "email": user.email,
                    "domain": host,
                    "update_title": update_title,
                    "update_body": update_body,
                    "tagline": tagline,
                    "extra_actions": extra_actions,
                    "preheader": preheader,
                    "current_year": timezone.now().year,
                    "subject": subject,
                    # If you have logic for plus one or extras, add here
                    "extras": "",  
                }

                html_content = render_to_string("emails/update_email.html", context)
                plain_text_fallback = (
                    f"Hi {user.get_short_name()},\n\n"
                    f"{update_title}\n\n"
                    f"{update_body}\n\n"
                    f"Login at {host}\nEmail: {user.email}\n The password has already been securely sent.\n\n"
                    "With love,\nEmily & Tom"
                )

                to_email = user.email
                msg = EmailMultiAlternatives(
                    subject=subject,
                    body=plain_text_fallback,
                    from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@example.com"),
                    to=[to_email],
                    connection=connection,
                )
                msg.attach_alternative(html_content, "text/html")
                msg.send()
                # mark as invited
                user.sent_invite = True
                user.save(update_fields=["sent_invite"])
                sent.append(user.email)
            except Exception as e:
                failed.append({"email": user.email, "error": str(e)})

        connection.close()

        return JsonResponse(
            {
                "status": "completed",
                "sent_count": len(sent),
                "failed_count": len(failed),
                "failed": failed,
            }
        )




class CreateGuestUsersView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        
        if not request.user.is_superuser:
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        
        data_to_serialize = request.data if type(request.data) == list else [request.data]

        serializer = GuestUserSerializer(data=data_to_serialize, many=True)
        serializer.is_valid(raise_exception=True)

        created_users = []

        for user_data in serializer.validated_data:
            email = user_data['email']

            if UserAccount.objects.filter(email=email).exists():
                continue

            # Generate secure password
            password = secrets.token_urlsafe(10)

            # Create main user
            user = UserAccount.objects.create_user(
                email=email,
                fname=user_data['fname'],
                lname=user_data['lname'],
                password=password,
            )
            user.temp_password = True
            user.is_active = True
            user.sent_invite = True
            user.save()

            # Create partner if provided
            partner_name = user_data.get('partner')
            if partner_name:
                partner_data = Partner.objects.create(
                    partner_main=user,
                    name=partner_name,
                    rsvped=False,
                    coming=False,
                )
                partner_data.save()

            # Create children if provided
            children = user_data.get('children', [])
            for child in children:
                child_data = Child.objects.create(
                    parent=user,
                    name=child['name'],
                    age=child['age'],
                    rsvped=False,
                    coming=False,
                )
                child_data.save()

            extras = []
            if partner_name:
                extras.append(partner_name)

            if children:
                extras.extend([child['name'] for child in children])

            if len(extras) == 0:
                extras_string = ''
            elif len(extras) == 1:
                extras_string = "and " + extras[0]
            else:
                extras_string = ', '.join(extras[0:-1])
                extras_string = ", " + extras_string
                extras_string += ' and ' + extras[-1]


            # Send invite email
            html_message = render_to_string("emails/invite_email.html", {
                "name": user.fname,
                "email": email,
                "password": password,
                "domain": "https://emilyandtom.com",
                "extras": extras_string
            })

            send_mail(
                subject="You're Invited to Emily & Tom's Wedding 🎉",
                message="You've been invited!",
                from_email="no-reply@emilyandtom.com",
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )
            extras.append(user.fname)
            created_users.append(extras)

        return Response({"created_users": created_users}, status=status.HTTP_201_CREATED)
