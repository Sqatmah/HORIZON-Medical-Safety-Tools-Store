from django.contrib import admin
from .models import Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name_en', 'category', 'price', 'stock', 'status', 'is_featured']
    list_filter = ['status', 'category', 'is_featured', 'is_best_seller']
    search_fields = ['name_en', 'name_ar', 'sku']
    prepopulated_fields = {'slug': ('name_en',)}
    inlines = [ProductImageInline]
    list_editable = ['status']