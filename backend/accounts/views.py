from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAdminUser

from django.template.loader import render_to_string
from django.core.mail import send_mail
import secrets

from .models import UserAccount, Partner, Child
from .serializers import GuestUserSerializer



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



class CreateGuestUsersView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAdminUser]

    def post(self, request):
        if not request.user.is_superuser:
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

        serializer = GuestUserSerializer(data=request.data, many=True)
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
                Partner.objects.create(
                    partner_main=user,
                    name=partner_name,
                    completed=False,
                    coming=False,
                )

            # Create children if provided
            children = user_data.get('children', [])
            for child in children:
                Child.objects.create(
                    parent=user,
                    name=child['name'],
                    age=child['age'],
                    completed=False,
                    coming=False,
                )

            # Send invite email
            html_message = render_to_string("emails/invite_email.html", {
                "name": user.get_full_name(),
                "email": email,
                "password": password,
                "domain": "https://emilyandtom.com"
            })

            send_mail(
                subject="You're Invited to Emily & Tom's Wedding 🎉",
                message="You've been invited!",
                from_email="no-reply@emilyandtom.com",
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )

            created_users.append(user.email)

        return Response({"created_users": created_users}, status=status.HTTP_201_CREATED)
