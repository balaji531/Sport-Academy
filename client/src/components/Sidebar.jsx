import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  LayoutDashboard, User, CreditCard, Calendar, Bell, LogOut,
  BookOpen, Trophy, Users, BarChart2, Settings, X,
  GraduationCap, Dumbbell, Layers, DollarSign, ClipboardList,
  Package, TrendingUp, UserCheck,
} from 'lucide-react';


const studentLinks = [
  { to: '/dashboard/student',               icon: LayoutDashboard, label: 'Overview' },
  { to: '/dashboard/student/profile',       icon: User,            label: 'My Profile' },
  { to: '/dashboard/student/fees',          icon: CreditCard,      label: 'Fees & Payments' },
  { to: '/dashboard/student/attendance',    icon: Calendar,        label: 'Attendance' },
  { to: '/dashboard/notifications',         icon: Bell,            label: 'Notifications' },
  { to: '/bookings',                        icon: BookOpen,        label: 'Book Now' },
  { to: '/events',                          icon: Trophy,          label: 'Events' },
];

const memberLinks = [
  { to: '/dashboard/member',               icon: LayoutDashboard, label: 'Overview' },
  { to: '/dashboard/member/profile',       icon: User,            label: 'My Profile' },
  { to: '/dashboard/member/membership',    icon: CreditCard,      label: 'Membership' },
  { to: '/dashboard/member/payments',      icon: BarChart2,       label: 'Payments' },
  { to: '/dashboard/notifications',        icon: Bell,            label: 'Notifications' },
  { to: '/bookings',                       icon: BookOpen,        label: 'Book Court' },
];

const adminLinks = [
  { header: 'Overview' },
  { to: '/',               icon: LayoutDashboard, label: 'Dashboard' },
  { header: 'People' },
  { to: '/students',       icon: GraduationCap,   label: 'Students' },
  { to: '/coaches',        icon: UserCheck,        label: 'Coaches' },
  { header: 'Academy' },
  { to: '/sports',         icon: Dumbbell,         label: 'Sports / Programs' },
  { to: '/batches',        icon: Layers,            label: 'Batches' },
  { header: 'Operations' },
  { to: '/bookings',       icon: BookOpen,          label: 'Bookings' },
  { to: '/events',         icon: Trophy,            label: 'Events' },
  { header: 'Finance' },
  { to: '/fees',           icon: DollarSign,        label: 'Fees & Billing' },
  { header: 'Tracking' },
  { to: '/attendance',     icon: Calendar,          label: 'Attendance' },
  { to: '/performance',    icon: TrendingUp,         label: 'Performance' },
  { header: 'Resources' },
  { to: '/inventory',      icon: Package,            label: 'Inventory' },
  { header: 'Admin' },
  { to: '/reports',        icon: ClipboardList,      label: 'Reports' },
  { to: '/notifications',  icon: Bell,               label: 'Notifications' },
  { to: '/settings',       icon: Settings,           label: 'Settings' },
];


export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { unread } = useNotifications() || { unread: 0 };
  const navigate = useNavigate();

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'member' ? memberLinks : studentLinks;
  const roleColor = user?.role === 'admin' ? '#f87171' : user?.role === 'member' ? '#60a5fa' : '#06b6d4';

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Overlay for mobile */}
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99, display: 'none' }} id="sidebar-overlay" />}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg,#06b6d4,#0891b2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Bebas Neue,cursive', fontSize: 18, color: '#000', flexShrink: 0,
          }}>SF</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 16, letterSpacing: '0.06em', color: 'var(--text-main)' }}>Sport Faction</div>
            <span className="badge" style={{ background: `rgba(${roleColor === '#f87171' ? '239,68,68' : roleColor === '#60a5fa' ? '96,165,250' : '245,166,35'},0.12)`, color: roleColor, border: `1px solid ${roleColor}40`, fontSize: '0.65rem', padding: '2px 8px' }}>
              {user?.role?.toUpperCase()}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'none' }} id="sidebar-close">
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg,var(--card-2),var(--card))',
              border: '2px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>
              {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} /> : '👤'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              {user?.studentId && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {user.studentId}</div>}
              {user?.sport && <div style={{ fontSize: '0.75rem', color: roleColor, textTransform: 'capitalize' }}>{user.sport}</div>}
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
          {links.map((link, idx) => {
            if (link.header) {
              return <div key={`hdr-${idx}`} style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '16px 12px 4px' }}>{link.header}</div>;
            }
            const { to, icon: Icon, label } = link;
            return (
              <NavLink
                key={to}
                to={to}
                end={to.split('/').length <= 3}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 10, marginBottom: 2,
                  textDecoration: 'none',
                  background: isActive ? `rgba(${roleColor === '#f87171' ? '239,68,68' : roleColor === '#60a5fa' ? '96,165,250' : '245,166,35'},0.12)` : 'transparent',
                  color: isActive ? roleColor : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.9rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderLeft: isActive ? `3px solid ${roleColor}` : '3px solid transparent',
                })}
                onMouseEnter={e => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'rgba(0,0,0,0.03)')}
                onMouseLeave={e => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'transparent')}
              >
                <Icon size={16} />
                <span style={{ flex: 1 }}>{label}</span>
                {label === 'Notifications' && unread > 0 && (
                  <span style={{
                    background: '#06b6d4', color: '#000', borderRadius: 10,
                    padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700,
                  }}>{unread}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
            padding: '10px 12px', borderRadius: 10, background: 'none', border: 'none',
            cursor: 'pointer', color: '#f87171', fontSize: '0.9rem', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <style>{`
        @media(max-width:768px){
          #sidebar-overlay{display:block!important;}
          #sidebar-close{display:flex!important;}
        }
      `}</style>
    </>
  );
}
