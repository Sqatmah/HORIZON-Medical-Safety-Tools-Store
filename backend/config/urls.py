from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.categories.views import CategoryViewSet
from apps.products.views import ProductViewSet
from apps.reviews.views import ReviewViewSet
from apps.wishlist.views import WishlistViewSet
from apps.addresses.views import AddressViewSet
from apps.coupons.views import CouponViewSet
from apps.shipping.views import ShippingZoneViewSet
from apps.orders.views import OrderViewSet, TrackOrderView
from apps.cms.views import (
    BannerViewSet, StaticPageViewSet, SiteSettingViewSet, ClientViewSet,
    ContactMessageViewSet, FooterSettingsView, CatalogView,
    TrackVisitView, VisitorStatsView,
)
from apps.users.views import (
    RegisterView, VerifyOtpView, MeView, UserManagementViewSet,
)
from apps.orders.reports import (
    SalesReportView, ProductsReportView, CustomersReportView, OrdersReportView,
)
from apps.orders.excel_export import ExportExcelView
from apps.correspondence.views import CorrespondenceViewSet
from apps.core.views import ActivityLogViewSet, ExportLogsView, RecentActivityView


admin.site.site_header = "مؤسسة الابتكار التقني - لوحة الإدارة"
admin.site.site_title = "Tech Innovation Admin"
admin.site.index_title = "لوحة التحكم"


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
router.register('contact-messages', ContactMessageViewSet, basename='contactmessage')
router.register('users', UserManagementViewSet, basename='usermanagement')
router.register('correspondence', CorrespondenceViewSet, basename='correspondence')
router.register('logs', ActivityLogViewSet, basename='activitylog')


urlpatterns = [
    path('admin/', admin.site.urls),

    # ⚠️ روابط مخصصة (custom) لازم تكون دايمًا قبل include(router.urls)
    # وإلا الراوتر بياخد الأولوية ويحاول يفهم الكلمة (مثل "recent" أو "track")
    # على أنها معرف (pk) لسجل، فيرجع 404 بدل ما يوصل للـ View الصحيح.
    path('api/orders/track/', TrackOrderView.as_view(), name='track-order'),
    path('api/footer-settings/', FooterSettingsView.as_view(), name='footer-settings'),
    path('api/catalog/', CatalogView.as_view(), name='catalog'),
    path('api/track-visit/', TrackVisitView.as_view(), name='track-visit'),
    path('api/visitor-stats/', VisitorStatsView.as_view(), name='visitor-stats'),
    path('api/logs/export/', ExportLogsView.as_view(), name='logs-export'),
    path('api/logs/recent/', RecentActivityView.as_view(), name='logs-recent'),
    path('api/reports/sales/', SalesReportView.as_view(), name='report-sales'),
    path('api/reports/products/', ProductsReportView.as_view(), name='report-products'),
    path('api/reports/customers/', CustomersReportView.as_view(), name='report-customers'),
    path('api/reports/orders/', OrdersReportView.as_view(), name='report-orders'),
    path('api/reports/export/<str:report_type>/', ExportExcelView.as_view(), name='report-export'),

    # روابط الـ Router (CRUD تلقائي لكل الموديلات)
    path('api/', include(router.urls)),

    # المصادقة
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/verify-otp/', VerifyOtpView.as_view(), name='verify_otp'),
    path('api/auth/me/', MeView.as_view(), name='me'),

    # الذكاء الاصطناعي
    path('api/ai/', include('apps.ai_assistant.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)