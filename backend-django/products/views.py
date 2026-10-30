from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import Product, Review
from .serializers import ProductSerializer, ReviewSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def getProducts(request):
    query = request.query_params.get('keyword', '')
    category = request.query_params.get('category', '')
    sort = request.query_params.get('sort', '-created_at')

    products = Product.objects.all()

    if query:
        products = products.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(brand__icontains=query) |
            Q(category__icontains=query)
        )

    if category and category.lower() != 'all':
        products = products.filter(category__iexact=category)

    # Sorting
    if sort == 'price_asc':
        products = products.order_by('price')
    elif sort == 'price_desc':
        products = products.order_by('-price')
    elif sort == 'rating':
        products = products.order_by('-rating')
    elif sort == 'newest':
        products = products.order_by('-created_at')
    else:
        products = products.order_by('-created_at')

    serializer = ProductSerializer(products, many=True)
    return Response({
        'products': serializer.data,
        'count': products.count()
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def getCategories(request):
    categories = Product.objects.values_list('category', flat=True).distinct()
    categories = [c for c in categories if c]
    return Response(categories)


@api_view(['GET'])
@permission_classes([AllowAny])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def getProduct(request, pk):
    try:
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(id=pk)
    data = request.data

    # Check if user already reviewed
    already_exists = product.reviews.filter(user=user).exists()
    if already_exists:
        return Response({'detail': 'Product already reviewed by you.'}, status=status.HTTP_400_BAD_REQUEST)

    # Check rating
    rating = int(data.get('rating', 0))
    if rating <= 0:
        return Response({'detail': 'Please select a rating.'}, status=status.HTTP_400_BAD_REQUEST)

    # Create review
    review = Review.objects.create(
        user=user,
        product=product,
        name=f"{user.first_name} {user.last_name}".strip() or user.username,
        rating=rating,
        comment=data.get('comment', '')
    )

    # Update product rating and num_reviews
    reviews = product.reviews.all()
    product.num_reviews = len(reviews)

    total = sum([r.rating for r in reviews])
    product.rating = round(total / len(reviews), 2)
    product.save()

    return Response({'detail': 'Review added successfully.'}, status=status.HTTP_201_CREATED)


# Admin-only product views
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    data = request.data

    product = Product.objects.create(
        user=user,
        name=data.get('name', 'Sample Product'),
        price=data.get('price', 0.00),
        brand=data.get('brand', 'Sample Brand'),
        count_in_stock=data.get('count_in_stock', 0),
        category=data.get('category', 'Sample Category'),
        description=data.get('description', 'Sample Description'),
        image=data.get('image', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'),
    )

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    try:
        product = Product.objects.get(id=pk)
        data = request.data

        product.name = data.get('name', product.name)
        product.price = data.get('price', product.price)
        product.brand = data.get('brand', product.brand)
        product.count_in_stock = data.get('count_in_stock', product.count_in_stock)
        product.category = data.get('category', product.category)
        product.description = data.get('description', product.description)
        if 'image' in data and data['image']:
            product.image = data['image']

        product.save()

        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    try:
        product = Product.objects.get(id=pk)
        product.delete()
        return Response({'detail': 'Product deleted successfully.'})
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
