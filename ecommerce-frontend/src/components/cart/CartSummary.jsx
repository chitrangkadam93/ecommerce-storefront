import { Box, Typography, Divider } from '@mui/material';
import {useCart} from '../../context/CartContext';

const CartSummary = () => {
  const { cartTotal, cartCount } = useCart();

  return (
    <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Typography>Subtotal ({cartCount} items)</Typography>
        <Typography>${cartTotal.toFixed(2)}</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Typography>Shipping</Typography>
        <Typography>FREE</Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6">${cartTotal.toFixed(2)}</Typography>
      </Box>
    </Box>
  );
};

export default CartSummary;