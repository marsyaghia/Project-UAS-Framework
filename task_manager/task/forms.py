from django import forms
from .models import Task, ActivityLog

class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'deadline', 'status']

class ActivityLogForm(forms.ModelForm):
    class Meta:
        model = ActivityLog
        fields = ['message']