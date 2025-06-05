from django.urls import path
from .views import MessageViewSet, FAQView, MessageCreateView

urlpatterns = [
    path("get-messages/", MessageViewSet.as_view(), name="get-messages-view"),
    path('messages/', MessageCreateView.as_view(), name='message-create'),
    path("faqs/", FAQView.as_view(), name="faqs-view")
]