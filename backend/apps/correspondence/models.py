from django.db import models
from django.conf import settings


class Correspondence(models.Model):
    RECIPIENT_TYPE_CHOICES = (
        ('individual', 'عميل شخصي'),
        ('company', 'شركة'),
        ('government', 'جهة حكومية'),
    )
    PURPOSE_CHOICES = (
        ('quotation', 'تقديم عرض سعر'),
        ('order_confirmation', 'تأكيد على طلبية'),
    )
    recipient_name = models.CharField(max_length=200)
    recipient_email = models.EmailField()
    recipient_type = models.CharField(max_length=20, choices=RECIPIENT_TYPE_CHOICES)
    purpose = models.CharField(max_length=30, choices=PURPOSE_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    quantity = models.PositiveIntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.recipient_name} - {self.get_purpose_display()}"