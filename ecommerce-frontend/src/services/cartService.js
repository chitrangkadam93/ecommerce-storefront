import api from './api';

export const syncCart = async (cartItems) => {
  const response = await api.post('/cart/sync/', { items: cartItems });
  return response.data;
};

export const getCartItems = async () => {
  const response = await api.get('/cart/');
  return response.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/cart/${itemId}/`, { quantity });
  return response.data;
};

export const removeCartItem = async (itemId) => {
  const response = await api.delete(`/cart/${itemId}/`);
  return response.data;
};