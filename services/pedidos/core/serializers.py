# ========================================
# SERIALIZERS - SERVICIO PEDIDOS
# ========================================

from rest_framework import serializers
from .models import Order, OrderItem
import uuid


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer para items del pedido"""
    
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product_id',
            'product_name',
            'product_image',
            'price',
            'quantity',
            'total',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_total(self, obj):
        """Calcula el total para este item"""
        return obj.get_total()


class OrderListSerializer(serializers.ModelSerializer):
    """Serializer para listar pedidos (vista simple)"""
    
    items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'user_id',
            'status',
            'total',
            'items_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at']
    
    def get_items_count(self, obj):
        """Cuenta los items del pedido"""
        return obj.items.count()


class OrderDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalles completos del pedido"""
    
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'user_id',
            'status',
            'subtotal',
            'tax',
            'shipping_cost',
            'discount',
            'total',
            'shipping_address',
            'shipping_city',
            'shipping_state',
            'shipping_postal_code',
            'shipping_country',
            'customer_email',
            'customer_phone',
            'notes',
            'items',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear pedidos"""
    
    items = OrderItemSerializer(many=True, write_only=True)
    
    class Meta:
        model = Order
        fields = [
            'user_id',
            'shipping_address',
            'shipping_city',
            'shipping_state',
            'shipping_postal_code',
            'shipping_country',
            'customer_email',
            'customer_phone',
            'notes',
            'items',
        ]
    
    def validate_items(self, value):
        """Validar que hay al menos un item"""
        if not value:
            raise serializers.ValidationError("El pedido debe tener al menos un item")
        return value
    
    def create(self, validated_data):
        """Crear el pedido y sus items"""
        items_data = validated_data.pop('items')
        
        # Generar número de orden único
        order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        
        # Crear orden
        order = Order.objects.create(
            order_number=order_number,
            **validated_data
        )
        
        # Crear items
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        # Calcular totales
        order.calculate_total()
        
        return order


class OrderUpdateSerializer(serializers.ModelSerializer):
    """Serializer para actualizar pedidos (solo estado)"""
    
    class Meta:
        model = Order
        fields = [
            'status',
            'notes',
        ]


class CartItemSerializer(serializers.Serializer):
    """Serializer para items del carrito (antes de crear pedido)"""
    
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    product_image = serializers.URLField(required=False, allow_blank=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField(min_value=1)
    
    def validate_price(self, value):
        """Validar que el precio sea positivo"""
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a 0")
        return value