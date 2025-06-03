from django.db import models
from django.contrib.auth import get_user_model
from accounts.models import UserAccount

User = get_user_model()


class Allergy(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Room(models.Model):
    ROOM_TYPES = [
        ('BUNK', 'Bunk Room'),
        ('TENT', 'Bell Tent'),
        ('CAMPER', 'Campervan Spot'),
    ]

    name = models.CharField(max_length=100)
    room_type = models.CharField(max_length=10, choices=ROOM_TYPES)
    capacity = models.PositiveIntegerField()
    notes = models.TextField(blank=True)

    def current_occupants(self):
        return self.rsvp_set.count()

    def available_spots(self):
        return self.capacity - self.current_occupants()

    def __str__(self):
        return f"{self.name} ({self.room_type}) - {self.current_occupants()}/{self.capacity} booked"


class Guest(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class RSVP(models.Model):
    ARRIVAL_DAYS = [
        ('FRI', 'Friday'),
        ('SAT', 'Saturday'),
        ('SUN', 'Sunday'),
    ]

    ACCOMMODATION_CHOICES = [
        ('BUNK', 'Bunk Bed'),
        ('TENT', 'Bell Tent'),
        ('CAMPER', 'Campervan'),
    ]

    FOOD_CHOICES = [
        ('VEGGIE', 'Vegetarian'),
        ('VEGAN', 'Vegan'),
        ('MEAT', 'Meat'),
        ('FISH', 'Fish'),
    ]

    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(UserAccount, on_delete=models.SET_NULL, blank=True, null=True)
    guest = models.ForeignKey(Guest, on_delete=models.SET_NULL, blank=True, null=True)

    name = models.CharField(max_length=255)
    arrival_day = models.CharField(max_length=3, choices=ARRIVAL_DAYS)
    bringing_food = models.BooleanField(default=False)
    accommodation = models.CharField(max_length=10, choices=ACCOMMODATION_CHOICES)
    favourite_song = models.CharField(max_length=255, blank=True)
    allergies = models.ManyToManyField(Allergy, blank=True)
    food_selection = models.CharField(max_length=10, choices=FOOD_CHOICES)

    # Booking a room
    room = models.ForeignKey(Room, null=True, blank=True, on_delete=models.SET_NULL, related_name='guests')

    def clean(self):
        from django.core.exceptions import ValidationError
        if not self.user and not self.guest:
            raise ValidationError("An RSVP must be linked to either a user or a guest.")
        if self.user and self.guest:
            raise ValidationError("An RSVP can only be linked to one of: user or guest.")

    def __str__(self):
        return f"{self.name} RSVP on {self.timestamp.strftime('%Y-%m-%d')}"