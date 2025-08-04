from django.urls import include, path
from .views import CreateGuestUsersView, MessageAllView, UserAccountViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"load-all-details", UserAccountViewSet, basename="useraccount")

urlpatterns = [
    path("create-guest-users/", CreateGuestUsersView.as_view(), name="create-guest-users"),
    path("send-wedding-updates/", MessageAllView.as_view(), name='send-wedding-updates'),
    path("", include(router.urls)),  # mounts /users/ and /users/{pk}/
]