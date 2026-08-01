from django.db import models


class Category(models.Model):
    name_en = models.CharField(max_length=200)
    name_ar = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey(
        'self', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='children'
    )
    icon = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    description_en = models.TextField(blank=True)
    description_ar = models.TextField(blank=True)
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name_en