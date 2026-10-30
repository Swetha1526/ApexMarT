from django.urls import path
from . import views

urlpatterns = [
    path('', views.getOrders, name='orders-all'),
    path('add/', views.addOrderItems, name='orders-add'),
    path('myorders/', views.getMyOrders, name='myorders'),
    path('summary/', views.getAdminSummary, name='orders-summary'),
    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay-order'),
    path('<str:pk>/deliver/', views.updateOrderToDelivered, name='deliver-order'),
]
