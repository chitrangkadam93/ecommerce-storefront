import api from './api';

export const createOrder = async (orderData) => {
  const response = await api.post('/orders/', orderData);
  return response.data;
};

export const getOrderHistory = async () => {
  const response = await api.get('/orders/');
  return response.data;
};

export const getOrderDetails = async (orderId) => {
  const response = await api.get(`/orders/${orderId}/`);
  return response.data;
};

export const createPayPalOrder = async (amount) => {
  const response = await api.post('/orders/create-paypal-order/', { amount });
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post('/orders/verify-payment/', paymentData);
  return response.data;
};