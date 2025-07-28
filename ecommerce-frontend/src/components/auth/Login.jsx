import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Link, Alert } from '@mui/material';
import { loginUser } from '../../services/authService';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  
  useEffect(() => {
    const handleError = (e) => {
      e.preventDefault();
      console.error('Global error caught:', e.error);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submit triggered'); 
    
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting login...'); 
      const response = await loginUser({ username, password });
      console.log('Login response:', response); 
      
      if (response.access) {
        login(response.access, response.refresh);
        navigate('/');
      } else if (response.token) {
        login(response.token);
        navigate('/');
      } else {
        throw new Error('Invalid server response');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials and try again.');
      setLoading(false);
      return; 
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          error={!!error}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          error={!!error}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <Typography sx={{ mt: 2, textAlign: 'center' }}>
        Don't have an account? <Link href="/register" underline="hover">Register</Link>
      </Typography>
    </Box>
  );
};

export default Login;