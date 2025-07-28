import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatDate } from '../../utils/helpers';

const OrderItem = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    'Pending': 'warning',
    'Processing': 'info',
    'Completed': 'success',
    'Cancelled': 'error'
  };

  return (
    <Accordion 
      expanded={expanded} 
      onChange={() => setExpanded(!expanded)}
      sx={{ mb: 2 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle1">
              Order #{order.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(order.created_at)}
            </Typography>
          </Box>
          
          <Box>
            <Chip 
              label={order.status} 
              color={statusColors[order.status] || 'default'} 
              size="small"
            />
            <Typography variant="h6" sx={{ mt: 1 }}>
              ${Number(order.total_amount).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>
      
      <AccordionDetails>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Shipping Address
          </Typography>
          <Typography>
            {order.shipping_address?.street}<br />
            {order.shipping_address?.city}, {order.shipping_address?.state}<br />
            {order.shipping_address?.zip_code}<br />
            {order.shipping_address?.country}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Order Items
        </Typography>
        
        <List>
          {order.items.map((item) => (
            <ListItem key={item.id} sx={{ py: 1 }}>
              <Avatar 
                src={item.product.image_url} 
                variant="square"
                sx={{ width: 60, height: 60, mr: 2 }}
              />
              <ListItemText
                primary={item.product.name}
                secondary={`Quantity: ${item.quantity}`}
              />
              <Typography variant="body1">
                ${Number(item.unit_price * item.quantity).toFixed(2)}
              </Typography>
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default OrderItem;