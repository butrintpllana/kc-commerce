import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCurrentUser, loginRequest, logoutRequest, registerRequest } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      setLoading(false);
      return;
    }

    fetchCurrentUser()
      .then((response) => {
        setUser(response.data);
        setToken(storedToken);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const response = await loginRequest({ email, password });

    localStorage.setItem('token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);

    return response.data.user;
  }

  async function register(name, email, password, password_confirmation) {
    const response = await registerRequest({ name, email, password, password_confirmation });

    localStorage.setItem('token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);

    return response.data.user;
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  }

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAdmin, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
