from django.db import models


class ShippingZone(models.Model):
    name_en = models.CharField(max_length=150)
    name_ar = models.CharField(max_length=150)
    cities = models.JSONField(default=list)  # قائمة أسماء مدن
    rate = models.DecimalField(max_digits=10, decimal_places=2)
    free_above = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    estimated_days_en = models.CharField(max_length=100, blank=True)
    estimated_days_ar = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name_en