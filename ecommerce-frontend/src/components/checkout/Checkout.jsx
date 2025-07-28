import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Stepper, Step, StepLabel, Box } from '@mui/material';
import CartSummary from '../cart/CartSummary';
import ShippingForm from '../ShippingForm';
import PaymentForm from './PaymentForm';
import {useCart} from '../../context/CartContext';

const steps = ['Shipping Details', 'Payment'];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState(null);
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleShippingSubmit = (data) => {
    setShippingData(data);
    setActiveStep(1);
  };

  const handlePaymentSuccess = (order) => {
    navigate('/order-success', { state: { order } });
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {activeStep === 0 ? (
        <ShippingForm onSubmit={handleShippingSubmit} />
      ) : (
        <Box>
          <CartSummary />
          <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
            Total: ${cartTotal.toFixed(2)}
          </Typography>
          <PaymentForm 
            shippingData={shippingData} 
            onSuccess={handlePaymentSuccess} 
          />
        </Box>
      )}
    </Container>
  );
};

export default Checkout;