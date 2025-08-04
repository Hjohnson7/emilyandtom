from django import forms
from .models import RSVP

class RSVPForm(forms.ModelForm):
    class Meta:
        model = RSVP
        fields = [
            'name',
            'arrival_day',
            'purchasing_food',
            'favourite_song',
            'allergies',
            'food_selection'
        ]
        widgets = {
            'arrival_day': forms.Select(),
            'purchasing_food': forms.CheckboxInput(),
            'allergies': forms.Select(),
            'food_selection': forms.Select(),
        }
