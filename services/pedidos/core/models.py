# ========================================
# MODELS - SERVICIO PEDIDOS
# ========================================

from django.db import models
from django.core.validators import MinValueValidator


class Order(models.Model):
    """Modelo de Pedido"""
    
    # ========================================
    # ESTADOS DEL PEDIDO
    # ========================================
    
    STATUS_CHOICES = (
        ('pending', 'Pendiente'),
        ('confirmed', 'Confirmado'),
        ('shipped', 'Enviado'),
        ('delivered', 'Entregado'),
        ('cancelled', 'Cancelado'),
    )
    
    # ========================================
    # CAMPOS PRINCIPALES
    # ========================================
    
    # Referencia al usuario (por ID, es otro servicio)
    user_id = models.IntegerField(
        help_text="ID del usuario que hizo el pedido"
    )
    
    # Número de orden único
    order_number = models.CharField(
        max_length=50,
        unique=True,
        help_text="Número único del pedido"
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text="Estado del pedido"
    )
    
    # ========================================
    # TOTALES
    # ========================================
    
    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Subtotal (sin impuestos ni envío)"
    )
    
    tax = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Impuestos"
    )
    
    shipping_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Costo de envío"
    )
    
    discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Descuento aplicado"
    )
    
    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Total del pedido"
    )
    
    # ========================================
    # INFORMACIÓN DE ENVÍO
    # ========================================
    
    shipping_address = models.TextField(
        help_text="Dirección de envío completa"
    )
    
    shipping_city = models.CharField(
        max_length=100,
        help_text="Ciudad de envío"
    )
    
    shipping_state = models.CharField(
        max_length=100,
        help_text="Departamento de envío"
    )
    
    shipping_postal_code = models.CharField(
        max_length=20,
        help_text="Código postal de envío"
    )
    
    shipping_country = models.CharField(
        max_length=100,
        help_text="País de envío"
    )
    
    # ========================================
    # INFORMACIÓN DE CONTACTO
    # ========================================
    
    customer_email = models.EmailField(
        help_text="Email del cliente"
    )
    
    customer_phone = models.CharField(
        max_length=20,
        help_text="Teléfono del cliente"
    )
    
    # ========================================
    # NOTAS
    # ========================================
    
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Notas adicionales del pedido"
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
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user_id']),
            models.Index(fields=['order_number']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"Pedido {self.order_number}"
    
    # ========================================
    # MÉTODOS ÚTILES
    # ========================================
    
    def calculate_total(self):
        """Calcula el total del pedido"""
        self.subtotal = sum(
            item.get_total() for item in self.items.all()
        )
        self.total = self.subtotal + self.tax + self.shipping_cost - self.discount
        self.save()
        return self.total


class OrderItem(models.Model):
    """Modelo de Item en el Pedido"""
    
    # ========================================
    # RELACIONES
    # ========================================
    
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        help_text="Pedido asociado"
    )
    
    # ========================================
    # INFORMACIÓN DEL PRODUCTO
    # ========================================
    
    # ID del producto (es otro servicio)
    product_id = models.IntegerField(
        help_text="ID del producto"
    )
    
    product_name = models.CharField(
        max_length=255,
        help_text="Nombre del producto al momento de la compra"
    )
    
    product_image = models.URLField(
        blank=True,
        null=True,
        help_text="Imagen del producto al momento de la compra"
    )
    
    # ========================================
    # PRECIOS
    # ========================================
    
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        help_text="Precio del producto al momento de la compra"
    )
    
    quantity = models.IntegerField(
        validators=[MinValueValidator(1)],
        help_text="Cantidad de unidades"
    )
    
    # ========================================
    # TIMESTAMPS
    # ========================================
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha de creación"
    )
    
    # ========================================
    # CONFIGURACIÓN DEL MODELO
    # ========================================
    
    class Meta:
        verbose_name = 'Item del Pedido'
        verbose_name_plural = 'Items del Pedido'
        ordering = ['id']
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['product_id']),
        ]
    
    def __str__(self):
        return f"{self.product_name} x{self.quantity}"
    
    # ========================================
    # MÉTODOS ÚTILES
    # ========================================
    
    def get_total(self):
        """Calcula el total para este item"""
        return self.price * self.quantity