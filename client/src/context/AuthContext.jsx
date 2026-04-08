import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('sf_user');
    const token = localStorage.getItem('sf_token');

    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('sf_user');
        localStorage.removeItem('sf_token');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });

    // Handle both possible backend response formats
    const token = data.token;
    const userData = data.user || data;

    localStorage.setItem('sf_token', token);
    localStorage.setItem('sf_user', JSON.stringify(userData));

    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);

    const token = data.token;
    const userData = data.user || data;

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
