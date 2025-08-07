from django.db import models
from django.utils import timezone
from accounts.models import UserAccount
# Create your models here.


from django.db import models
from django.utils import timezone

class Message(models.Model):
    CATEGORY_CHOICES = [
        ('TRAVEL', 'Travel'),
        ('GENERAL', 'General'),
        ('ACCOMMODATION', 'Accommodation'),
    ]

    user = models.ForeignKey(UserAccount, on_delete=models.SET_NULL, blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)
    category = models.CharField(max_length=15, choices=CATEGORY_CHOICES)
    message = models.TextField()
    pinned = models.BooleanField(default=False)
    # New field to support replies
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        related_name='replies',
        on_delete=models.CASCADE
    )

    def is_reply(self):
        return self.parent is not None

    def __str__(self):
        if self.is_reply():
            return f"Reply by {self.user} to {self.parent.id}"
        return f"Message by {self.user} in {self.category}"
    
    class Meta:
        ordering = ['-timestamp']


class FAQS(models.Model):

    FAQ_CHOICES = [
        ('GENERAL', 'General'),
        ('TRAVEL', 'Travel'),
        ('ATTIRE', 'Attire'),
        ('INVITATION', 'Invitation'),
    ]

    display = models.BooleanField(default=True)
    question = models.CharField()
    category = models.CharField(max_length=15, choices=FAQ_CHOICES)
    answer = models.CharField()
    main_screen = models.BooleanField(default=False)