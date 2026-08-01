from datetime import date
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Coupon
from .serializers import CouponSerializer


class IsAdminOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'is_admin_role', False)


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [IsAdminOnly]

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def validate_coupon(self, request):
        code = request.data.get('code', '').strip()
        cart_subtotal = request.data.get('subtotal', 0)

        try:
            coupon = Coupon.objects.get(code__iexact=code)
        except Coupon.DoesNotExist:
            return Response({'valid': False, 'error': 'الكوبون غير موجود'}, status=404)

        if not coupon.is_active:
            return Response({'valid': False, 'error': 'الكوبون غير مفعّل'}, status=400)

        if coupon.expiry_date and coupon.expiry_date < date.today():
            return Response({'valid': False, 'error': 'انتهت صلاحية الكوبون'}, status=400)

        if coupon.max_uses and coupon.used_count >= coupon.max_uses:
            return Response({'valid': False, 'error': 'تم استخدام الكوبون بالحد الأقصى'}, status=400)

        if coupon.min_order and float(cart_subtotal) < float(coupon.min_order):
            return Response({
                'valid': False,
                'error': f'الحد الأدنى للطلب هو {coupon.min_order} ريال'
            }, status=400)

        if coupon.type == 'percentage':
            discount = float(cart_subtotal) * (float(coupon.value) / 100)
        else:
            discount = float(coupon.value)

        return Response({
            'valid': True,
            'code': coupon.code,
            'type': coupon.type,
            'value': str(coupon.value),
            'discount_amount': round(discount, 2),
        })