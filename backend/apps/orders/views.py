from rest_framework import viewsets, permissions
from .models import Order
from .serializers import OrderSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

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