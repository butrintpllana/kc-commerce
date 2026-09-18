import client from './client';

export function registerRequest({ name, email, password, password_confirmation }) {
  return client.post('/register', { name, email, password, password_confirmation });
}

export function loginRequest({ email, password }) {
  return client.post('/login', { email, password });
}

export function logoutRequest() {
  return client.post('/logout');
}

export function fetchCurrentUser() {
  return client.get('/user');
}
