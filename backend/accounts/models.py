from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
# Create your models here.

class UserAccountManager(BaseUserManager):
    def create_user(self, email, fname, lname, password):
        if not email:
            raise ValueError("Users must have an email address")
        
        email = self.normalize_email(email)
        user = self.model(email=email, fname=fname, lname=lname)

        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, fname, lname, password):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email, fname=fname, lname=lname, is_staff=True, is_superuser=True, is_admin=True, is_active=True)
        user.set_password(password)
        user.save()
        return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    fname = models.CharField(max_length=255)
    lname = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)
    sent_invite = models.BooleanField(default=False)
    rsvped = models.BooleanField(default=False)
    coming = models.BooleanField(default=True)
    quiz_response = models.BooleanField(default=False)
    temp_password = models.BooleanField(default=True)
    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ["fname", "lname"]

    def get_full_name(self):
        return self.fname + " " + self.lname

    def get_short_name(self):
        return self.fname

    def get_email_address(self):
        return self.email

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'