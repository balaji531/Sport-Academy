import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { notificationsAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [socket, setSocket] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await notificationsAPI.getMy();
      setNotifications(data);
      setUnread(data.filter(n => !n.read).length);
    } catch {}
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!user) return;
    const s = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    s.emit('join', user._id);
    s.on('notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnread(prev => prev + 1);
      toast(notif.message, {
        icon: notif.type === 'fee_reminder' ? '💰' : notif.type === 'booking_confirmed' ? '✅' : '🔔',
        style: { background: 'var(--card)', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.1)' },
        duration: 5000,
      });
    });
    setSocket(s);
    return () => s.disconnect();
  }, [user]);

  const markRead = async (id) => {
    await notificationsAPI.markRead(id);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    setUnread(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await notificationsAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unread, markRead, markAllRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
