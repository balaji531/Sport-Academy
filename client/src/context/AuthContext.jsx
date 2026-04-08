import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('sf_token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Validate token with backend
        const { data } = await authAPI.me();

        // Handle both response shapes
        const userData = data.user || data.data?.user || data.data || data;

        localStorage.setItem('sf_user', JSON.stringify(userData));
        setUser(userData);
      } catch (err) {
        console.error('Auth init failed:', err);
        localStorage.removeItem('sf_token');
        localStorage.removeItem('sf_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });

    console.log('LOGIN RESPONSE:', data);

    // Support multiple backend response shapes
    const token =
      data.token ||
      data.data?.token ||
      data.accessToken ||
      data.data?.accessToken;

    const userData =
      data.user ||
      data.data?.user ||
      data.data ||
      data;

    if (!token) {
      throw new Error('No token returned from login API');
    }

    localStorage.setItem('sf_token', token);
    localStorage.setItem('sf_user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);

    const token =
      data.token ||
      data.data?.token ||
      data.accessToken ||
      data.data?.accessToken;

    const userData =
      data.user ||
      data.data?.user ||
      data.data ||
      data;

    if (!token) {
      throw new Error('No token returned from register API');
    }

    localStorage.setItem('sf_token', token);
    localStorage.setItem('sf_user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const logout = () => {
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user');
    setUser(null);
  };

  const updateUser = (updated) => {
    const merged = { ...user, ...updated };
    localStorage.setItem('sf_user', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
