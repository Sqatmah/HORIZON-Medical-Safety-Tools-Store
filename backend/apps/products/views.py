from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from django.db import models
from .models import Product, ProductImage
from .serializers import ProductSerializer, ProductImageSerializer


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_queryset(self):
        qs = Product.objects.all()
        user = self.request.user
        if not (user.is_authenticated and getattr(user, 'is_admin_role', False)):
            qs = qs.filter(status='published')

        params = self.request.query_params

        category = params.get('category')
        if category:
            qs = qs.filter(category_id=category)

        for bool_field in ['is_featured', 'is_best_seller', 'is_new_arrival']:
            value = params.get(bool_field)
            if value is not None:
                qs = qs.filter(**{bool_field: value.lower() == 'true'})

        search = params.get('search')
        if search:
            qs = qs.filter(
                models.Q(name_ar__icontains=search) |
                models.Q(name_en__icontains=search) |
                models.Q(sku__icontains=search) |
                models.Q(desc_ar__icontains=search) |
                models.Q(desc_en__icontains=search) |
                models.Q(short_desc_ar__icontains=search) |
                models.Q(short_desc_en__icontains=search)
            )

        ordering = params.get('ordering')
        if ordering in ['price', '-price']:
            qs = qs.order_by(ordering)

        return qs

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_image(self, request, pk=None):
        product = self.get_object()
        images = request.FILES.getlist('images')
        if not images:
            return Response({'error': 'الصورة مطلوبة'}, status=400)

        created = []
        start_order = product.images.count()
        for i, image in enumerate(images):
            img = ProductImage.objects.create(
                product=product, image=image, sort_order=start_order + i
            )
            created.append(img)

        return Response(ProductImageSerializer(created, many=True).data, status=201)

    @action(detail=True, methods=['delete'], url_path='images/(?P<image_id>[^/.]+)')
    def delete_image(self, request, pk=None, image_id=None):
        try:
            img = ProductImage.objects.get(id=image_id, product_id=pk)
            img.delete()
            return Response(status=204)
        except ProductImage.DoesNotExist:
            return Response({'error': 'الصورة غير موجودة'}, status=404)