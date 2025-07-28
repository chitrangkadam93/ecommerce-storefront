import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder, verifyPayment } from '../../services/orderService';

const PaymentForm = ({ shippingData }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paypalSdkReady, setPaypalSdkReady] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const initialOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
    // "enable-funding": "venmo",
    "buyer-country": "US",
    currency: "USD",
    components: "buttons",
  };

  const createPayPalOrder = async () => {
    try {
      setLoading(false);
      setError(null);

      if (!cartItems?.length) {
        throw new Error('Your cart is empty');
      }

      const orderData = {
        items: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: Number(item.price).toFixed(2)
        })),
        total: cartTotal.toFixed(2),
        shipping_address: shippingData,
        payment_method: "paypal",
        currency: "USD"
      };

      const response = await createOrder(orderData);
      if (!response?.id) {
        throw new Error('Invalid order ID from server');
      }
      return response.id;
    } catch (err) {
      console.error('Order creation error:', err);
      setError(err.message || 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (data, actions) => {
    try {
      setLoading(true);
      const paymentDetails = await actions.order.capture();
      
      const verification = await verifyPayment({
        orderID: data.orderID,
        paymentID: paymentDetails.id
      });

      if (verification.status === 'paid') {
        clearCart();
        setPaymentSuccess(true);
        navigate('/orders');
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
      
      if (err.message.includes('INSTRUMENT_DECLINED')) {
        return actions.restart();
      }
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography>
          Your order has been placed successfully.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', my: 4, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Complete Your Payment
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Order Total: ${cartTotal.toFixed(2)}
      </Typography>

      {/* <PayPalScriptProvider 
        options={initialOptions}
        onLoad={() => setPaypalSdkReady(true)}
      >
        {!paypalSdkReady || loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={createPayPalOrder}
            onApprove={onApprove}
            onError={(err) => setError(err.message)}
            onCancel={() => setError('Payment cancelled')}
          />
        )}
      </PayPalScriptProvider> */}

      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
            color: "gold",
            label: "paypal",
          }}
          createOrder={createPayPalOrder}
          onApprove={onApprove}
        />
      </PayPalScriptProvider>

      <Button 
        variant="outlined" 
        onClick={() => navigate('/cart')}
        sx={{ mt: 2}}
      >
        Back to Cart
      </Button>
    </Box>
  );
};

export default PaymentForm;