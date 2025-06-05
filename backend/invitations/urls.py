from django.urls import path
from .views import InvitationView

urlpatterns = [
    path("get-invitation/", InvitationView.as_view(), name="get-invitation"),
]