# ========================================
# SERIALIZERS - SERVICIO USUARIOS
# ========================================

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para mostrar datos del usuario
    Convierte el modelo User a JSON
    """
    
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'phone',
            'address',
            'city',
            'state',
            'postal_code',
            'country',
            'avatar',
            'bio',
            'is_verified',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_verified']
    
    def get_full_name(self, obj):
        """Calcula el nombre completo"""
        return obj.get_full_name()


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear/registrar un nuevo usuario
    Incluye validación de contraseña
    """
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text='Al menos 8 caracteres'
    )
    
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text='Confirma tu contraseña'
    )
    
    class Meta:
        model = User
        fields = [
            'email',
            'first_name',
            'last_name',
            'password',
            'password_confirm',
        ]
    
    def validate(self, data):
        """Validación general"""
        
        # ========================================
        # Validar que las contraseñas coincidan
        # ========================================
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Las contraseñas no coinciden.'
            })
        
        # ========================================
        # Validar longitud de contraseña
        # ========================================
        if len(data['password']) < 8:
            raise serializers.ValidationError({
                'password': 'La contraseña debe tener al menos 8 caracteres.'
            })
        
        # ========================================
        # Validar que el email no exista
        # ========================================
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({
                'email': 'Este correo ya está registrado.'
            })
        
        return data
    
    def create(self, validated_data):
        """Crea el usuario con la contraseña hasheada"""
        
        # Remover password_confirm (no la guardamos)
        validated_data.pop('password_confirm')
        
        # Crear usuario con create_user (hashea la contraseña)
        user = User.objects.create_user(**validated_data)
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer para login
    Valida email y contraseña
    """
    
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, data):
        """Validar credenciales"""
        
        email = data.get('email')
        password = data.get('password')
        
        # ========================================
        # Verificar que exista el usuario
        # ========================================
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('Correo o contraseña incorrectos.')
        
        # ========================================
        # Verificar que esté activo
        # ========================================
        if not user.is_active:
            raise serializers.ValidationError('Esta cuenta está desactivada.')
        
        # ========================================
        # Verificar contraseña
        # ========================================
        if not user.check_password(password):
            raise serializers.ValidationError('Correo o contraseña incorrectos.')
        
        # Guardar el usuario en los datos validados
        data['user'] = user
        
        return data


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para actualizar perfil de usuario
    No permite cambiar email ni contraseña aquí
    """
    
    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'phone',
            'address',
            'city',
            'state',
            'postal_code',
            'country',
            'avatar',
            'bio',
        ]


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Serializer con todos los detalles del usuario
    Para mostrar en perfiles
    """
    
    full_name = serializers.SerializerMethodField()
    full_address = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'phone',
            'address',
            'city',
            'state',
            'postal_code',
            'country',
            'full_address',
            'avatar',
            'bio',
            'is_verified',
            'is_active',
            'is_staff',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields
    
    def get_full_name(self, obj):
        return obj.get_full_name()
    
    def get_full_address(self, obj):
        return obj.full_address