from django.contrib import admin
from .models import Product, Review


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'brand', 'count_in_stock', 'rating', 'num_reviews', 'created_at')
    list_filter = ('category', 'brand')
    search_fields = ('name', 'description', 'brand', 'category')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'name', 'rating', 'created_at')
    list_filter = ('rating',)
