from rest_framework import serializers
from .models import RSVP, Allergy, Room, GuestPhoto
from io import BytesIO
from django.core.files.base import ContentFile
from PIL import Image
import pillow_heif

# Enable HEIC/HEIF reading in Pillow
pillow_heif.register_heif_opener()

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
    room_name = serializers.SerializerMethodField()
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
            'purchasing_food',
            'favourite_song',
            'allergies',
            'food_selection',
            'room_name',
            'room',
            'message'
        ]

    def get_user_name(self, obj):
        return f"{obj.user.fname} {obj.user.lname}" if obj.user else None

    def get_guest_name(self, obj):
        return str(obj.guest) if obj.guest else None

    def get_partner_name(self, obj):
        return obj.partner.name if obj.partner else None

    def get_child_name(self, obj):
        return obj.child.name if obj.child else None
    
    def get_room_name(self, obj):
        return obj.room.name if obj.room else None


class createRSVPSerializer(serializers.ModelSerializer):
    class Meta:
        model = RSVP
        fields = '__all__'


class GuestPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuestPhoto
        fields = ["id", "user", "image", "upload_timestamp"]
        read_only_fields = ["id", "upload_timestamp", "user"]

class MultiGuestPhotoUploadSerializer(serializers.Serializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        allow_empty=False,
        write_only=True
    )

    def create(self, validated_data):
        user = self.context["request"].user
        images = validated_data["images"]
        created = []

        for img in images:
            # Detect HEIC/HEIF from filename or content type
            is_heic = (
                img.name.lower().endswith((".heic", ".heif"))
                or getattr(img, "content_type", "").lower() in ("image/heic", "image/heif")
            )

            if is_heic:
                # Open and convert to JPEG in-memory
                image = Image.open(img)
                buffer = BytesIO()
                image = image.convert("RGB")  # Ensure no alpha channel for JPEG
                image.save(buffer, format="JPEG", quality=95)

                # Replace the file with converted JPEG
                img = ContentFile(
                    buffer.getvalue(),
                    name=img.name.rsplit(".", 1)[0] + ".jpg"
                )

            photo = GuestPhoto.objects.create(user=user, image=img)
            created.append(photo)

        return created

    def to_representation(self, instance):
        return GuestPhotoSerializer(instance, many=True, context=self.context).data
    

class GuestPhotoListSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = GuestPhoto
        fields = ["id", "image_url", "upload_timestamp", "user"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if not obj.image:
            return None
        return request.build_absolute_uri(obj.image.url)