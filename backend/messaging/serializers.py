from rest_framework import serializers
from .models import Message, FAQS

class MessageSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Message
        fields = [
            'id',
            'user',
            'timestamp',
            'category',
            'message',
            'parent',
            'replies',
            'pinned'
        ]
        read_only_fields = ['user', 'timestamp', 'replies']

    def get_user(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return "Anonymous"

    def get_replies(self, obj):
        if obj.replies.exists():
            return MessageSerializer(obj.replies.all(), many=True, context=self.context).data
        return []

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)


class FAQSerializer(serializers.ModelSerializer):

    class Meta:
        model = FAQS
        fields = [
            'question',
            'answer',
            'category',
        ]



    