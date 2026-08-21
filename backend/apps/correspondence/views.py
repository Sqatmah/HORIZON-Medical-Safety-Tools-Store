from django.http import HttpResponse
from rest_framework import viewsets
from apps.core.permissions import IsSuperAdminOnly
from .models import Correspondence
from .serializers import CorrespondenceSerializer
from .word_generator import generate_correspondence_docx


class CorrespondenceViewSet(viewsets.ModelViewSet):
    queryset = Correspondence.objects.all().order_by('-created_at')
    serializer_class = CorrespondenceSerializer
    permission_classes = [IsSuperAdminOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.query_params.get('download') == 'docx':
            buffer = generate_correspondence_docx(instance)
            response = HttpResponse(
                buffer.read(),
                content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            )
            response['Content-Disposition'] = f'attachment; filename=correspondence_{instance.id}.docx'
            return response
        return super().retrieve(request, *args, **kwargs)