from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Order
from .serializers import OrderSerializer


class OrderPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.user == request.user or getattr(request.user, 'is_admin_role', False)
        if request.method == 'DELETE':
            return getattr(request.user, 'is_super_admin_role', False)
        return getattr(request.user, 'is_admin_role', False)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [OrderPermission]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'is_admin_role', False):
            return Order.objects.all()
        return Order.objects.filter(user=user)

    def perform_update(self, serializer):
        order = serializer.save()
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'order_{order.order_number}',
            {'type': 'order_update', 'data': {
                'status': order.status,
                'payment_status': order.payment_status,
                'tracking_number': order.tracking_number,
            }}
        )


class TrackOrderView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        order_number = request.query_params.get('order_number', '').strip()
        if not order_number:
            return Response({'error': 'رقم الطلب مطلوب'}, status=400)
        try:
            order = Order.objects.get(order_number__iexact=order_number)
        except Order.DoesNotExist:
            return Response({'error': 'لم يتم العثور على طلب بهذا الرقم'}, status=404)

        return Response({
            'order_number': order.order_number,
            'status': order.status,
            'payment_status': order.payment_status,
            'tracking_number': order.tracking_number,
            'created_at': order.created_at,
            'total': order.total,
            'items': order.items,
        })