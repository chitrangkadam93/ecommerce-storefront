import { Card, CardMedia, CardContent, CardActions, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import {useCart} from '../../context/CartContext';

const ProductCard = ({ product, onViewDetail, showAddToCart }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.image_url || '/placeholder-product.png'}
        alt={product.name}
        sx={{ objectFit: 'contain', p: 1, bgcolor: '#f5f5f5' }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h3">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description}
        </Typography>
        <Typography variant="h6" color="primary">
          ${Number(product.price).toFixed(2)}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {product.inventory_count > 0 
            ? `${product.inventory_count} in stock` 
            : 'Out of stock'}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Button 
          size="small" 
          color="primary"
          onClick={onViewDetail}
          component={Link}
          to={`/products/${product.id}`}
        >
          View Details
        </Button>
        
        {showAddToCart && product.inventory_count > 0 && (
          <Button 
            size="small" 
            color="secondary"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;