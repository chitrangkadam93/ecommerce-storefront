import api from './api';

// Helper function to clear auth tokens
const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  delete api.defaults.headers.common['Authorization'];
};

// Token refresh function
export const refreshAuthToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/api/token/refresh/', {
      refresh: refreshToken
    });

    const newAccessToken = response.data.access;
    localStorage.setItem('access_token', newAccessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    
    return newAccessToken;
  } catch (error) {
    clearAuthTokens();
    throw error;
  }
};

// Add response interceptor for token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If 401 error and not a refresh request or retry attempt
    if (error.response?.status === 401 && 
        !originalRequest._retry &&
        !originalRequest.url.includes('/token/refresh/')) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshAuthToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAuthTokens();
        window.location.href = '/login'; // Redirect to login on refresh failure
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/token/', credentials);
    
    if (response.data.access && response.data.refresh) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    }
    
    return response.data;
  } catch (error) {
    clearAuthTokens();
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register/', {
      username: userData.name,
      email: userData.email,
      password: userData.password,
      password2: userData.confirmPassword
    });

    if (response.data.access && response.data.refresh) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    }

    return response.data;
  } catch (error) {
    // Handle specific registration errors
    if (error.response) {
      const errors = error.response.data;
      if (errors.username) {
        throw new Error(errors.username[0]);
      }
      if (errors.email) {
        throw new Error(errors.email[0]);
      }
      if (errors.password) {
        throw new Error(errors.password[0]);
      }
    }
    throw new Error('Registration failed. Please try again.');
  }
};

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('access_token', token);
  } else {
    clearAuthTokens();
  }
};

export const logoutUser = () => {
  clearAuthTokens();
  window.location.href = '/login'; // Redirect to login after logout
};

// Initialize auth token if exists
const storedToken = localStorage.getItem('access_token');
if (storedToken) {
  setAuthToken(storedToken);
}