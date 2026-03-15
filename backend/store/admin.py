from django.contrib import admin
from .models import *

# Register your models here.

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'brand', 'category', 'countInStock')
    list_filter = ('category', 'brand')
    search_fields = ('name', 'brand', 'category__name')

class OrderAdmin(admin.ModelAdmin):
    list_display = ('_id', 'user', 'createdAt', 'totalPrice', 'isPaid', 'isDelivered')
    list_filter = ('isPaid', 'isDelivered')
    search_fields = ('_id', 'user__username')

admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
admin.site.register(Review)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)