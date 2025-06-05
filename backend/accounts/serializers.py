from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'fname', 'lname', 'password', 're_password')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'fname', 'lname', 'is_staff', 'is_admin', 'sent_invite', 'rsvped', 'quiz_response', 'temp_password')  # Include is_staff


class ChildInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=30)
    age = serializers.IntegerField(min_value=0)

class GuestUserSerializer(serializers.Serializer):
    fname = serializers.CharField()
    lname = serializers.CharField()
    email = serializers.EmailField()
    partner = serializers.CharField(allow_blank=True, required=False)
    children = ChildInputSerializer(many=True, required=False)