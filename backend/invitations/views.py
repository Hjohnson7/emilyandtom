from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from invitations.models import Child, Partner, RSVP, Room, Allergy, GuestPhoto
from rest_framework.response import Response
from rest_framework import status
from .serializers import RSVPSerializer, createRSVPSerializer, MultiGuestPhotoUploadSerializer, GuestPhotoSerializer, GuestPhotoListSerializer
from accounts.models import UserAccount
from django.db import transaction
from django.utils import timezone
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django.conf import settings
from rest_framework.pagination import PageNumberPagination

# Create your views here.

class InvitationView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, BasicAuthentication]

    def get(self, request):
        user = request.user
        
        children_qs = Child.objects.filter(parent=user)
        partner = Partner.objects.filter(partner_main=user).first()

        partner_name = partner.name if partner else None
        
        user_rsvpd = user.rsvped
        partner_rsvpd = partner.rsvped if partner else None
        
        if user_rsvpd:
            user_invite = RSVP.objects.filter(user=user).first()
            user_rsvp_data = RSVPSerializer(user_invite).data

        if partner_rsvpd: 
            user_invite = RSVP.objects.filter(partner=partner).first()
            partner_rsvp_data = RSVPSerializer(user_invite).data

        children = []

        for child in children_qs:
            if child.rsvped:
                invite = RSVP.objects.filter(child=child).first()
                child_rsvp_data = RSVPSerializer(invite).data
            
            children.append(
                {
                    "id": child.pk,
                    "name": child.name, 
                    "age": child.age, 
                    "rsvpd": child.rsvped,
                    'coming': child.coming,
                    "details": child_rsvp_data if child.rsvped else None
                }
            )

        data = {
            "user": {
                "id": user.pk,
                "name": f"{user.fname} {user.lname}",
                "rsvpd": user_rsvpd,
                "details": user_rsvp_data if user_rsvpd else None,
                "coming": user.coming
            },
        }

        if partner_name:
            partner_dict = {
                "id": partner.pk,
                "name": partner_name,
                "rsvpd": partner_rsvpd,
                "details": partner_rsvp_data if partner_rsvpd else None,
                "coming": partner.coming
            }
            data['partner'] = partner_dict

        if children:
            data["children"] = children

        return Response(data, status=status.HTTP_200_OK)


class AccommodationListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        rooms = Room.objects.all()
        data = []

        for room in rooms:
            occupants = RSVP.objects.filter(room=room).values_list("name", flat=True)

            data.append({
                "id": room.id,
                "name": room.name,
                "type": room.room_type,  # Gets readable label
                "total": room.capacity,
                "available": room.capacity - len(list(occupants)),
                "occupants": list(occupants),
                "selected": [],
                'notes': room.notes
            })

        return Response(data)

class AllergyListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        allergies = Allergy.objects.all()

        data = {}
        for allergy in allergies:
            data[str(allergy.pk)] = allergy.name

        return Response(data)

class RSVPViewOld(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        errors = []
        created = []
        for rsvp in data:
            user_info = rsvp.get('user_info')
            role = user_info.get('role')
            if role == 'partner':
                user = Partner.objects.filter(pk=user_info.get('id')).first()
                rsvp['partner'] = user.pk
            elif role == 'child': 
                user = Child.objects.filter(pk=user_info.get('id')).first()
                rsvp['child'] = user.pk
            else:
                user = UserAccount.objects.filter(pk=user_info.get('id')).first()
                rsvp['user'] = user.pk

            if rsvp.get('notAttending') == True:
                user.coming = False
                user.rsvped = True
                user.save()
            else:
                serializer = createRSVPSerializer(data=rsvp)
                if serializer.is_valid():
                    serializer.save()
                    user.coming = True
                    user.rsvped = True
                    user.save()
                    created.append(serializer.data)
                else:
                    errors.append(serializer.errors)
        if len(errors) > 0:
            return Response({'errors': errors, 'success': created}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'errors': errors, 'success': created}, status=status.HTTP_201_CREATED)
        

class RSVPView(APIView):
    permission_classes = [IsAuthenticated]

    BRIDE_GROOM_EMAILS = ["arryjohnson@hotmail.co.uk"]
    FROM_EMAIL = settings.DEFAULT_FROM_EMAIL  # ensure configured

    def _send_html_email(self, subject, to_list, template_name, context):
        html_content = render_to_string(template_name, context)
        text_content = strip_tags(html_content)
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=self.FROM_EMAIL,
            to=to_list if isinstance(to_list, list) else [to_list],
        )
        email.attach_alternative(html_content, "text/html")
        try:
            email.send(fail_silently=False)
        except Exception:
            # Ideally log failure
            pass

    def post(self, request):
        data = request.data  # expecting list of RSVP-like dicts
        errors = []
        created = []
        entries_for_email = []
        primary_user_obj = None
        primary_email = None
        primary_name = None
        bell_tent_selected = None


        with transaction.atomic():
            for rsvp in data:
                user_info = rsvp.get('user_info') or {}
                role = user_info.get('role')
                user = None

                if role == 'partner':
                    user = Partner.objects.filter(pk=user_info.get('id')).first()
                    rsvp['partner'] = user.pk if user else None
                elif role == 'child':
                    user = Child.objects.filter(pk=user_info.get('id')).first()
                    rsvp['child'] = user.pk if user else None
                else:
                    user = UserAccount.objects.filter(pk=user_info.get('id')).first()
                    rsvp['user'] = user.pk if user else None

                if not user:
                    errors.append({'user_info': f"Could not find user with id {user_info.get('id')} and role {role}"})
                    continue

                # Determine primary user for email: prefer the one with role "user", else partner fallback
                if role == 'user' and not primary_user_obj:
                    primary_user_obj = user
                    primary_email = getattr(user, 'email', None)
                    primary_name = f"{getattr(user, 'fname', '')} {getattr(user, 'lname', '')}".strip() or rsvp.get('name')
                elif role == 'partner' and not primary_user_obj:
                    primary_user_obj = user
                    primary_email = getattr(user, 'email', None)
                    primary_name = getattr(user, 'name', None) or rsvp.get('name')

                is_not_attending = rsvp.get('notAttending') in [True, "no", "No", "NO"]
                try:
                    if is_not_attending:
                        user.coming = False
                        user.rsvped = True
                        user.save()
                    else:
                        serializer = createRSVPSerializer(data=rsvp)
                        if serializer.is_valid():
                            saved = serializer.save()
                            created.append(serializer.data)
                        else:
                            errors.append(serializer.errors)
                            continue  # skip adding to email summary if invalid
                        user.coming = True
                        user.rsvped = True
                        user.save()
                    # Build a normalized entry for the email summary
                    room_name = None
                    if rsvp.get("room"):
                        room = Room.objects.filter(pk=rsvp.get("room")).first()
                        if room.room_type == 'TENT' and not bell_tent_selected:
                            bell_tent_selected = 'Yes'
                        room_name = room.name
                    allergy_names = []
                    if rsvp.get('allergies'):
                        allergies = [int(alg) for alg in rsvp.get('allergies')]
                        allergies_filtered = Allergy.objects.filter(pk__in=allergies)
                        allergy_names = [alg.name for alg in allergies_filtered]
                    entry = {
                        "name": rsvp.get("name") or (getattr(user, "name", None) if role != "user" else f"{getattr(user,'fname','')} {getattr(user,'lname','')}"),
                        "role": role,
                        "is_attending": not is_not_attending,
                        "attending_text": "Yes" if not is_not_attending else "No",
                        "arrival_day": 'Friday' if rsvp.get("arrival_day") == 'FRI' else 'Saturday',
                        "room": room_name,
                        "food_selection": rsvp.get("food_selection"),
                        "allergies": ", ".join(allergy_names or []),
                        "message": rsvp.get("message") or "",
                        "purchasing_food": 'Yes' if rsvp.get('purchasing_food') else 'No',
                    }
                    entries_for_email.append(entry)
                except Exception as e:
                    errors.append({'exception': str(e)})

        # Send single email to primary user if we have one and email exists
        if primary_email and entries_for_email:
            timestamp = timezone.now().strftime("%Y-%m-%d %H:%M:%S %Z")
            update_link = ""  # build if you have a URL to edit their RSVP, e.g., f"https://your.site/rsvp/{primary_user_obj.pk}/edit"
            self._send_html_email(
                subject="Your RSVP Summary",
                to_list=primary_email,
                template_name="emails/summary.html",
                context={
                    "primary_name": primary_name or "Guest",
                    "entries": entries_for_email,
                    "timestamp": timestamp,
                    "update_link": update_link,
                    "require_payment": bell_tent_selected
                },
            )

        # Optionally notify bride & groom (summary of all)
        try:
            if entries_for_email:
                bg_context = {
                    "primary_name": primary_name or "Unknown",
                    "entries": entries_for_email,
                    "timestamp": timezone.now().strftime("%Y-%m-%d %H:%M:%S %Z"),
                    "update_link": "",  # if relevant
                }
                self._send_html_email(
                    subject=f"RSVP update for {primary_name}",
                    to_list=self.BRIDE_GROOM_EMAILS,
                    template_name="emails/summary.html",
                    context=bg_context,
                )
        except Exception:
            pass  # swallow to not break main flow

        status_code = status.HTTP_201_CREATED if not errors else status.HTTP_400_BAD_REQUEST
        return Response({'errors': errors, 'success': created}, status=status_code)
    

class GuestPhotoUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Accepts multipart/form-data with one or more images under "images" key.
        Returns created GuestPhoto(s).
        """
        serializer = MultiGuestPhotoUploadSerializer(data=request.data, context={"request": request})
        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        created_photos = serializer.save()  # list of GuestPhoto instances
        output = GuestPhotoSerializer(created_photos, many=True, context={"request": request}).data
        return Response({"photos": output}, status=status.HTTP_201_CREATED)

    def get(self, request):
        """
        Optional: list the authenticated user's uploaded photos
        """
        photos = GuestPhoto.objects.filter(user=request.user).order_by("-upload_timestamp")
        serializer = GuestPhotoSerializer(photos, many=True, context={"request": request})
        return Response({"photos": serializer.data}, status=status.HTTP_200_OK)
    

class GuestPhotoListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GET /api/guest-photos/           -> user's own photos
        GET /api/guest-photos/?all=true  -> all photos (only if staff)
        Optional: ?page= for pagination
        """
        qs = GuestPhoto.objects.all().order_by("-upload_timestamp")
        show_all = request.query_params.get("all") in ["1", "true", "True"]

        if not show_all or not request.user.is_staff:
            qs = qs.filter(user=request.user)

        paginator = PageNumberPagination()
        paginator.page_size = 20  # adjust as needed or expose as param with limits
        paginated = paginator.paginate_queryset(qs, request)

        serializer = GuestPhotoListSerializer(paginated, many=True, context={"request": request})
        return paginator.get_paginated_response({"photos": serializer.data})