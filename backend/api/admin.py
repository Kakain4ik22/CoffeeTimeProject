# api/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Product, Category, Order, OrderItem, Review

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'role', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Дополнительная информация', {'fields': ('role', 'phone', 'avatar')}),
    )

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'category', 'available']
    list_filter = ['category', 'available']
    search_fields = ['name', 'description']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_price', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username']

admin.site.register(Category)
admin.site.register(OrderItem)
admin.site.register(Review)