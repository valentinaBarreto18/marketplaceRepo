# ========================================
# URLS - APP CORE (SERVICIO PRODUCTOS)
# ========================================

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet

# Crear router y registrar viewsets
router = DefaultRouter()
router.register(r'', CategoryViewSet, basename='category')
router.register(r'', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
]