import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Pagination, 
  TextField, 
  Box, 
  CircularProgress, 
  Typography,
  Button
} from '@mui/material';
import ProductCard from './ProductCard';
import { getProducts } from '../../services/productService';
import useAuth from '../../hooks/useAuth';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProducts(page, searchTerm);
        
        console.log('API Response:', response); // Keep this for debugging

        // Handle the direct array response
        if (Array.isArray(response)) {
          setProducts(response);
          // Since your API doesn't return pagination data, we'll assume single page
          setTotalPages(1);
        } else {
          // If the response isn't an array (unexpected format)
          setProducts([]);
          setTotalPages(1);
          setError('Unexpected data format received');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message || 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, searchTerm]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleRetry = () => {
    setPage(1);
    setSearchTerm('');
    setError(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" my={4} gap={2}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleRetry}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <TextField
        label="Search products"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />
      
      {products.length === 0 ? (
        <Box display="flex" justifyContent="center">
          <Typography variant="h6">No products found</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard 
                  product={product} 
                  onViewDetail={() => navigate(`/products/${product.id}`)}
                  showAddToCart={isAuthenticated}
                />
              </Grid>
            ))}
          </Grid>
          
          {/* Only show pagination if we actually have multiple pages */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ProductGrid;