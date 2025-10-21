# ========================================
# MODELS - SERVICIO PRODUCTOS
# ========================================

from django.db import models
from django.core.validators import MinValueValidator


class Category(models.Model):
    """Modelo de Categoría de Productos"""
    
    # ========================================
    # CAMPOS
    # ========================================
    
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Nombre de la categoría"
    )
    
    slug = models.SlugField(
        unique=True,
        help_text="URL-friendly name"
    )
    
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Descripción de la categoría"
    )
    
    image = models.URLField(
        blank=True,
        null=True,
        help_text="URL de imagen de la categoría"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="¿La categoría está activa?"
    )
    
    # ========================================
    # TIMESTAMPS
    # ========================================
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha de creación"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Fecha de actualización"
    )
    
    # ========================================
    # CONFIGURACIÓN DEL MODELO
    # ========================================
    
    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['name']
        indexes = [
            models.Index(fields=['slug']),
        ]
    
    def __str__(self):
        return self.name


class Product(models.Model):
    """Modelo de Producto"""
    
    # ========================================
    # INFORMACIÓN BÁSICA
    # ========================================
    
    name = models.CharField(
        max_length=255,
        help_text="Nombre del producto"
    )
    
    slug = models.SlugField(
        unique=True,
        help_text="URL-friendly name"
    )
    
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Descripción detallada del producto"
    )
    
    short_description = models.CharField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Descripción corta del producto"
    )
    
    # ========================================
    # CATEGORÍA
    # ========================================
    
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
        help_text="Categoría del producto"
    )
    
    # ========================================
    # PRECIOS
    # ========================================
    
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        help_text="Precio del producto"
    )
    
    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0.01)],
        help_text="Precio con descuento (opcional)"
    )
    
    # ========================================
    # INVENTARIO
    # ========================================
    
    stock = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Cantidad en stock"
    )
    
    sku = models.CharField(
        max_length=50,
        unique=True,
        help_text="Código de producto único"
    )
    
    # ========================================
    # IMÁGENES
    # ========================================
    
    image = models.URLField(
        blank=True,
        null=True,
        help_text="URL de imagen principal"
    )
    
    images = models.JSONField(
        default=list,
        blank=True,
        help_text="Lista de URLs de imágenes adicionales"
    )
    
    # ========================================
    # ESTADO
    # ========================================
    
    is_active = models.BooleanField(
        default=True,
        help_text="¿El producto está activo?"
    )
    
    is_featured = models.BooleanField(
        default=False,
        help_text="¿Es producto destacado?"
    )
    
    # ========================================
    # RATING
    # ========================================
    
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0), ],
        help_text="Calificación del producto (0-5)"
    )
    
    review_count = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Cantidad de reseñas"
    )
    
    # ========================================
    # TIMESTAMPS
    # ========================================
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha de creación"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Fecha de actualización"
    )
    
    # ========================================
    # CONFIGURACIÓN DEL MODELO
    # ========================================
    
    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.name
    
    # ========================================
    # MÉTODOS ÚTILES
    # ========================================
    
    @property
    def has_discount(self):
        """¿El producto tiene descuento?"""
        return self.discount_price is not None and self.discount_price < self.price
    
    @property
    def discount_percentage(self):
        """Porcentaje de descuento"""
        if self.has_discount:
            return round(
                ((self.price - self.discount_price) / self.price) * 100
            )
        return 0
    
    @property
    def final_price(self):
        """Precio final (con descuento si aplica)"""
        if self.has_discount:
            return self.discount_price
        return self.price
    
    @property
    def is_available(self):
        """¿El producto está disponible?"""
        return self.is_active and self.stock > 0