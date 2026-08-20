from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import Order
from apps.products.models import Product
from apps.users.models import User


class IsAdminOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'is_admin_role', False)


class SalesReportView(APIView):
    permission_classes = [IsAdminOnly]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        since = timezone.now() - timedelta(days=days)
        orders = Order.objects.filter(created_at__gte=since).exclude(status='cancelled')

        return Response({
            'period_days': days,
            'total_orders': orders.count(),
            'total_revenue': orders.aggregate(t=Sum('total'))['t'] or 0,
            'total_vat_collected': orders.aggregate(t=Sum('vat_amount'))['t'] or 0,
            'average_order_value': orders.aggregate(t=Avg('total'))['t'] or 0,
            'orders_by_status': list(
                Order.objects.filter(created_at__gte=since)
                .values('status').annotate(count=Count('id'))
            ),
            'orders_by_payment_method': list(
                orders.values('payment_method').annotate(count=Count('id'))
            ),
        })


class ProductsReportView(APIView):
    permission_classes = [IsAdminOnly]

    def get(self, request):
        products = Product.objects.all().order_by('-quantity_sold')
        return Response([
            {
                'id': p.id,
                'name_ar': p.name_ar,
                'sku': p.sku,
                'price': str(p.price),
                'stock': p.stock,
                'quantity_sold': p.quantity_sold,
                'rating_avg': p.rating_avg,
                'status': p.status,
                'category': p.category.name_ar if p.category else '',
            }
            for p in products
        ])


class CustomersReportView(APIView):
    permission_classes = [IsAdminOnly]

    def get(self, request):
        users = User.objects.filter(role='user')
        result = []
        for u in users:
            orders = Order.objects.filter(user=u).exclude(status='cancelled')
            result.append({
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'phone': u.phone,
                'customer_type': u.get_customer_type_display(),
                'total_orders': orders.count(),
                'total_spent': orders.aggregate(t=Sum('total'))['t'] or 0,
                'date_joined': u.date_joined,
            })
        result.sort(key=lambda x: x['total_spent'], reverse=True)
        return Response(result)


class OrdersReportView(APIView):
    permission_classes = [IsAdminOnly]

    def get(self, request):
        orders = Order.objects.all().order_by('-created_at')[:200]
        return Response([
            {
                'order_number': o.order_number,
                'customer_email': o.customer_email,
                'status': o.status,
                'payment_status': o.payment_status,
                'payment_method': o.payment_method,
                'total': str(o.total),
                'created_at': o.created_at,
            }
            for o in orders
        ])