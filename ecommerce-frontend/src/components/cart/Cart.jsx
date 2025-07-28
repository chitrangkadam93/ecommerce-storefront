import { Box, Typography, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import {useCart} from '../../context/CartContext';

const Cart = () => {
  const { cartItems, cartCount } = useCart();
  const navigate = useNavigate();

  if (cartCount === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          {cartItems.map((item) => (
            <Box key={item.id} sx={{ mb: 2 }}>
              <CartItem item={item} />
              <Divider sx={{ my: 2 }} />
            </Box>
          ))}
        </Box>
        
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <CartSummary />
          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;