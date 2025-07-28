# orders/paypal.py
import requests
import base64
from django.conf import settings

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
        
        data = {"grant_type": "client_credentials"}
        response = requests.post(
            f"{self.base_url}/v1/oauth2/token",
            headers=headers,
            data=data
        )
        return response.json()["access_token"]

    def create_order(self, amount, currency="USD"):
        headers = {
            "Authorization": f"Bearer {self.auth_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": currency,
                    "value": f"{amount:.2f}"
                }
            }],
            "application_context": {
                "return_url": f"{settings.FRONTEND_URL}/order-success",
                "cancel_url": f"{settings.FRONTEND_URL}/checkout"
            }
        }
        
        response = requests.post(
            f"{self.base_url}/v2/checkout/orders",
            json=payload,
            headers=headers
        )
        return response.json()

    def capture_order(self, order_id):
        headers = {
            "Authorization": f"Bearer {self.auth_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{self.base_url}/v2/checkout/orders/{order_id}/capture",
            headers=headers
        )
        return response.json()