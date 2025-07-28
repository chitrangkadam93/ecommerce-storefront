from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Order, OrderItem, Product
from .serializers import OrderSerializer
import requests
import base64
import json
from django.conf import settings
from rest_framework.decorators import action

class PayPalClient:
    def __init__(self):
        self.base_url = (
            "https://api.sandbox.paypal.com" 
            if settings.PAYPAL_MODE == "sandbox" 
            else "https://api.paypal.com"
        )
        self.auth_token = self._get_auth_token()

    def _get_auth_token(self):
        auth = base64.b64encode(
            f"{settings.PAYPAL_CLIENT_ID}:{settings.PAYPAL_CLIENT_SECRET}".encode()
        ).decode()
        
        headers = {
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        response = requests.post(
            f"{self.base_url}/v1/oauth2/token",
            headers=headers,
            data={"grant_type": "client_credentials"}
        )
        response.raise_for_status()
        return response.json()["access_token"]

    def create_order(self, amount, currency="USD", items=None, order_id=None):
        headers = {
            "Authorization": f"Bearer {self.auth_token}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        payload = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "reference_id": str(order_id),
                "amount": {
                    "currency_code": currency,
                    "value": f"{amount:.2f}",
                    "breakdown": {
                        "item_total": {
                            "currency_code": currency,
                            "value": f"{amount:.2f}"
                        }
                    }
                },
                "items": items or []
            }],
            "application_context": {
                "brand_name": settings.PAYPAL_BRAND_NAME,
                "user_action": "PAY_NOW",
                "return_url": f"{settings.FRONTEND_URL}/order-success",
                "cancel_url": f"{settings.FRONTEND_URL}/checkout"
            }
        }
        
        response = requests.post(
            f"{self.base_url}/v2/checkout/orders",
            json=payload,
            headers=headers
        )
        response.raise_for_status()
        return response.json()

    def get_order_status(self, order_id):
        headers = {
            "Authorization": f"Bearer {self.auth_token}",
            "Content-Type": "application/json"
        }
        response = requests.get(
            f"{self.base_url}/v2/checkout/orders/{order_id}",
            headers=headers
        )
        response.raise_for_status()
        return response.json()

    def capture_order(self, order_id):
        headers = {
            "Authorization": f"Bearer {self.auth_token}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/v2/checkout/orders/{order_id}/capture",
                headers=headers
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as err:
            error_detail = err.response.json()
            print(f"PayPal API Error: {error_detail}")
            raise ValueError(error_detail.get('details', [{}])[0].get('issue', 'Capture failed'))

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        items = request.data.get('items', [])
        if not items:
            return Response(
                {"detail": "No items in order"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Calculate total and validate items
            total = 0
            paypal_items = []
            for item in items:
                product = Product.objects.get(id=item['product'])
                price = float(item['price'])
                quantity = int(item['quantity'])
                
                total += price * quantity
                paypal_items.append({
                    "name": product.name[:127],
                    "unit_amount": {
                        "currency_code": "USD",
                        "value": f"{price:.2f}"
                    },
                    "quantity": str(quantity),
                    "sku": str(product.id)[:127]
                })

            # Create local order first
            order = Order.objects.create(
                user=request.user,
                total_amount=total,
                status='pending'
            )

            # Create order items
            for item in items:
                OrderItem.objects.create(
                    order=order,
                    product_id=item['product'],
                    quantity=item['quantity'],
                    unit_price=item['price']
                )

            # Create PayPal order
            paypal = PayPalClient()
            paypal_order = paypal.create_order(
                amount=total,
                items=paypal_items,
                order_id=order.id
            )

            # Save PayPal order ID
            order.paypal_order_id = paypal_order['id']
            order.paypal_payment_status = paypal_order['status']
            order.save()

            return Response({
                'id': paypal_order['id'],
                'status': paypal_order['status']
            })

        except Product.DoesNotExist:
            return Response(
                {"detail": "Invalid product in order"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            if 'order' in locals():
                order.status = 'failed'
                order.save()
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['post'], url_path='verify-payment')
    def verify_payment(self, request):
        try:
            paypal_order_id = request.data.get('orderID')
            if not paypal_order_id:
                raise ValueError("Missing PayPal Order ID")

            paypal = PayPalClient()
            order_status = paypal.get_order_status(paypal_order_id)
            
            # Get order using the correct field name
            try:
                order = Order.objects.get(paypal_order_id=paypal_order_id)
            except Order.DoesNotExist:
                return Response(
                    {'detail': 'Order not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            if order_status['status'] == 'COMPLETED':
                if order.status != 'paid':
                    order.status = 'paid'
                    order.paypal_payment_status = 'COMPLETED'
                    order.paypal_payment_data = order_status
                    order.save()
                    
                    # Create order items if missing
                    if not order.items.exists():
                        purchase_unit = order_status['purchase_units'][0]
                        for item in purchase_unit.get('items', []):
                            product = Product.objects.get(id=item['sku'])
                            OrderItem.objects.create(
                                order=order,
                                product=product,
                                quantity=int(item['quantity']),
                                price=float(item['unit_amount']['value'])
                            )
                
                return Response({
                    'status': 'paid',
                    'order': OrderSerializer(order).data
                })

            
            # Handle different status cases
            if order_status['status'] == 'COMPLETED':
                # Order was already captured - just verify and update local record
                order = Order.objects.get(paypal_order_id=order_id)
                if order.status != 'paid':  # Only update if not already marked paid
                    order.status = 'paid'
                    order.paypal_payment_data = json.dumps(order_status)
                    order.save()
                    
                    if not order.items.exists():
                        purchase_unit = order_status['purchase_units'][0]
                        for item in purchase_unit.get('items', []):
                            product = Product.objects.get(id=item['sku'])
                            OrderItem.objects.create(
                                order=order,
                                product=product,
                                quantity=int(item['quantity']),
                                unit_price=float(item['unit_amount']['value'])
                            )
                
                return Response({
                    'status': 'already_paid',
                    'order': OrderSerializer(order).data
                })
                
            elif order_status['status'] == 'APPROVED':
                # Proceed with capture
                capture_data = paypal.capture_order(order_id)
                order = Order.objects.get(paypal_order_id=order_id)
                
                if capture_data.get('status') == 'COMPLETED':
                    order.status = 'paid'
                    order.paypal_payment_data = json.dumps(capture_data)
                    order.save()
                    
                    if not order.items.exists():
                        purchase_unit = capture_data['purchase_units'][0]
                        for item in purchase_unit.get('items', []):
                            product = Product.objects.get(id=item['sku'])
                            OrderItem.objects.create(
                                order=order,
                                product=product,
                                quantity=int(item['quantity']),
                                unit_price=float(item['unit_amount']['value'])
                            )
                    
                    return Response({
                        'status': 'paid',
                        'order': OrderSerializer(order).data
                    })
            
            else:
                return Response(
                    {'detail': f"Cannot process order in {order_status['status']} state"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Order.DoesNotExist:
            return Response(
                {'detail': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error in verify_payment: {str(e)}")
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )