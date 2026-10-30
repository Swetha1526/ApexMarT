from django.contrib import admin
from .models import Order, OrderItem, ShippingAddress


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


class ShippingAddressInline(admin.StackedInline):
    model = ShippingAddress
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'is_paid', 'paid_at', 'is_delivered', 'delivered_at', 'created_at')
    list_filter = ('is_paid', 'is_delivered', 'created_at')
    inlines = [ShippingAddressInline, OrderItemInline]


admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
