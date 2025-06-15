# Register your models here.
from django.contrib import admin
from .models import RSVP, Room, Allergy, Guest, Partner, Child

class AllergyAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


class RSVPAdmin(admin.ModelAdmin):
    list_display = ['name', 'arrival_day', 'accommodation', 'food_selection', 'room', 'timestamp']
    list_filter = ['arrival_day', 'accommodation', 'food_selection', 'room']
    search_fields = ['name', 'favourite_song']
    autocomplete_fields = ['user', 'allergies', 'room']
    readonly_fields = ['timestamp']


class RoomAdmin(admin.ModelAdmin):
    list_display = ['name', 'room_type', 'capacity']
    list_filter = ['room_type']
    search_fields = ['name']

    def current_occupants_display(self, obj):
        return obj.current_occupants()
    current_occupants_display.short_description = 'Currently Booked'

    def available_spots_display(self, obj):
        return obj.available_spots()
    available_spots_display.short_description = 'Available Spots'

class GuestAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email']
    search_fields = ['first_name', 'last_name', 'email']

admin.site.register(Guest, GuestAdmin)
admin.site.register(Allergy, AllergyAdmin)
admin.site.register(RSVP, RSVPAdmin)
admin.site.register(Room, RoomAdmin)
admin.site.register(Partner)
admin.site.register(Child)


