from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer

    def get_queryset(self):
        qs = Product.objects.all()
        # الزائر أو المستخدم العادي يشوف بس المنتجات المنشورة
        # الأدمن يشوف كل شي
        user = self.request.user
        if not (user.is_authenticated and getattr(user, 'is_admin_role', False)):
            qs = qs.filter(status='published')
        return qs

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)