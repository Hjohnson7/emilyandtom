from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout 


@ensure_csrf_cookie
def index(request):
    return render(request, 'index.html')


@ensure_csrf_cookie
def set_csrf(request):
    return JsonResponse({"message": "CSRF cookie set"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return JsonResponse({"message": "Hello authenticated user!"})

@permission_classes([AllowAny])
class LoginView(APIView):
    authentication_classes = []
    
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(email=email, password=password)
        if user is not None:
            login(request, user)

            # Optional: Set session expiry (e.g., 1 day)
            request.session.set_expiry(86400)  # 1 day in seconds
            
            refresh = RefreshToken.for_user(user)
            response = Response({"message": "Login successful"})
            response.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                httponly=True,
                samesite="Lax",
                secure=False  # True in production!
            )
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                samesite="Lax",
                secure=False
            )
            return response
        return Response({"error": "Invalid credentials"}, status=400)
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        response = Response({"message": "Logged out successfully"}, status=200)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if refresh_token is None:
            raise AuthenticationFailed('Refresh token not found in cookies.')

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            response = Response({"message": "Token refreshed"}, status=200)
            response.set_cookie('access_token', access_token, httponly=True, samesite='Lax')
            return response

        except TokenError as e:
            raise AuthenticationFailed('Token is invalid or expired')
        
