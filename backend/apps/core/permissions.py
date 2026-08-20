from rest_framework import permissions


class IsAdminOrSuperAdmin(permissions.BasePermission):
    """قراءة عامة، إنشاء/تعديل للأدمن أو الأدمن الإداري، حذف للأدمن الإداري فقط."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return False
        if request.method == 'DELETE':
            return getattr(request.user, 'is_super_admin_role', False)
        return getattr(request.user, 'is_admin_role', False)


class IsSuperAdminOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'is_super_admin_role', False)