from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.users.views import RegisterView, VerifyOtpView
from apps.categories.views import CategoryViewSet
from apps.products.views import ProductViewSet
from apps.reviews.views import ReviewViewSet
from apps.wishlist.views import WishlistViewSet
from apps.addresses.views import AddressViewSet
from apps.coupons.views import CouponViewSet
from apps.shipping.views import ShippingZoneViewSet
from apps.orders.views import OrderViewSet
from apps.cms.views import BannerViewSet, StaticPageViewSet, SiteSettingViewSet, ClientViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('products', ProductViewSet, basename='product')
router.register('reviews', ReviewViewSet, basename='review')
router.register('wishlist', WishlistViewSet, basename='wishlist')
router.register('addresses', AddressViewSet, basename='address')
router.register('coupons', CouponViewSet, basename='coupon')
router.register('shipping-zones', ShippingZoneViewSet, basename='shippingzone')
router.register('orders', OrderViewSet, basename='order')
router.register('banners', BannerViewSet, basename='banner')
router.register('pages', StaticPageViewSet, basename='page')
router.register('settings', SiteSettingViewSet, basename='setting')
router.register('clients', ClientViewSet, basename='client')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/verify-otp/', VerifyOtpView.as_view(), name='verify_otp'),
    path('api/ai/', include('apps.ai_assistant.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)