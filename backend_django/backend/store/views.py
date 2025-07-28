from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Product, CartItem
from .serializers import ProductSerializer, CartItemSerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(status='active')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).select_related('product')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        # Accept either 'product' or 'product_id' from frontend
        product_id = request.data.get('product') or request.data.get('product_id')
        if not product_id:
            return Response(
                {'error': 'Product ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        quantity = int(request.data.get('quantity', 1))
        
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check inventory
        if product.inventory_count < quantity:
            return Response(
                {'error': 'Not enough inventory'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if item exists
        existing_item = self.get_queryset().filter(product_id=product_id).first()
        
        if existing_item:
            new_quantity = existing_item.quantity + quantity
            if new_quantity > product.inventory_count:
                return Response(
                    {'error': 'Cannot exceed available inventory'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            existing_item.quantity = new_quantity
            existing_item.save()
            serializer = self.get_serializer(existing_item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Create new item with modified data
        modified_data = request.data.copy()
        modified_data['product'] = product_id  # Ensure 'product' field exists
        
        serializer = self.get_serializer(data=modified_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    # ... keep existing update method ...    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_quantity = int(request.data.get('quantity', instance.quantity))
        
        if new_quantity < 1:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        if new_quantity > instance.product.inventory_count:
            return Response(
                {'error': 'Cannot exceed available inventory'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        instance.quantity = new_quantity
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)