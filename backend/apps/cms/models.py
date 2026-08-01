from django.db import models


class Banner(models.Model):
    title_en = models.CharField(max_length=255)
    title_ar = models.CharField(max_length=255)
    subtitle_en = models.CharField(max_length=255, blank=True)
    subtitle_ar = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='banners/')
    link = models.URLField(blank=True)
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['sort_order']

    def __str__(self):
        return self.title_en


class StaticPage(models.Model):
    slug = models.SlugField(unique=True)
    title_en = models.CharField(max_length=255)
    title_ar = models.CharField(max_length=255)
    content_en = models.TextField(blank=True)
    content_ar = models.TextField(blank=True)
    meta_title_en = models.CharField(max_length=255, blank=True)
    meta_title_ar = models.CharField(max_length=255, blank=True)
    meta_desc_en = models.CharField(max_length=500, blank=True)
    meta_desc_ar = models.CharField(max_length=500, blank=True)
    is_published = models.BooleanField(default=True)

    def __str__(self):
        return self.title_en


class SiteSetting(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value_en = models.CharField(max_length=500, blank=True)
    value_ar = models.CharField(max_length=500, blank=True)
    value_json = models.JSONField(null=True, blank=True)
    group = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.key


class Client(models.Model):
    name_en = models.CharField(max_length=150, blank=True)
    name_ar = models.CharField(max_length=150, blank=True)
    logo = models.ImageField(upload_to='clients/')
    link = models.URLField(blank=True)
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['sort_order']

    def __str__(self):
        return self.name_en or f"Client {self.id}"