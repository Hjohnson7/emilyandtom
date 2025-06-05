from django.shortcuts import render
from rest_framework import permissions, generics
from .models import Message, FAQS
from .serializers import MessageSerializer, FAQSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

class MessageViewSet(generics.ListAPIView):
    queryset = Message.objects.all().select_related('user').prefetch_related('replies')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Optional: only show top-level by default
        queryset = super().get_queryset().filter(parent__isnull=True).order_by('-timestamp')
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category.upper())
        return queryset
    
    def list(self, request, *args, **kwargs):
        """
        Override the list method to ensure holidays are serialized.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class MessageCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

class FAQView(APIView):

    def get(self):
        faqs = FAQS.objects.filter(display=False)

        return Response(FAQSerializer(faqs).data)
