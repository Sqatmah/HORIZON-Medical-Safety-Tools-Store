from rest_framework import viewsets, permissions
from .models import Review
from .serializers import ReviewSerializer


class IsOwnerOrAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        return obj.user == user or getattr(user, 'is_admin_role', False)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        qs = Review.objects.all()
        user = self.request.user
        if not (user.is_authenticated and getattr(user, 'is_admin_role', False)):
            qs = qs.filter(is_approved=True)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, customer_name=self.request.user.username)