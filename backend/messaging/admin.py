from django.contrib import admin
from .models import Message, FAQS

# Register your models here.
admin.site.register(Message)
admin.site.register(FAQS)