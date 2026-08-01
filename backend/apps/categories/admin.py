from django.contrib import admin
from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name_en', 'name_ar', 'parent', 'is_active', 'sort_order']
    list_filter = ['is_active']
    search_fields = ['name_en', 'name_ar']
    prepopulated_fields = {'slug': ('name_en',)}