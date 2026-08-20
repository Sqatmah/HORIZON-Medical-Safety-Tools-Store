from rest_framework import viewsets
from .models import Category
from .serializers import CategorySerializer
from apps.core.permissions import IsAdminOrSuperAdmin


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrSuperAdmin]