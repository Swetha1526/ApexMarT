from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from products.models import Product
from orders.models import Order


class OrderAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='orderuser',
            email='orderuser@example.com',
            password='password123'
        )
        self.product = Product.objects.create(
            name='Test Mouse',
            price=1500.00,
            brand='TestBrand',
            category='Electronics',
            count_in_stock=10
        )

        login_res = self.client.post('/api/users/login/', {
            'username': 'orderuser@example.com',
            'password': 'password123'
        }, format='json')
        self.token = login_res.data['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_create_order_and_get_my_orders(self):
        # 1. Create order
        order_payload = {
            'orderItems': [
                {
                    'product': self.product.id,
                    'name': self.product.name,
                    'qty': 2,
                    'price': float(self.product.price),
                    'image': 'https://example.com/img.jpg'
                }
            ],
            'shippingAddress': {
                'address': '123 Test Street',
                'city': 'Chennai',
                'postalCode': '600001',
                'country': 'India'
            },
            'paymentMethod': 'Simulated Payment',
            'itemsPrice': 3000.00,
            'shippingPrice': 0.00,
            'taxPrice': 540.00,
            'totalPrice': 3540.00
        }

        create_res = self.client.post('/api/orders/add/', order_payload, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        order_id = create_res.data['id']

        # 2. Get My Orders
        my_orders_res = self.client.get('/api/orders/myorders/')
        self.assertEqual(my_orders_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(my_orders_res.data), 1)
        self.assertEqual(my_orders_res.data[0]['id'], order_id)

        # 3. Get Order by ID
        order_detail_res = self.client.get(f'/api/orders/{order_id}/')
        self.assertEqual(order_detail_res.status_code, status.HTTP_200_OK)
        self.assertEqual(order_detail_res.data['total_price'], '3540.00')
