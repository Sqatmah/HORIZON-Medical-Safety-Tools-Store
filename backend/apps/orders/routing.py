from django.urls import re_path
from .consumers import OrderTrackingConsumer

websocket_urlpatterns = [
    re_path(r'ws/orders/(?P<order_number>\w+)/$', OrderTrackingConsumer.as_asgi()),
]