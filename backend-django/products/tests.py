from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from products.models import Product


class ProductAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.product = Product.objects.create(
            name='Test Laptop',
            price=50000.00,
            brand='TestBrand',
            category='Electronics',
            count_in_stock=10,
            description='A testing laptop'
        )

    def test_get_products_list(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('products', response.data)
        self.assertEqual(len(response.data['products']), 1)

    def test_get_product_detail(self):
        response = self.client.get(f'/api/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Laptop')

    def test_filter_products_by_category(self):
        response = self.client.get('/api/products/?category=Electronics')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['products']), 1)
