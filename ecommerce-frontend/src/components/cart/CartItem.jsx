import { Box, Typography, TextField, IconButton, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {useCart} from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity)) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Avatar 
        variant="square"
        src={item.image_url}
        sx={{ width: 100, height: 100 }}
      />
      
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6">{item.name}</Typography>
        <Typography variant="body1" color="text.secondary">
          ${Number(item.price).toFixed(2)}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <TextField
            type="number"
            size="small"
            value={item.quantity}
            onChange={handleQuantityChange}
            inputProps={{ min: 1 }}
            sx={{ width: 80, mr: 2 }}
          />
          <IconButton 
            onClick={() => removeFromCart(item.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Typography variant="h6" sx={{ minWidth: 100, textAlign: 'right' }}>
        ${(item.price * item.quantity).toFixed(2)}
      </Typography>
    </Box>
  );
};

export default CartItem;