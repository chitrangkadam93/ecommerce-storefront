import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const ShippingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'United States'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      
      <TextField
        label="Full Name"
        name="name"
        fullWidth
        margin="normal"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <TextField
        label="Street Address"
        name="street"
        fullWidth
        margin="normal"
        value={formData.street}
        onChange={handleChange}
        required
      />
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="City"
          name="city"
          fullWidth
          margin="normal"
          value={formData.city}
          onChange={handleChange}
          required
        />
        
        <TextField
          label="State/Province"
          name="state"
          fullWidth
          margin="normal"
          value={formData.state}
          onChange={handleChange}
          required
        />
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="ZIP/Postal Code"
          name="zip_code"
          fullWidth
          margin="normal"
          value={formData.zip_code}
          onChange={handleChange}
          required
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Country</InputLabel>
          <Select
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <MenuItem value="United States">United States</MenuItem>
            <MenuItem value="Canada">Canada</MenuItem>
            <MenuItem value="United Kingdom">United Kingdom</MenuItem>
            {/* Add more countries as needed */}
          </Select>
        </FormControl>
      </Box>
      
      <Button
        type="submit"
        variant="contained"
        size="large"
        sx={{ mt: 3 }}
      >
        Continue to Payment
      </Button>
    </Box>
  );
};

export default ShippingForm;