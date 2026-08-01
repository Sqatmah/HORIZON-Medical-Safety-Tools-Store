from rest_framework import viewsets, permissions
from .models import Banner, StaticPage, SiteSetting, Client
from .serializers import BannerSerializer, StaticPageSerializer, SiteSettingSerializer, ClientSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and getattr(request.user, 'is_admin_role', False)


class IsAdminOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'is_admin_role', False)


class BannerViewSet(viewsets.ModelViewSet):
    serializer_class = BannerSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = Banner.objects.all()
        user = self.request.user
        if not (user.is_authenticated and getattr(user, 'is_admin_role', False)):
            qs = qs.filter(is_active=True)
        return qs


class StaticPageViewSet(viewsets.ModelViewSet):
    serializer_class = StaticPageSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = StaticPage.objects.all()
        user = self.request.user
        if not (user.is_authenticated and getattr(user, 'is_admin_role', False)):
            qs = qs.filter(is_published=True)
        return qs


class SiteSettingViewSet(viewsets.ModelViewSet):
    queryset = SiteSetting.objects.all()
    serializer_class = SiteSettingSerializer
    permission_classes = [IsAdminOnly]


class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = Client.objects.all()
        user = self.request.user
        if not (user.is_authenticated and getattr(user, 'is_admin_role', False)):
            qs = qs.filter(is_active=True)
        return qs