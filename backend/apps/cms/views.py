from apps.core.permissions import IsAdminOrSuperAdmin
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Banner, StaticPage, SiteSetting, Client , Catalog
from .serializers import BannerSerializer, StaticPageSerializer, SiteSettingSerializer, ClientSerializer , CatalogSerializer
from .models import ContactMessage
from .serializers import ContactMessageSerializer
from rest_framework.parsers import MultiPartParser, FormParser


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
    permission_classes = [IsAdminOrSuperAdmin]

    def get_queryset(self):
        qs = Banner.objects.all()
        user = self.request.user
        if not (user.is_authenticated and getattr(user, 'is_admin_role', False)):
            qs = qs.filter(is_active=True)
        return qs


class StaticPageViewSet(viewsets.ModelViewSet):
    serializer_class = StaticPageSerializer
    permission_classes = [IsAdminOrSuperAdmin]

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
    permission_classes = [IsAdminOrSuperAdmin]

    def get_queryset(self):
        qs = Client.objects.all()
        user = self.request.user
        if not (user.is_authenticated and getattr(user, 'is_admin_role', False)):
            qs = qs.filter(is_active=True)
        return qs



class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsAdminOnly()]    




FOOTER_SETTING_KEY = 'footer_content'

DEFAULT_FOOTER = {
    'about_text': 'مؤسسة الابتكار التقني هي مؤسسة متخصصة في توريد المعدات الطبية ومعدات السلامة المعتمدة في جميع أنحاء المملكة العربية السعودية.',
    'address': 'الرياض، المملكة العربية السعودية',
    'phone': '+966566586282',
    'email': 'info@techinnovation.sa',
    'working_hours': 'السبت-الخميس 8ص-10م',
    'facebook_url': '',
    'linkedin_url': '',
    'instagram_url': '',
    'twitter_url': '',
    'copyright_text': '© 2026 Tech Innovation. جميع الحقوق محفوظة.',
}


class FooterSettingsView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [IsAdminOnly()]

    def get(self, request):
        setting, _ = SiteSetting.objects.get_or_create(
            key=FOOTER_SETTING_KEY,
            defaults={'value_json': DEFAULT_FOOTER, 'group': 'footer'}
        )
        return Response(setting.value_json or DEFAULT_FOOTER)

    def put(self, request):
        setting, _ = SiteSetting.objects.get_or_create(
            key=FOOTER_SETTING_KEY,
            defaults={'group': 'footer'}
        )
        setting.value_json = request.data
        setting.group = 'footer'
        setting.save()
        return Response(setting.value_json)



class CatalogView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [IsAdminOnly()]

    def get(self, request):
        catalog = Catalog.objects.order_by('-uploaded_at').first()
        if not catalog:
            return Response({'file': None, 'uploaded_at': None})
        return Response(CatalogSerializer(catalog).data)

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'الملف مطلوب'}, status=400)

        # احذف كل النسخ القديمة، نحتفظ بنسخة واحدة فقط دايمًا
        Catalog.objects.all().delete()
        catalog = Catalog.objects.create(file=file)
        return Response(CatalogSerializer(catalog).data, status=201)    