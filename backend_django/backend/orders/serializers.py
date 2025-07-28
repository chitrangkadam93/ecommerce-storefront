from rest_framework import serializers
from .models import Order, OrderItem
from store.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'unit_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'total_amount', 'status', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'total_amount', 'status', 'created_at', 'updated_at']