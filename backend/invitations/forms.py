from django import forms
from .models import RSVP

class RSVPForm(forms.ModelForm):
    class Meta:
        model = RSVP
        fields = [
            'name',
            'arrival_day',
            'bringing_food',
            'accommodation',
            'favourite_song',
            'allergies',
            'food_selection'
        ]
        widgets = {
            'arrival_day': forms.Select(),
            'bringing_food': forms.CheckboxInput(),
            'accommodation': forms.Select(),
            'allergies': forms.Select(),
            'food_selection': forms.Select(),
        }
