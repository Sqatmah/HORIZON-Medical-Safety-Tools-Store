from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from openpyxl import Workbook
from .models import ActivityLog
from .permissions import IsSuperAdminOnly
from rest_framework import serializers


class ActivityLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', default='—', read_only=True)

    class Meta:
        model = ActivityLog
        fields = ['id', 'username', 'action', 'details', 'ip_address', 'created_at']


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsSuperAdminOnly]


class ExportLogsView(APIView):
    permission_classes = [IsSuperAdminOnly]

    def get(self, request):
        logs = ActivityLog.objects.all()[:1000]
        wb = Workbook()
        ws = wb.active
        ws.sheet_view.rightToLeft = True
        ws.title = 'سجل العمليات'
        ws.append(['المستخدم', 'العملية', 'التفاصيل', 'عنوان IP', 'التاريخ'])
        for log in logs:
            ws.append([
                log.user.username if log.user else '—', log.action, log.details,
                log.ip_address or '—', log.created_at.strftime('%Y-%m-%d %H:%M'),
            ])
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=activity_logs.xlsx'
        wb.save(response)
        return response

class RecentActivityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not getattr(request.user, 'is_admin_role', False):
            return Response({'error': 'غير مصرح'}, status=403)
        logs = ActivityLog.objects.all()[:20]
        return Response(ActivityLogSerializer(logs, many=True).data)