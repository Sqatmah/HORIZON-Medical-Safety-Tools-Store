from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin'),
        ('super_admin', 'Super Admin'),
    )
    CUSTOMER_TYPE_CHOICES = (
        ('individual', 'شخصي'),
        ('company', 'شركة'),
        ('government', 'جهة حكومية'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    customer_type = models.CharField(max_length=20, choices=CUSTOMER_TYPE_CHOICES, default='individual')
    phone = models.CharField(max_length=20, blank=True)
    is_email_verified = models.BooleanField(default=False)

    @property
    def is_admin_role(self):
        return self.role in ('admin', 'super_admin')

    @property
    def is_super_admin_role(self):
        return self.role == 'super_admin'