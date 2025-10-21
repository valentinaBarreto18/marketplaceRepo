# ========================================
# WSGI CONFIG - SERVICIO USUARIOS
# ========================================

import os
from django.core.wsgi import get_wsgi_application

# Establecer la configuración de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'usuarios.settings')

# Obtener la aplicación WSGI
application = get_wsgi_application()