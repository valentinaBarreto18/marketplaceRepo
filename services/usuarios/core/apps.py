# ========================================
# APPS.PY - CONFIGURACIÓN DE LA APP CORE
# ========================================

from django.apps import AppConfig


class CoreConfig(AppConfig):
    """
    Configuración de la aplicación 'core'
    """
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
    verbose_name = 'Gestión de Usuarios'