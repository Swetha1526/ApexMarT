from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db.models import Sum
from django.contrib.auth.models import User
from products.models import Product
from .models import Order, OrderItem, ShippingAddress
from .serializers import OrderSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    order_items = data.get('orderItems', [])
    shipping_address_data = data.get('shippingAddress', {})

    if not order_items or len(order_items) == 0:
        return Response({'detail': 'No order items provided.'}, status=status.HTTP_400_BAD_REQUEST)

    # 1. Create Order
    order = Order.objects.create(
        user=user,
        payment_method=data.get('paymentMethod', 'Simulated Payment'),
        tax_price=data.get('taxPrice', 0.00),
        shipping_price=data.get('shippingPrice', 0.00),
        total_price=data.get('totalPrice', 0.00),
        is_paid=data.get('isPaid', False),
        paid_at=timezone.now() if data.get('isPaid', False) else None
    )

    # 2. Create Shipping Address
    ShippingAddress.objects.create(
        order=order,
        address=shipping_address_data.get('address', ''),
        city=shipping_address_data.get('city', ''),
        postal_code=shipping_address_data.get('postalCode', ''),
        country=shipping_address_data.get('country', ''),
        shipping_price=data.get('shippingPrice', 0.00)
    )

    # 3. Create Order Items and adjust product stock
    for item in order_items:
        product_id = item.get('product') or item.get('id')
        product = None
        if product_id:
            try:
                product = Product.objects.get(id=product_id)
                # Decrement stock safely
                qty = int(item.get('qty', item.get('quantity', 1)))
                if product.count_in_stock >= qty:
                    product.count_in_stock -= qty
                else:
                    product.count_in_stock = 0
                product.save()
            except Product.DoesNotExist:
                product = None

        OrderItem.objects.create(
            order=order,
            product=product,
            name=item.get('name', 'Item'),
            quantity=int(item.get('qty', item.get('quantity', 1))),
            price=item.get('price', 0.00),
            image=item.get('image', '')
        )

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.orders.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    try:
        order = Order.objects.get(id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Not authorized to view this order.'}, status=status.HTTP_403_FORBIDDEN)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    try:
        order = Order.objects.get(id=pk)
        if not (request.user.is_staff or order.user == request.user):
            return Response({'detail': 'Not authorized to modify this order.'}, status=status.HTTP_403_FORBIDDEN)

        order.is_paid = True
        order.paid_at = timezone.now()
        order.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist.'}, status=status.HTTP_404_NOT_FOUND)


# Admin-only order views
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    try:
        order = Order.objects.get(id=pk)
        order.is_delivered = True
        order.delivered_at = timezone.now()
        order.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getAdminSummary(request):
    total_users = User.objects.count()
    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    total_revenue_dict = Order.objects.filter(is_paid=True).aggregate(Sum('total_price'))
    total_revenue = float(total_revenue_dict['total_price__sum'] or 0.00)
    
    recent_orders = Order.objects.all().order_by('-created_at')[:5]
    recent_orders_serializer = OrderSerializer(recent_orders, many=True)

    return Response({
        'total_users': total_users,
        'total_products': total_products,
        'total_orders': total_orders,
        'total_revenue': round(total_revenue, 2),
        'recent_orders': recent_orders_serializer.data
    })
