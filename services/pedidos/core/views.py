# ========================================
# VIEWS - SERVICIO PEDIDOS
# ========================================

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Order, OrderItem
from .serializers import (
    OrderListSerializer,
    OrderDetailSerializer,
    OrderCreateSerializer,
    OrderUpdateSerializer,
    CartItemSerializer,
)


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Pedidos
    GET    /api/orders/          - Listar pedidos del usuario
    POST   /api/orders/          - Crear pedido
    GET    /api/orders/{id}/     - Detalle del pedido
    PUT    /api/orders/{id}/     - Actualizar estado del pedido (admin)
    """
    
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'
    filter_backends = []
    
    def get_queryset(self):
        """Cada usuario solo ve sus propios pedidos"""
        user_id = self.request.query_params.get('user_id')
        
        # Si es admin, puede ver todos
        if self.request.user.is_staff:
            return Order.objects.all()
        
        # Si no, solo sus pedidos
        if user_id:
            return Order.objects.filter(user_id=user_id)
        
        return Order.objects.none()
    
    def get_serializer_class(self):
        """Usar diferentes serializers según la acción"""
        if self.action == 'retrieve':
            return OrderDetailSerializer
        elif self.action == 'create':
            return OrderCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return OrderUpdateSerializer
        else:
            return OrderListSerializer
    
    def create(self, request, *args, **kwargs):
        """Crear un nuevo pedido"""
        data = request.data.copy()
        
        # Si el usuario no es admin, usa su propio ID
        if not request.user.is_staff:
            data['user_id'] = request.user.id
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        return Response(
            OrderDetailSerializer(order).data,
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, *args, **kwargs):
        """Actualizar estado del pedido (solo admin)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Solo administradores pueden actualizar pedidos'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_orders(self, request):
        """
        Obtener todos los pedidos del usuario autenticado
        GET /api/orders/my_orders/
        """
        orders = Order.objects.filter(user_id=request.user.id)
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def cancel(self, request, pk=None):
        """
        Cancelar un pedido (solo admin)
        POST /api/orders/{id}/cancel/
        """
        order = self.get_object()
        
        if order.status == 'delivered':
            return Response(
                {'error': 'No se puede cancelar un pedido entregado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'cancelled'
        order.save()
        
        return Response(
            OrderDetailSerializer(order).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def status(self, request, pk=None):
        """
        Obtener solo el estado de un pedido
        GET /api/orders/{id}/status/
        """
        order = self.get_object()
        return Response({
            'order_number': order.order_number,
            'status': order.status,
            'total': order.total,
            'updated_at': order.updated_at,
        })


class CartViewSet(viewsets.ViewSet):
    """
    ViewSet para gestionar carrito de compras
    POST /api/cart/validate/  - Validar items del carrito
    POST /api/cart/checkout/  - Procesar checkout
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def validate(self, request):
        """
        Validar items del carrito antes de procesar
        POST /api/cart/validate/
        
        Body:
        {
            "items": [
                {
                    "product_id": 1,
                    "product_name": "iPhone 15",
                    "price": 1000,
                    "quantity": 2
                }
            ]
        }
        """
        items_data = request.data.get('items', [])
        
        serializer = CartItemSerializer(data=items_data, many=True)
        serializer.is_valid(raise_exception=True)
        
        # Calcular totales
        subtotal = sum(
            item['price'] * item['quantity'] 
            for item in serializer.validated_data
        )
        
        return Response({
            'valid': True,
            'subtotal': subtotal,
            'items_count': len(serializer.validated_data),
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def checkout(self, request):
        """
        Procesar checkout y crear pedido
        POST /api/cart/checkout/
        
        Body:
        {
            "shipping_address": "Calle 5 # 10-20",
            "shipping_city": "Ibagué",
            "shipping_state": "Tolima",
            "shipping_postal_code": "730001",
            "shipping_country": "Colombia",
            "customer_email": "juan@example.com",
            "customer_phone": "+573001234567",
            "items": [...]
        }
        """
        data = request.data.copy()
        data['user_id'] = request.user.id
        
        serializer = OrderCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        return Response({
            'message': 'Pedido creado exitosamente',
            'order': OrderDetailSerializer(order).data,
        }, status=status.HTTP_201_CREATED)