from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView 
from rest_framework.schemas import get_schema_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('task/', include('task.urls')), #URL for Task app
    path('api/', include('task.api_urls')),#URL for API
    path('api/auth/token/', obtain_auth_token, name='api_token_auth'), #URL for obtaining auth token
    # Menghasilkan file schema.yml
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Halaman Swagger UI
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # Halaman Redoc
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]