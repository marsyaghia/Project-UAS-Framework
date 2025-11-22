from django.urls import path
# from .views import TaskListAPIView, TaskDetailAPIView
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, ActivityLogViewSet

router = DefaultRouter()
router.register(r'task', TaskViewSet, basename='task')
router.register(r'logs', ActivityLogViewSet, basename='activitylog')

urlpatterns = [
    # path('tasks/', TaskListAPIView.as_view(), name='api-task-list'),
    # path('tasks/<int:pk>/', TaskDetailAPIView.as_view(), name='api-task-detail'),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
