# ========================================
# ADMIN.PY - PANEL DE ADMINISTRACIÓN
# ========================================

from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    """
    Items del pedido mostrados DENTRO del formulario del pedido
    
    Esto permite ver y editar los items sin ir a otra página
    
    TabularInline = Muestra como tabla dentro del pedido
    StackedInline = Mostraría cada item en su propio bloque
    """
    model = OrderItem
    extra = 0                                           # No agregar filas vacías
    fields = ('product_id', 'product_name', 'price', 'quantity')
    readonly_fields = ('product_id', 'product_name', 'price', 'quantity')  # No editar


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """
    Personaliza cómo ves los Pedidos en el panel /admin/
    """
    
    # ========================================
    # COLUMNAS EN LA LISTA
    # ========================================
    list_display = (
        'order_number',      # Ej: ORD-12345678
        'user_id',          # Ej: 1
        'status',           # Ej: pending, shipped, delivered
        'total',            # Ej: 1150.00
        'customer_email',   # Ej: juan@example.com
        'created_at',       # Ej: 2024-01-15
    )
    # ¿Qué ves sin esto?: "Order object (1)" - No sirve
    # ¿Qué ves con esto?: Columnas útiles con datos reales
    
    # ========================================
    # FILTROS A LA DERECHA
    # ========================================
    list_filter = (
        'status',       # Botones: Pending, Confirmed, Shipped, Delivered, Cancelled
        'created_at',   # Selector de fechas
    )
    # Permite filtrar rápidamente sin escribir
    
    # ========================================
    # BÚSQUEDA
    # ========================================
    search_fields = (
        'order_number',     # Buscar por número de orden
        'customer_email',   # Buscar por email
        'customer_phone',   # Buscar por teléfono
    )
    # Si escribes "ORD-123", busca en estos campos
    
    # ========================================
    # ORGANIZACIÓN DE CAMPOS EN SECCIONES
    # ========================================
    fieldsets = (
        ('Información del Pedido', {
            'fields': ('order_number', 'user_id', 'status')
        }),
        # Resultado: 3 campos en sección "Información del Pedido"
        
        ('Totales', {
            'fields': ('subtotal', 'tax', 'shipping_cost', 'discount', 'total')
        }),
        # Resultado: 5 campos en sección "Totales"
        
        ('Información de Envío', {
            'fields': (
                'shipping_address',
                'shipping_city',
                'shipping_state',
                'shipping_postal_code',
                'shipping_country',
            )
        }),
        # Resultado: Toda la dirección en una sección
        
        ('Información de Contacto', {
            'fields': ('customer_email', 'customer_phone')
        }),
        # Resultado: Email y teléfono juntos
        
        ('Notas', {
            'fields': ('notes',)
        }),
        # Resultado: Campo para notas adicionales
        
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)  # Esta sección está COLAPSADA (cerrada) por defecto
        }),
        # Resultado: Sección que se expande con un clic
    )
    
    # ========================================
    # CAMPOS QUE NO SE PUEDEN EDITAR
    # ========================================
    readonly_fields = (
        'order_number',  # Se genera automáticamente
        'created_at',    # Se asigna al crear
        'updated_at',    # Se actualiza automáticamente
    )
    # No queremos que cambien estos valores
    
    # ========================================
    # INCLUIR ITEMS DENTRO DEL PEDIDO
    # ========================================
    inlines = [OrderItemInline]
    # Los items del pedido aparecen dentro del formulario, no en otra página
    
    # ========================================
    # ORDENAMIENTO
    # ========================================
    ordering = ('-created_at',)
    # El "-" significa descendente (más recientes primero)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """
    Acceso rápido a todos los items de todos los pedidos
    Sirve si necesitas editar items sin ir al pedido
    """
    
    list_display = (
        'product_name',  # iPhone 15
        'order',         # ORD-12345678
        'price',         # 1000.00
        'quantity',      # 2
        'created_at',    # 2024-01-15
    )
    
    list_filter = (
        'created_at',        # Filtrar por fecha
        'order__status',     # Filtrar por estado del pedido
                            # order__status usa la relación (order__) 
                            # y accede a su campo status
    )
    
    search_fields = (
        'product_name',           # Buscar por nombre
        'order__order_number',    # Buscar por número de orden del pedido
    )
    
    readonly_fields = ('created_at',)
    
    ordering = ('-created_at',)