from django.urls import path
from .views import TaskListView, TaskDetailView, TaskCreateView, TaskUpdateView, TaskDeleteView
from .views import ActivityLogListView, ActivityLogCreateView, ActivityLogUpdateView, ActivityLogDeleteView
urlpatterns = [
    #CRUD Task
    path('', TaskListView.as_view(), name='task-list'),
    path('create/', TaskCreateView.as_view(), name='task-create'),
    path('<int:pk>/', TaskDetailView.as_view(),name='task-detail'),
    path('<int:pk>/edit/', TaskUpdateView.as_view(), name='task-edit'),
    path('<int:pk>/delete/', TaskDeleteView.as_view(), name='task-delete'),
    #CRUD ActivityLog
    path('logs/', ActivityLogListView.as_view(), name='activitylog-list'),
    path('logs/create/', ActivityLogCreateView.as_view(), name='activitylog-create'),
    path('logs/<int:pk>/edit/', ActivityLogUpdateView.as_view(), name='activitylog-edit'),
    path('logs/<int:pk>/delete/', ActivityLogDeleteView.as_view(), name='activitylog-delete'),
]

