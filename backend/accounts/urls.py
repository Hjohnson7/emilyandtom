from django.urls import path
from .views import CreateGuestUsersView

urlpatterns = [
    path("create-guest-users/", CreateGuestUsersView.as_view(), name="create-guest-users"),
]