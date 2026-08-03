from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('معلومات إضافية', {'fields': ('role', 'phone', 'is_email_verified')}),
    )
    list_display = ['username', 'email', 'role', 'is_staff']


admin.site.register(User, CustomUserAdmin)