from django.urls import path
from . import views

urlpatterns = [
    path('', views.getProducts, name='products'),
    path('categories/', views.getCategories, name='product-categories'),
    path('top/', views.getTopProducts, name='top-products'),
    path('create/', views.createProduct, name='product-create'),
    path('<str:pk>/', views.getProduct, name='product-detail'),
    path('<str:pk>/reviews/', views.createProductReview, name='create-review'),
    path('<str:pk>/update/', views.updateProduct, name='product-update'),
    path('<str:pk>/delete/', views.deleteProduct, name='product-delete'),
]
