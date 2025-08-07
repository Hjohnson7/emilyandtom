from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework import serializers
from .models import (
    UserAccount
)
from invitations.models import (
    Partner,
    Child,
    RSVP,
    Allergy,
    Room
)

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


class AllergySerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergy
        fields = ["id", "name"]  # adjust if your Allergy has different fields


class RSVPSerializer(serializers.ModelSerializer):
    allergies = AllergySerializer(many=True)
    user = serializers.SerializerMethodField()
    partner = serializers.SerializerMethodField()
    child = serializers.SerializerMethodField()

    class Meta:
        model = RSVP
        fields = [
            "id",
            "timestamp",
            "name",
            "arrival_day",
            "purchasing_food",
            "favourite_song",
            "food_selection",
            "message",
            "room",
            "allergies",
            "user",
            "partner",
            "child",
        ]

    def get_user(self, obj):
        if obj.user:
            return {
                "id": obj.user.id,
                "email": obj.user.email,
                "full_name": obj.user.get_full_name(),
                "rsvped": obj.user.rsvped,
                "coming": obj.user.coming,
            }
        return None

    def get_partner(self, obj):
        if obj.partner:
            return {
                "id": obj.partner.id,
                "name": obj.partner.name,
                "rsvped": obj.partner.rsvped,
                "coming": obj.partner.coming,
            }
        return None

    def get_child(self, obj):
        if obj.child:
            return {
                "id": obj.child.id,
                "name": obj.child.name,
                "age": obj.child.age,
                "rsvped": obj.child.rsvped,
                "coming": obj.child.coming,
            }
        return None


class ChildSerializer(serializers.ModelSerializer):
    rsvp = serializers.SerializerMethodField()

    class Meta:
        model = Child
        fields = ["id", "name", "age", "rsvped", "coming", "rsvp"]

    def get_rsvp(self, obj):
        rsvp = RSVP.objects.filter(child=obj).select_related("room").prefetch_related("allergies").first()
        if rsvp:
            return RSVPSerializer(rsvp).data
        return None


class PartnerSerializer(serializers.ModelSerializer):
    rsvp = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = ["id", "name", "rsvped", "coming", "rsvp"]

    def get_rsvp(self, obj):
        rsvp = RSVP.objects.filter(partner=obj).select_related("room").prefetch_related("allergies").first()
        if rsvp:
            return RSVPSerializer(rsvp).data
        return None


class UserAccountDetailSerializer(serializers.ModelSerializer):
    partner = serializers.SerializerMethodField()
    children = ChildSerializer(many=True, source="child_set")
    rsvps = serializers.SerializerMethodField()

    class Meta:
        model = UserAccount
        fields = [
            "id",
            "email",
            "fname",
            "lname",
            "rsvped",
            "coming",
            "sent_invite",
            "quiz_response",
            "partner",
            "children",
            "rsvps",
        ]

    def get_partner(self, obj):
        partner = Partner.objects.filter(partner_main=obj).first()
        if partner:
            return PartnerSerializer(partner).data
        return None

    def get_rsvps(self, obj):
        rsvps = RSVP.objects.filter(user=obj).select_related("room").prefetch_related("allergies")
        return RSVPSerializer(rsvps, many=True).data
