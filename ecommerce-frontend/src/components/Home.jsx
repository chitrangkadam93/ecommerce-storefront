import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import ProductGrid from './products/ProductGrid';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const Home = () => {
  const {isAuthenticated} = useContext(AuthContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'white' }}
          >
            Welcome to Our Store
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{ color: 'white' }}>
            Discover amazing products at unbeatable prices
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              size="large"
              sx={{ mr: 2 }}
            >
              Shop Now
            </Button>
            {!isAuthenticated && (
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Sign Up
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Container sx={{ py: 8 }} maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Featured Products
        </Typography>
        <ProductGrid featuredOnly={true} />
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="md">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  Free Shipping
                </Typography>
                <Typography variant="body1">
                  On all orders over $50
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  30-Day Returns
                </Typography>
                <Typography variant="body1">
                  No questions asked
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  Secure Payment
                </Typography>
                <Typography variant="body1">
                  PayPal and credit cards
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;