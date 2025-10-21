# ========================================
# VIEWS - SERVICIO USUARIOS
# ========================================

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404

from .models import User
from .serializers import (
    UserSerializer,
    UserCreateSerializer,
    UserLoginSerializer,
    UserUpdateSerializer,
    UserDetailSerializer,
)


class RegisterView(APIView):
    """
    Vista para registrar un nuevo usuario
    POST /api/auth/register/
    """
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Registrar nuevo usuario"""
        
        # Validar datos
        serializer = UserCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            # Crear el usuario
            user = serializer.save()
            
            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Usuario registrado exitosamente',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):
    """
    Vista para iniciar sesión
    POST /api/auth/login/
    """
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Hacer login"""
        
        # Validar credenciales
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            # Obtener el usuario validado
            user = serializer.validated_data['user']
            
            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Sesión iniciada exitosamente',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        
        return Response(
            {'error': serializer.errors},
            status=status.HTTP_401_UNAUTHORIZED
        )


class ProfileView(APIView):
    """
    Vista para obtener y actualizar perfil del usuario actual
    GET /api/users/profile/  - Obtener perfil
    PUT /api/users/profile/  - Actualizar perfil
    PATCH /api/users/profile/ - Actualizar perfil (parcial)
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Obtener perfil del usuario actual"""
        
        user = request.user
        serializer = UserDetailSerializer(user)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        """Actualizar perfil completo"""
        
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Perfil actualizado exitosamente',
                'user': UserDetailSerializer(user).data,
            }, status=status.HTTP_200_OK)
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    def patch(self, request):
        """Actualizar perfil parcial"""
        
        user = request.user
        serializer = UserUpdateSerializer(
            user,
            data=request.data,
            partial=True  # Permite actualizar solo algunos campos
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Perfil actualizado exitosamente',
                'user': UserDetailSerializer(user).data,
            }, status=status.HTTP_200_OK)
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class UserListView(APIView):
    """
    Vista para listar todos los usuarios (solo admin)
    GET /api/users/list/
    """
    
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        """Listar todos los usuarios"""
        
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        
        return Response({
            'count': users.count(),
            'users': serializer.data,
        }, status=status.HTTP_200_OK)


class UserDetailView(APIView):
    """
    Vista para ver detalles de un usuario específico
    GET /api/users/{id}/
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, user_id):
        """Obtener detalles de un usuario"""
        
        # Obtener usuario o devolver 404
        user = get_object_or_404(User, id=user_id)
        
        serializer = UserDetailSerializer(user)
        
        return Response(serializer.data, status=status.HTTP_200_OK)


class RefreshTokenView(APIView):
    """
    Vista para refrescar el token de acceso
    POST /api/auth/refresh/
    """
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Refrescar token"""
        
        try:
            refresh_token = request.data.get('refresh')
            
            if not refresh_token:
                return Response(
                    {'error': 'Se requiere el refresh token'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Crear nuevo token de acceso
            refresh = RefreshToken(refresh_token)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {'error': 'Token inválido o expirado'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class LogoutView(APIView):
    """
    Vista para logout (invalidar token)
    POST /api/auth/logout/
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Hacer logout"""
        
        try:
            refresh_token = request.data.get('refresh')
            
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response(
                {'message': 'Sesión cerrada exitosamente'},
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            return Response(
                {'error': 'Error al cerrar sesión'},
                status=status.HTTP_400_BAD_REQUEST
            )