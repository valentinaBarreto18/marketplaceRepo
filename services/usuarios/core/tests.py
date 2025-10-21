# ========================================
# TESTS - SERVICIO USUARIOS
# ========================================

from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User


class UserModelTestCase(TestCase):
    """Tests para el modelo User"""
    
    def setUp(self):
        """Preparar datos de prueba"""
        self.user_data = {
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'testpass123'
        }
    
    def test_create_user(self):
        """Probar creación de usuario"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.email, self.user_data['email'])
        self.assertTrue(user.check_password(self.user_data['password']))
    
    def test_user_str_representation(self):
        """Probar representación en texto del usuario"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(str(user), f"Test User (test@example.com)")
    
    def test_get_full_name(self):
        """Probar obtención de nombre completo"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.get_full_name(), 'Test User')


class RegisterAPITestCase(APITestCase):
    """Tests para la API de registro"""
    
    def test_register_user(self):
        """Probar registro de usuario"""
        data = {
            'email': 'newuser@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'password': 'securepass123',
            'password_confirm': 'securepass123'
        }
        response = self.client.post('/api/auth/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
    
    def test_register_user_password_mismatch(self):
        """Probar registro con contraseñas diferentes"""
        data = {
            'email': 'newuser@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'password': 'securepass123',
            'password_confirm': 'differentpass123'
        }
        response = self.client.post('/api/auth/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginAPITestCase(APITestCase):
    """Tests para la API de login"""
    
    def setUp(self):
        """Preparar usuario de prueba"""
        self.user = User.objects.create_user(
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='testpass123'
        )
    
    def test_login_user(self):
        """Probar login de usuario"""
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post('/api/auth/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
    
    def test_login_invalid_password(self):
        """Probar login con contraseña incorrecta"""
        data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }
        response = self.client.post('/api/auth/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)