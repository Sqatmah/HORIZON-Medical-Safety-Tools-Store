from django.db import models
from django.conf import settings
from apps.products.models import Product


class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=150, blank=True)
    rating = models.PositiveSmallIntegerField()  # من 1 لـ 5
    comment = models.TextField(blank=True)
    images = models.JSONField(default=list, blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.product.name_en} - {self.rating}★ by {self.customer_name or self.user.username}"