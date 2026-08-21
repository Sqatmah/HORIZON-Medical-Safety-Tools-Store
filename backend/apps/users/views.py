from apps.core.logging_utils import log_activity
import random
from django.core.mail import send_mail
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets
from .models import User
from .serializers import RegisterSerializer, UserManagementSerializer
from apps.core.permissions import IsSuperAdminOnly


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(is_active=True)
        log_activity(None, 'تسجيل حساب جديد', f'المستخدم: {user.username} ({user.email})', request)

        otp = str(random.randint(100000, 999999))
        cache.set(f'otp_{user.email}', otp, timeout=600)  # صالح 10 دقايق
        send_mail(
            'رمز التحقق - Horizon Care',
            f'رمزك هو: {otp}',
            'no-reply@horizoncare.sa',
            [user.email],
        )
        return Response({'message': 'تم إنشاء الحساب، تحقق من الإيميل لرمز التفعيل'}, status=201)


class VerifyOtpView(APIView):
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('otp_code')

        cached_otp = cache.get(f'otp_{email}')
        if not cached_otp or cached_otp != code:
            return Response({'error': 'رمز غير صحيح أو منتهي الصلاحية'}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'المستخدم غير موجود'}, status=404)

        user.is_email_verified = True
        user.save()
        cache.delete(f'otp_{email}')

        refresh = RefreshToken.for_user(user)
        log_activity(user, 'تسجيل دخول (تحقق OTP)', '', request)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })

    


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'customer_type': user.customer_type,
            'is_admin_role': user.is_admin_role,
            'is_super_admin_role': user.is_super_admin_role,
        })


class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserManagementSerializer
    permission_classes = [IsSuperAdminOnly]
    http_method_names = ['get', 'patch', 'head', 'options']    