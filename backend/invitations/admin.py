# Register your models here.
from django.contrib import admin
from .models import RSVP

@admin.register(RSVP)
class RSVPAdmin(admin.ModelAdmin):
    list_display = ('name', 'arrival_day', 'bringing_food', 'accommodation', 'food_selection', 'timestamp')
    list_filter = ('arrival_day', 'bringing_food', 'accommodation', 'food_selection', 'allergies')
    search_fields = ('name', 'favourite_song')
