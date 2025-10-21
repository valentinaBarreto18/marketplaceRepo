# ========================================
# URLs PRINCIPALES - SERVICIO USUARIOS
# ========================================

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Panel de administración de Django
    path('admin/', admin.site.urls),
    
    # Rutas de la aplicación 'core'
    # Prefijo: /api/auth/ y /api/users/
    path('api/auth/', include('core.urls')),
    path('api/users/', include('core.urls')),
]