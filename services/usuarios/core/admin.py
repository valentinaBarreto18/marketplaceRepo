# ========================================
# ADMIN.PY - PANEL DE ADMINISTRACIÓN
# ========================================

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Personalización del panel de administración para el modelo User
    """
    
    # ========================================
    # CAMPOS MOSTRADOS EN LA LISTA
    # ========================================
    list_display = (
        'email',
        'first_name',
        'last_name',
        'is_active',
        'is_staff',
        'is_verified',
        'created_at',
    )
    
    # ========================================
    # FILTROS
    # ========================================
    list_filter = (
        'is_active',
        'is_staff',
        'is_verified',
        'created_at',
    )
    
    # ========================================
    # BÚSQUEDA
    # ========================================
    search_fields = (
        'email',
        'first_name',
        'last_name',
        'phone',
    )
    
    # ========================================
    # ORDEN PREDETERMINADO
    # ========================================
    ordering = ('-created_at',)
    
    # ========================================
    # CAMPOS EN EL FORMULARIO DE EDICIÓN
    # ========================================
    fieldsets = (
        ('Autenticación', {
            'fields': ('email', 'password')
        }),
        ('Información Personal', {
            'fields': ('first_name', 'last_name', 'phone', 'avatar', 'bio')
        }),
        ('Dirección', {
            'fields': ('address', 'city', 'state', 'postal_code', 'country')
        }),
        ('Permisos', {
            'fields': ('is_active', 'is_staff', 'is_superuser')
        }),
        ('Verificación', {
            'fields': ('is_verified',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)  # Campo colapsable
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    # ========================================
    # CAMPOS PARA CREAR USUARIO
    # ========================================
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )