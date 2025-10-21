# ========================================
# VIEWS - SERVICIO PRODUCTOS
# ========================================

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from .models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateUpdateSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Categorías
    GET    /api/categories/           - Listar categorías
    POST   /api/categories/           - Crear categoría (admin)
    GET    /api/categories/{id}/      - Detalle de categoría
    PUT    /api/categories/{id}/      - Actualizar categoría (admin)
    DELETE /api/categories/{id}/      - Eliminar categoría (admin)
    """
    
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = 'id'
    
    def get_permissions(self):
        """Permisos por acción"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Productos
    GET    /api/products/             - Listar productos
    POST   /api/products/             - Crear producto (admin)
    GET    /api/products/{id}/        - Detalle de producto
    PUT    /api/products/{id}/        - Actualizar producto (admin)
    DELETE /api/products/{id}/        - Eliminar producto (admin)
    GET    /api/products/featured/    - Productos destacados
    """
    
    queryset = Product.objects.filter(is_active=True)
    lookup_field = 'id'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['name', 'description', 'sku']
    ordering_fields = ['price', 'created_at', 'rating']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Usar diferentes serializers según la acción"""
        if self.action == 'retrieve':
            return ProductDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        else:
            return ProductListSerializer
    
    def get_permissions(self):
        """Permisos por acción"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def featured(self, request):
        """
        Obtener productos destacados
        GET /api/products/featured/
        """
        featured_products = self.queryset.filter(is_featured=True)[:10]
        serializer = ProductListSerializer(featured_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def by_category(self, request):
        """
        Obtener productos por categoría
        GET /api/products/by_category/?category_id=1
        """
        category_id = request.query_params.get('category_id')
        
        if not category_id:
            return Response(
                {'error': 'category_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        products = self.queryset.filter(category_id=category_id)
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def related(self, request, pk=None):
        """
        Obtener productos relacionados (misma categoría)
        GET /api/products/{id}/related/
        """
        product = self.get_object()
        related_products = Product.objects.filter(
            category=product.category,
            is_active=True
        ).exclude(id=product.id)[:5]
        
        serializer = ProductListSerializer(related_products, many=True)
        return Response(serializer.data)