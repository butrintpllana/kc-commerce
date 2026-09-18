import client from './client';

export function fetchProducts(params = {}) {
  return client.get('/products', { params });
}

export function fetchProduct(id) {
  return client.get(`/products/${id}`);
}

export function createProduct(data) {
  return client.post('/products', data);
}

export function updateProduct(id, data) {
  return client.put(`/products/${id}`, data);
}

export function deleteProduct(id) {
  return client.delete(`/products/${id}`);
}
