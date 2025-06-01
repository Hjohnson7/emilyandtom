from django.db import models

# Create your models here.


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

    ALLERGY_CHOICES = [
        ('NUTS', 'Nuts'),
        ('DAIRY', 'Dairy'),
        ('GLUTEN', 'Gluten'),
        ('SOY', 'Soy'),
        ('EGGS', 'Eggs'),
        ('SHELLFISH', 'Shellfish'),
        ('NONE', 'None'),
    ]

    FOOD_CHOICES = [
        ('VEGGIE', 'Vegetarian'),
        ('VEGAN', 'Vegan'),
        ('MEAT', 'Meat'),
        ('FISH', 'Fish'),
    ]

    timestamp = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)
    arrival_day = models.CharField(max_length=3, choices=ARRIVAL_DAYS)
    bringing_food = models.BooleanField(default=False)
    accommodation = models.CharField(max_length=10, choices=ACCOMMODATION_CHOICES)
    favourite_song = models.CharField(max_length=255, blank=True)
    allergies = models.ManyToManyField('Allergy', blank=True)
    food_selection = models.CharField(max_length=10, choices=FOOD_CHOICES)

    def __str__(self):
        return f"{self.name} RSVP on {self.timestamp.strftime('%Y-%m-%d')}"
    
class Allergy(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
