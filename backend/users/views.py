from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, UserSerializerWithToken
from .models import UserProfile


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Allow login via either username or email
        username_or_email = attrs.get('username')
        if '@' in username_or_email:
            try:
                user_obj = User.objects.get(email__iexact=username_or_email)
                attrs['username'] = user_obj.username
            except User.DoesNotExist:
                pass

        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def registerUser(request):
    data = request.data
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    confirm_password = data.get('confirm_password', '')

    if not email or not password:
        return Response({'detail': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if confirm_password and password != confirm_password:
        return Response({'detail': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

    if len(password) < 6:
        return Response({'detail': 'Password must be at least 6 characters.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'detail': 'User with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    username = email.split('@')[0]
    base_username = username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}{counter}"
        counter += 1

    first_name = name
    last_name = ''
    if ' ' in name:
        parts = name.split(' ', 1)
        first_name = parts[0]
        last_name = parts[1]

    user = User.objects.create(
        username=username,
        email=email,
        first_name=first_name,
        last_name=last_name,
        password=make_password(password)
    )

    # UserProfile is created via post_save signal
    profile, _ = UserProfile.objects.get_or_create(user=user)
    if 'address' in data:
        profile.address = data.get('address', '')
    if 'city' in data:
        profile.city = data.get('city', '')
    if 'postal_code' in data:
        profile.postal_code = data.get('postal_code', '')
    if 'country' in data:
        profile.country = data.get('country', '')
    if 'phone_number' in data:
        profile.phone_number = data.get('phone_number', '')
    profile.save()

    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    data = request.data

    if 'name' in data and data['name']:
        parts = data['name'].strip().split(' ', 1)
        user.first_name = parts[0]
        user.last_name = parts[1] if len(parts) > 1 else ''

    if 'email' in data and data['email']:
        new_email = data['email'].strip().lower()
        if new_email != user.email and User.objects.filter(email=new_email).exclude(id=user.id).exists():
            return Response({'detail': 'Email is already taken by another account.'}, status=status.HTTP_400_BAD_REQUEST)
        user.email = new_email

    if 'password' in data and data['password'] != '':
        if len(data['password']) < 6:
            return Response({'detail': 'Password must be at least 6 characters.'}, status=status.HTTP_400_BAD_REQUEST)
        user.password = make_password(data['password'])

    user.save()

    profile, _ = UserProfile.objects.get_or_create(user=user)
    if 'address' in data:
        profile.address = data.get('address', '')
    if 'city' in data:
        profile.city = data.get('city', '')
    if 'postal_code' in data:
        profile.postal_code = data.get('postal_code', '')
    if 'country' in data:
        profile.country = data.get('country', '')
    if 'phone_number' in data:
        profile.phone_number = data.get('phone_number', '')
    profile.save()

    return Response(serializer.data)


# Admin-only views
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all().order_by('-date_joined')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    try:
        user = User.objects.get(id=pk)
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'detail': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk):
    try:
        user = User.objects.get(id=pk)
        data = request.data

        if 'name' in data:
            parts = data['name'].strip().split(' ', 1)
            user.first_name = parts[0]
            user.last_name = parts[1] if len(parts) > 1 else ''

        if 'email' in data:
            user.email = data['email']

        if 'isAdmin' in data:
            user.is_staff = bool(data['isAdmin'])

        user.save()
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'detail': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    try:
        user_for_deletion = User.objects.get(id=pk)
        if user_for_deletion.id == request.user.id:
            return Response({'detail': 'You cannot delete yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        user_for_deletion.delete()
        return Response({'detail': 'User was deleted successfully.'})
    except User.DoesNotExist:
        return Response({'detail': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)
