import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import { Menu, Bell, Check, CheckCheck } from 'lucide-react';

const TYPE_ICONS = {
  fee_reminder: '💰',
  booking_confirmed: '✅',
  booking_cancelled: '❌',
  event_update: '🏆',
  membership: '🏅',
  general: '🔔',
};

const TYPE_COLORS = {
  fee_reminder: '#f87171',
  booking_confirmed: '#34d399',
  booking_cancelled: '#f87171',
  event_update: '#a78bfa',
  membership: '#60a5fa',
  general: '#06b6d4',
};

export default function Notifications() {
  const { notifications, unread, markRead, markAllRead } = useNotifications() || { notifications: [], unread: 0, markRead: () => {}, markAllRead: () => {} };
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-main" style={{ padding: '0 0 60px' }}>
        {/* Topbar */}
        <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, background: 'var(--navy-2)', position: 'sticky', top: 0, zIndex: 50 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'none' }} id="dash-menu-btn">
            <Menu size={22} />
          </button>
          <Bell size={20} style={{ color: '#06b6d4' }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)' }}>
              Notifications {unread > 0 && <span style={{ background: '#06b6d4', color: '#000', borderRadius: 10, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 800, marginLeft: 8 }}>{unread}</span>}
            </h1>
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.82rem', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#06b6d4'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        <div style={{ padding: 28 }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🔔</div>
              <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: 8 }}>All caught up!</h3>
              <p style={{ color: 'var(--text-muted)' }}>No notifications yet. We'll alert you about fees, bookings, and events.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 720 }}>
              {notifications.map((n) => {
                const color = TYPE_COLORS[n.type] || '#06b6d4';
                return (
                  <div key={n._id}
                    onClick={() => !n.read && markRead(n._id)}
                    style={{
                      display: 'flex', gap: 16, padding: '16px 20px',
                      background: n.read ? 'var(--card)' : `linear-gradient(135deg,${color}08,var(--card))`,
                      border: `1px solid ${n.read ? 'var(--border)' : color + '25'}`,
                      borderRadius: 14, cursor: n.read ? 'default' : 'pointer',
                      transition: 'all 0.25s', opacity: n.read ? 0.7 : 1,
                    }}
                    onMouseEnter={e => !n.read && (e.currentTarget.style.borderColor = color + '50')}
                    onMouseLeave={e => !n.read && (e.currentTarget.style.borderColor = color + '25')}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      {TYPE_ICONS[n.type] || '🔔'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontWeight: n.read ? 500 : 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>{n.title}</div>
                        {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 4, animation: 'pulse 2s infinite' }} />}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.message}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
                        {new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                    {n.read && <Check size={14} style={{ color: '#34d399', flexShrink: 0, marginTop: 4 }} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <style>{`@media(max-width:768px){#dash-menu-btn{display:flex!important;}}`}</style>
    </div>
  );
}
