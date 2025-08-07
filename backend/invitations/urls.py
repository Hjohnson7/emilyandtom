from django.urls import path
from .views import InvitationView, AccommodationListView, RSVPView, AllergyListView, GuestPhotoUploadView, GuestPhotoListView

urlpatterns = [
    path("get-invitation/", InvitationView.as_view(), name="get-invitation"),
    path('get-rooms/', AccommodationListView.as_view(), name="get-rooms"),
    path('get-allergies/', AllergyListView.as_view(), name="get-allergies"),
    path('submit-rsvps/', RSVPView.as_view(), name='submit-rsvps'),
    path("guest-photos/", GuestPhotoUploadView.as_view(), name="guest-photo-upload"),
    path("guest-photos/list/", GuestPhotoListView.as_view(), name="guest-photo-list"),

]