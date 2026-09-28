from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    address = serializers.SerializerMethodField(read_only=True)
    city = serializers.SerializerMethodField(read_only=True)
    postal_code = serializers.SerializerMethodField(read_only=True)
    country = serializers.SerializerMethodField(read_only=True)
    phone_number = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'isAdmin', 'address', 'city', 'postal_code', 'country', 'phone_number']

    def get_name(self, obj):
        name = f"{obj.first_name} {obj.last_name}".strip()
        if not name:
            name = obj.username or obj.email
        return name

    def get_isAdmin(self, obj):
        return obj.is_staff or obj.is_superuser

    def get_address(self, obj):
        return getattr(obj.profile, 'address', '') if hasattr(obj, 'profile') else ''

    def get_city(self, obj):
        return getattr(obj.profile, 'city', '') if hasattr(obj, 'profile') else ''

    def get_postal_code(self, obj):
        return getattr(obj.profile, 'postal_code', '') if hasattr(obj, 'profile') else ''

    def get_country(self, obj):
        return getattr(obj.profile, 'country', '') if hasattr(obj, 'profile') else ''

    def get_phone_number(self, obj):
        return getattr(obj.profile, 'phone_number', '') if hasattr(obj, 'profile') else ''


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    refresh = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'isAdmin', 'address', 'city', 'postal_code', 'country', 'phone_number', 'token', 'refresh']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

    def get_refresh(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token)
