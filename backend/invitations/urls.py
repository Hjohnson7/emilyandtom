from django.urls import path
from .views import InvitationView, AccommodationListView

urlpatterns = [
    path("get-invitation/", InvitationView.as_view(), name="get-invitation"),
    path('get-rooms/', AccommodationListView.as_view(), name="get-rooms")
]