import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Menu, X, Bell, ChevronDown, LogOut, User, LayoutDashboard, Dumbbell } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unread } = useNotifications() || { unread: 0 };
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const sportLinks = [
    { to: '/sports/badminton', label: 'Badminton', icon: '🏸' },
    { to: '/sports/skating', label: 'Skating', icon: '⛸️' },
    { to: '/sports/pickleball', label: 'Pickleball', icon: '🏓' },
  ];

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    { to: '/membership', label: 'Membership' },
    { to: '/bookings', label: 'Book Now' },
    { to: '/contact', label: 'Contact' },
  ];

  const hideNav = isHome && !scrolled;

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.3s ease',
        transform: hideNav ? 'translateY(-100%)' : 'translateY(0)',
        opacity: hideNav ? 0 : 1,
        pointerEvents: hideNav ? 'none' : 'auto',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 70, gap: 32 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg,#06b6d4,#0891b2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Bebas Neue, cursive', fontSize: 18, color: '#000', fontWeight: 700,
          }}>SF</div>
          <span style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 22, letterSpacing: '0.06em', color: 'var(--text-main)' }}>
            Sport <span style={{ color: '#06b6d4' }}>Faction</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }} className="desktop-nav">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className="nav-link" style={{ padding: '8px 12px' }}>
              {l.label}
            </NavLink>
          ))}

          {/* Sports dropdown */}
          <div style={{ position: 'relative' }} onMouseEnter={() => setDropOpen(true)} onMouseLeave={() => setDropOpen(false)}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer' }} className="nav-link">
              Sports <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
            </button>
            {dropOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0,
                background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)', borderRadius: 12,
                padding: 8, minWidth: 180, zIndex: 300,
              }}>
                {sportLinks.map(s => (
                  <Link key={s.to} to={s.to} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                    borderRadius: 8, textDecoration: 'none', color: 'var(--text-muted)', fontSize: 14,
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(6, 182, 212,0.08)'; e.currentTarget.style.color = '#06b6d4'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-muted)'; }}
                  >
                    <span style={{ fontSize: 18 }}>{s.icon}</span> {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 'none' }}>
          {user ? (
            <>
              <Link to="/dashboard/notifications" style={{ position: 'relative', color: 'var(--text-muted)', lineHeight: 0 }}>
                <Bell size={20} />
                {unread > 0 && <span className="notif-dot" style={{ width: 8, height: 8 }}></span>}
              </Link>
              <Link to={`/dashboard/${user.role}`} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <button onClick={handleLogout} title="Logout" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 0 }}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Register</Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', lineHeight: 0, display: 'none' }} id="mobile-menu-btn">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: 'rgba(255,255,255,0.98)', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '16px 24px' }}>
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '12px 0', color: 'var(--text-muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
              {l.label}
            </NavLink>
          ))}
          {sportLinks.map(s => (
            <Link key={s.to} to={s.to} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '12px 0', color: 'var(--text-muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
              {s.icon} {s.label}
            </Link>
          ))}
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            {user
              ? <button onClick={handleLogout} className="btn-outline" style={{ width: '100%' }}>Logout</button>
              : <><Link to="/login" className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Register</Link></>
            }
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .desktop-nav{display:none!important;}
          #mobile-menu-btn{display:flex!important;}
        }
      `}</style>
    </nav>
  );
}
