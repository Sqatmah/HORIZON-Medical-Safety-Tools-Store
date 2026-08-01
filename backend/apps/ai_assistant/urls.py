from django.urls import path
from .views import AnalyzeProductImageView

urlpatterns = [
    path('analyze-product/', AnalyzeProductImageView.as_view(), name='analyze_product'),
]