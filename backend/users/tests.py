from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status


class UserAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='password123',
            first_name='Test',
            last_name='User'
        )

    def test_user_registration(self):
        response = self.client.post('/api/users/register/', {
            'name': 'New User',
            'email': 'newuser@example.com',
            'password': 'password123',
            'confirm_password': 'password123',
            'city': 'Mumbai',
            'country': 'India'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['email'], 'newuser@example.com')

    def test_user_login(self):
        response = self.client.post('/api/users/login/', {
            'username': 'test@example.com',
            'password': 'password123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_get_user_profile(self):
        login_res = self.client.post('/api/users/login/', {
            'username': 'test@example.com',
            'password': 'password123'
        }, format='json')
        token = login_res.data['token']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/users/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')
