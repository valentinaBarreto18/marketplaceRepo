# ========================================
# DOCKERFILE - API GATEWAY (NGINX)
# ========================================

# Descarga la imagen base de Nginx (versión alpine = más pequeña)
FROM nginx:alpine

# ========================================
# INFORMACIÓN DEL MANTENEDOR (Opcional)
# ========================================
LABEL maintainer="Tu Nombre <tu@email.com>"
LABEL description="API Gateway - Nginx reverse proxy"

# ========================================
# ELIMINAR CONFIGURACIÓN POR DEFECTO DE NGINX
# ========================================
RUN rm /etc/nginx/conf.d/default.conf

# ========================================
# COPIAR NUESTRA CONFIGURACIÓN
# ========================================
# Sintaxis: COPY [archivo en tu PC] [ubicación en el contenedor]
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

# ========================================
# EXPONER PUERTO 80 (solo documentación)
# ========================================
EXPOSE 80

# ========================================
# COMANDO POR DEFECTO
# ========================================
# Nginx se ejecuta automáticamente
# (No necesitamos CMD porque nginx:alpine ya lo incluye)