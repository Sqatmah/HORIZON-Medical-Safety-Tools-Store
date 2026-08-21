from .models import ActivityLog


def log_activity(user, action, details='', request=None):
    ip = None
    if request:
        ip = request.META.get('REMOTE_ADDR')
    ActivityLog.objects.create(user=user, action=action, details=details, ip_address=ip)