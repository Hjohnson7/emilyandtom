from django.urls import path
from .views import InvitationView, AccommodationListView, RSVPView, AllergyListView

urlpatterns = [
    path("get-invitation/", InvitationView.as_view(), name="get-invitation"),
    path('get-rooms/', AccommodationListView.as_view(), name="get-rooms"),
    path('get-allergies/', AllergyListView.as_view(), name="get-allergies"),
    path('submit-rsvps/', RSVPView.as_view(), name='submit-rsvps')
]