from django.contrib import admin
from .models import Banner, StaticPage, SiteSetting, Client, ContactMessage


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ['title_en', 'is_active', 'sort_order', 'start_date', 'end_date']
    list_editable = ['is_active', 'sort_order']


@admin.register(StaticPage)
class StaticPageAdmin(admin.ModelAdmin):
    list_display = ['title_en', 'slug', 'is_published']
    prepopulated_fields = {'slug': ('title_en',)}


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ['key', 'value_en', 'group']
    search_fields = ['key']


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['name_en', 'is_active', 'sort_order']
    list_editable = ['is_active', 'sort_order']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'phone', 'is_read', 'created_at']
    list_editable = ['is_read']
    list_filter = ['is_read']    