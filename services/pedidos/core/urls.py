# ========================================
# URLS - APP CORE (SERVICIO PEDIDOS)
# ========================================

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, CartViewSet

router = DefaultRouter()
router.register(r'', OrderViewSet, basename='order')
router.register(r'', CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
]