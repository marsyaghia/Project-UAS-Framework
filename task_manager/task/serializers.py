from rest_framework import serializers
from .models import Task, ActivityLog


class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    logs = ActivityLogSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'deadline',
            'status',
            'logs',   # supaya muncul log terkait task
        ]
