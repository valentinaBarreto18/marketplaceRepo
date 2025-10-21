# ========================================
# SERIALIZERS - SERVICIO PRODUCTOS
# ========================================

from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    """Serializer para Categoría"""
    
    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'image',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer para listar productos (vista simple)"""
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    final_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    has_discount = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'short_description',
            'category',
            'category_name',
            'price',
            'discount_price',
            'final_price',
            'has_discount',
            'discount_percentage',
            'image',
            'is_active',
            'is_featured',
            'rating',
            'review_count',
            'stock',
            'is_available',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'is_available']


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalles completos del producto"""
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    final_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    has_discount = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    is_available = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'short_description',
            'category',
            'category_name',
            'price',
            'discount_price',
            'final_price',
            'has_discount',
            'discount_percentage',
            'image',
            'images',
            'stock',
            'sku',
            'is_active',
            'is_featured',
            'is_available',
            'rating',
            'review_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_available']


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para crear/actualizar productos (solo admin)"""
    
    class Meta:
        model = Product
        fields = [
            'name',
            'slug',
            'description',
            'short_description',
            'category',
            'price',
            'discount_price',
            'stock',
            'sku',
            'image',
            'images',
            'is_active',
            'is_featured',
        ]
    
    def validate_price(self, value):
        """Validar que el precio sea positivo"""
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor a 0")
        return value
    
    def validate(self, data):
        """Validación general"""
        
        # Validar que el precio con descuento sea menor que el precio original
        if data.get('discount_price') and data.get('price'):
            if data['discount_price'] >= data['price']:
                raise serializers.ValidationError({
                    'discount_price': 'El precio con descuento debe ser menor que el precio original'
                })
        
        return data