from rest_framework import serializers
from .models import Correspondence


class CorrespondenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Correspondence
        fields = '__all__'
        read_only_fields = ['created_by']