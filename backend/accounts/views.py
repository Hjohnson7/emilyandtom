# views.py
from django.template.loader import render_to_string
from rest_framework.permissions import IsAdminUser
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.conf import settings

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

            password = secrets.token_urlsafe(10)
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

            html_message = render_to_string("emails/invite_email.html", {
                "name": user.get_full_name(),
                "email": email,
                "password": password,
                "domain": "https://emilyandtom.com"
            })

            send_mail(
                subject="You're Invited to Emily & Tom's Wedding 🎉",
                message="You've been invited!",  # plain text fallback
                from_email="no-reply@emilyandtom.com",
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )

            created_users.append(user.email)

        return Response({"created_users": created_users}, status=status.HTTP_201_CREATED)
