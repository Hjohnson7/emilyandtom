from rest_framework import serializers
from .models import RSVP, Allergy, Room

class RSVPSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    guest_name = serializers.SerializerMethodField()
    partner_name = serializers.SerializerMethodField()
    child_name = serializers.SerializerMethodField()
    allergies = serializers.SlugRelatedField(
        many=True,
        queryset=Allergy.objects.all(),
        slug_field='name'
    )
    room = serializers.StringRelatedField()

    class Meta:
        model = RSVP
        fields = [
            'id',
            'timestamp',
            'name',
            'user_name',
            'guest_name',
            'partner_name',
            'child_name',
            'arrival_day',
            'bringing_food',
            'accommodation',
            'favourite_song',
            'allergies',
            'food_selection',
            'room',
        ]

    def get_user_name(self, obj):
        return f"{obj.user.fname} {obj.user.lname}" if obj.user else None

    def get_guest_name(self, obj):
        return str(obj.guest) if obj.guest else None

    def get_partner_name(self, obj):
        return obj.partner.name if obj.partner else None

    def get_child_name(self, obj):
        return obj.child.name if obj.child else None
