import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, List } from '@mui/material';
import OrderItem from './OrderItem';
import { getOrderHistory } from '../../services/orderService';
import useAuth from '../../hooks/useAuth';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchOrders = async () => {
      try {
        const data = await getOrderHistory();
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5">
          Please login to view your order history
        </Typography>
      </Box>
    );
  }

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
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5">
          You haven't placed any orders yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>
      
      <List>
        {orders.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </List>
    </Box>
  );
};

export default OrderHistory;