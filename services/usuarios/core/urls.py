# ========================================
# URLS - APP CORE (SERVICIO USUARIOS)
# ========================================

from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    UserListView,
    UserDetailView,
    RefreshTokenView,
    LogoutView,
)

urlpatterns = [
    # ========================================
    # AUTENTICACIÓN
    # ========================================
    
    # Registrar nuevo usuario
    # POST /api/auth/register/
    path('register/', RegisterView.as_view(), name='register'),
    
    # Iniciar sesión
    # POST /api/auth/login/
    path('login/', LoginView.as_view(), name='login'),
    
    # Refrescar token
    # POST /api/auth/refresh/
    path('refresh/', RefreshTokenView.as_view(), name='refresh-token'),
    
    # Logout
    # POST /api/auth/logout/
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # ========================================
    # PERFIL DE USUARIO
    # ========================================
    
    # Obtener/Actualizar perfil del usuario autenticado
    # GET /api/users/profile/
    # PUT /api/users/profile/
    # PATCH /api/users/profile/
    path('profile/', ProfileView.as_view(), name='profile'),
    
    # ========================================
    # USUARIOS (ADMIN)
    # ========================================
    
    # Listar todos los usuarios (solo admin)
    # GET /api/users/list/
    path('list/', UserListView.as_view(), name='user-list'),
    
    # Ver detalles de un usuario específico
    # GET /api/users/<int:user_id>/
    path('<int:user_id>/', UserDetailView.as_view(), name='user-detail'),
]