import client from './client';

export function fetchOrders(params = {}) {
  return client.get('/orders', { params });
}

export function fetchOrder(id) {
  return client.get(`/orders/${id}`);
}

export function createOrder(items) {
  return client.post('/orders', { items });
}

export function updateOrderStatus(id, status) {
  return client.patch(`/orders/${id}/status`, { status });
}
