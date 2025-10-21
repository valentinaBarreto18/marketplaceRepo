# ========================================
# MODELS - SERVICIO USUARIOS
# ========================================

from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Modelo personalizado de Usuario
    Hereda de AbstractUser (usuario estándar de Django)
    """
    
    # ========================================
    # CAMPOS BÁSICOS
    # ========================================
    
    email = models.EmailField(
        unique=True,
        help_text="Correo electrónico único del usuario"
    )
    
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="Número de teléfono"
    )
    
    # ========================================
    # DIRECCIÓN
    # ========================================
    
    address = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Dirección del usuario"
    )
    
    city = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Ciudad"
    )
    
    state = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Departamento o Estado"
    )
    
    postal_code = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="Código postal"
    )
    
    country = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="País"
    )
    
    # ========================================
    # PERFIL
    # ========================================
    
    avatar = models.URLField(
        blank=True,
        null=True,
        help_text="URL de la foto de perfil"
    )
    
    bio = models.TextField(
        blank=True,
        null=True,
        help_text="Biografía del usuario"
    )
    
    # ========================================
    # ESTADO
    # ========================================
    
    is_verified = models.BooleanField(
        default=False,
        help_text="¿El correo ha sido verificado?"
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
        help_text="Fecha de última actualización"
    )
    
    # ========================================
    # CONFIGURACIÓN DEL MODELO
    # ========================================
    
    USERNAME_FIELD = 'email'              # Usar email en lugar de username
    REQUIRED_FIELDS = ['first_name', 'last_name']  # Campos requeridos
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-created_at']         # Ordenar por fecha (más recientes primero)
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        """Representación en texto del usuario"""
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    # ========================================
    # MÉTODOS ÚTILES
    # ========================================
    
    def get_full_name(self):
        """Retorna el nombre completo"""
        return f"{self.first_name} {self.last_name}".strip()
    
    def get_short_name(self):
        """Retorna el nombre corto"""
        return self.first_name
    
    @property
    def full_address(self):
        """Retorna la dirección completa formateada"""
        parts = [
            self.address,
            self.city,
            self.state,
            self.postal_code,
            self.country,
        ]
        return ', '.join([p for p in parts if p])  # Solo incluir campos no vacíos