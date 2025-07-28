import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Grid, 
  Avatar,
  TextField,
  Divider
} from '@mui/material';
import { getProductDetail } from '../../services/productService';
import {useCart} from '../../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductDetail(id);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate('/products')} sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Box>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Avatar
            variant="square"
            src={product.image_url || '/placeholder-product.png'}
            sx={{ 
              width: '100%', 
              height: 'auto',
              maxHeight: 500,
              borderRadius: 1
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h3" gutterBottom>
            {product.name}
          </Typography>
          
          <Typography variant="h4" color="primary" gutterBottom>
            ${Number(product.price).toFixed(2)}
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            {product.description}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Quantity:
            </Typography>
            <TextField
              type="number"
              size="small"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1, max: product.inventory_count }}
              sx={{ width: 80, mr: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              {product.inventory_count} available
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            size="large"
            onClick={handleAddToCart}
            disabled={product.inventory_count <= 0}
            sx={{ mr: 2 }}
          >
            {product.inventory_count > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetail;