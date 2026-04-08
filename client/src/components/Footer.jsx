import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy-2)', borderTop: '1px solid var(--border)', paddingTop: 60, marginTop: 80 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 40, paddingBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'linear-gradient(135deg,#06b6d4,#0891b2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Bebas Neue,cursive', fontSize: 18, color: '#000',
              }}>SF</div>
              <span style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 22, color: 'var(--text-main)', letterSpacing: '0.06em' }}>
                Sport <span style={{ color: '#06b6d4' }}>Faction</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>
              Premier sports academy offering world-class training in Badminton, Skating, and Pickleball. Shaping champions since 2015.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { Icon: FaInstagram, href: '#' },
                { Icon: FaYoutube,   href: '#' },
                { Icon: FaTwitter,   href: '#' },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} style={{
                  width: 36, height: 36, borderRadius: 8,
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', transition: 'all 0.2s', textDecoration: 'none',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#06b6d4'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Sports */}
          <div>
            <h4 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#06b6d4', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sports</h4>
            {[
              { to: '/sports/badminton', label: '🏸 Badminton' },
              { to: '/sports/skating',   label: '⛸️ Skating' },
              { to: '/sports/pickleball',label: '🏓 Pickleball' },
              { to: '/bookings',         label: '📅 Book a Court' },
              { to: '/events',           label: '🏆 Events & Tournaments' },
            ].map(l => (
              <Link key={l.to} to={l.to} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#06b6d4'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{l.label}</Link>
            ))}
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#06b6d4', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Academy</h4>
            {[
              { to: '/membership', label: 'Membership Plans' },
              { to: '/login',      label: 'Student Login' },
              { to: '/register',   label: 'Enroll Now' },
              { to: '/contact',    label: 'Contact Us' },
            ].map(l => (
              <Link key={l.to} to={l.to} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#06b6d4'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{l.label}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#06b6d4', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contact</h4>
            {[
              { Icon: MapPin, text: '123 Sports Complex, Sector 18, Noida, UP 201301' },
              { Icon: Phone,  text: '+91 98765 43210' },
              { Icon: Mail,   text: 'info@sportfaction.in' },
            ].map(({ Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <Icon size={16} style={{ color: '#06b6d4', marginTop: 2, flexShrink: 0 }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" style={{ margin: 0 }} />
        <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>© 2025 Sport Faction Academy. All rights reserved.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Built with ❤️ for champions</p>
        </div>
      </div>
    </footer>
  );
}
