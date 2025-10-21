# ========================================
# DOCKERFILE - SERVICIO USUARIOS
# ========================================

# Paso 1: Descarga imagen base de Python
FROM python:3.11-slim

# ========================================
# METADATOS (Información)
# ========================================
LABEL maintainer="Tu Nombre <tu@email.com>"
LABEL description="Servicio de Usuarios - Django REST API"

# ========================================
# VARIABLES DE ENTORNO
# ========================================
# No bufferear output de Python (para ver logs en tiempo real)
ENV PYTHONUNBUFFERED=1

# No crear archivos .pyc (menos disco)
ENV PYTHONDONTWRITEBYTECODE=1

# ========================================
# ESTABLECER DIRECTORIO DE TRABAJO
# ========================================
# Es como hacer: cd /app
WORKDIR /app

# ========================================
# INSTALAR DEPENDENCIAS DEL SISTEMA
# ========================================
# PostgreSQL, build-essential, etc.
RUN apt-get update && apt-get install -y \
    postgresql-client \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# ========================================
# COPIAR requirements.txt
# ========================================
# Copia el archivo requirements.txt de tu PC al contenedor
COPY requirements.txt .

# ========================================
# INSTALAR DEPENDENCIAS PYTHON
# ========================================
# Es como hacer: pip install -r requirements.txt
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# ========================================
# COPIAR CÓDIGO DE LA APLICACIÓN
# ========================================
# Copia TODO el código de usuarios al contenedor
COPY . .

# ========================================
# CREAR USUARIO NO-ROOT (Seguridad)
# ========================================
# No ejecutar como root en producción
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

# Cambiar al usuario no-root
USER appuser

# ========================================
# EXPONER PUERTO
# ========================================
# Este contenedor escucha en puerto 8000
EXPOSE 8000

# ========================================
# COMANDO DE INICIO
# ========================================
# Se ejecuta cuando el contenedor inicia
# (Pero en docker-compose.yml lo sobrescribimos con "command:")
CMD ["gunicorn", "usuarios.wsgi:application", "--bind", "0.0.0.0:8000"]