import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { registerUser } from '../../services/authService';
import useAuth from '../../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await registerUser(formData);
      
      // If using JWT tokens
      if (data.access) {
        login(data.access);  // Pass the access token to your auth context
        navigate('/');
      } else {
        // Handle other response formats if needed
        login(data.token);
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.username?.[0] || 
                         err.response?.data?.email?.[0] ||
                         err.response?.data?.password?.[0] ||
                         err.response?.data?.detail ||
                         'Registration failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          required
          inputProps={{ minLength: 3 }}
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          required
          inputProps={{ minLength: 8 }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          fullWidth
          margin="normal"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>
      
      <Typography sx={{ mt: 2, textAlign: 'center' }}>
        Already have an account? <Link href="/login" underline="hover">Login</Link>
      </Typography>
    </Box>
  );
};

export default Register;