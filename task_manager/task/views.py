from .models import Task, ActivityLog
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .forms import TaskForm
from rest_framework.generics import ListAPIView, RetrieveAPIView #Import for API views
from .serializers import TaskSerializer, ActivityLogSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, IsAdminUser
from rest_framework.filters import SearchFilter, OrderingFilter


# View for Task List
class TaskListView(ListView):
    model = Task
    template_name = 'task_list.html'
    
class TaskDetailView(DetailView):
    model = Task
    template_name = 'task_detail.html'
    
class TaskCreateView(CreateView):
    model = Task
    form_class = TaskForm
    template_name = 'task_form.html'
    success_url = reverse_lazy('task-list')

class TaskUpdateView(UpdateView):
    model = Task
    form_class = TaskForm
    template_name = 'task_form.html'
    success_url = reverse_lazy('task-list')

class TaskDeleteView(DeleteView):
    model = Task
    template_name = 'task_confirm_delete.html'
    success_url = reverse_lazy('task-list')

# View for ActivityLog List
class ActivityLogListView(ListView):
    model = ActivityLog
    template_name = 'activitylog_list.html'

class ActivityLogCreateView(CreateView):
    model = ActivityLog
    template_name = 'activitylog_form.html'
    fields = ['task', 'message']
    success_url = reverse_lazy('activitylog-list')

class ActivityLogUpdateView(UpdateView):
    model = ActivityLog
    template_name = 'activitylog_form.html'
    success_url = reverse_lazy('activitylog-list')

class ActivityLogDeleteView(DeleteView):
    model = ActivityLog
    template_name = 'activitylog_confirm_delete.html'
    success_url = reverse_lazy('activitylog-list')

# #API View for Task
# class TaskListAPIView(ListAPIView):
#     queryset = Task.objects.all()
#     serializer_class = TaskSerializer

# class TaskDetailAPIView(RetrieveAPIView):
#     queryset = Task.objects.all()
#     serializer_class = TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'description', 'status']
    ordering_fields = ['created_at', 'updated_at', 'due_date']

class ActivityLogViewSet(viewsets.ModelViewSet):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['task__title', 'message']
    ordering_fields = ['timestamp']