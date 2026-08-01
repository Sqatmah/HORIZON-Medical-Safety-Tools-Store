from django.db import models
from apps.categories.models import Category
from django.conf import settings


class Product(models.Model):
    STATUS_CHOICES = (
        ('published', 'Published'),
        ('draft', 'Draft'),
        ('hidden', 'Hidden'),
    )

    name_en = models.CharField(max_length=255)
    name_ar = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)

    short_desc_en = models.CharField(max_length=500, blank=True)
    short_desc_ar = models.CharField(max_length=500, blank=True)
    desc_en = models.TextField(blank=True)
    desc_ar = models.TextField(blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sku = models.CharField(max_length=100, blank=True)
    stock = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=5)

    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    subcategory = models.ForeignKey(
        Category, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='sub_products'
    )
    brand = models.CharField(max_length=150, blank=True)
    video_url = models.URLField(blank=True)

    tags = models.JSONField(default=list, blank=True)
    specs = models.JSONField(default=list, blank=True)
    variants = models.JSONField(default=list, blank=True)

    rating_avg = models.FloatField(default=0)
    rating_count = models.PositiveIntegerField(default=0)
    quantity_sold = models.PositiveIntegerField(default=0)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_best_seller = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)

    sfda_number = models.CharField(max_length=100, blank=True)
    country_of_origin = models.CharField(max_length=100, blank=True)
    warranty_en = models.CharField(max_length=255, blank=True)
    warranty_ar = models.CharField(max_length=255, blank=True)
    compliance_standard = models.CharField(max_length=255, blank=True)

    meta_title_en = models.CharField(max_length=255, blank=True)
    meta_title_ar = models.CharField(max_length=255, blank=True)
    meta_desc_en = models.CharField(max_length=500, blank=True)
    meta_desc_ar = models.CharField(max_length=500, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )

    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['category']),
            models.Index(fields=['sku']),
        ]

    def __str__(self):
        return self.name_en


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/')
    sort_order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.product.name_en} - image {self.sort_order}"