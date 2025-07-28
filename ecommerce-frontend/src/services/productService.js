import api from './api';

export const getProducts = async (page = 1, search = '', filters = {}) => {
  const response = await api.get('/products/', {
    params: { page, search, ...filters }
  });
  return response.data;
};

export const getProductDetail = async (id) => {
  const response = await api.get(`/products/${id}/`);
  return response.data;
};