import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { paymentsAPI, attendanceAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Menu, CreditCard, Calendar, Bell, TrendingUp, BookOpen, ChevronRight, User, GraduationCap, Phone, Mail, MapPin, Hash, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

function AttendanceCalendar({ records }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const getStatus = (day) => {
    const d = new Date(year, month, day).toDateString();
    const rec = records.find(r => new Date(r.date).toDateString() === d);
    return rec ? rec.status : null;
  };
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 8 }}>
        {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
        {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
        {days.map(day => {
          const st = getStatus(day);
          return (
            <div key={day} title={st || ''} style={{
              aspectRatio: '1', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 600,
              background: st === 'present' ? 'rgba(52,211,153,0.2)' : st === 'absent' ? 'rgba(239,68,68,0.15)' : st === 'late' ? 'rgba(6, 182, 212,0.15)' : 'rgba(255, 255, 255, 0.7)',
              color: st === 'present' ? '#34d399' : st === 'absent' ? '#f87171' : st === 'late' ? '#06b6d4' : 'var(--text-muted)',
              border: day === now.getDate() ? '1px solid #06b6d4' : 'none',
            }}>{day}</div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        {[['#34d399','Present'],['#f87171','Absent'],['#06b6d4','Late']].map(([c,l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: c, opacity: 0.7 }} />{l}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const { notifications, unread } = useNotifications() || { notifications: [], unread: 0 };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    Promise.all([
      paymentsAPI.getHistory(),
      attendanceAPI.getMy({ month: now.getMonth() + 1, year: now.getFullYear() }),
    ]).then(([p, a]) => {
      setPayments(p.data.slice(0, 5));
      setAttendance(a.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const safeAttendance = Array.isArray(attendance) ? attendance : [];
  const safePayments   = Array.isArray(payments) ? payments : [];

  const present = safeAttendance.filter(a => a.status === 'present').length;
  const total   = safeAttendance.length;
  const pct     = total ? Math.round((present / total) * 100) : 0;

  const feeColor = user?.feeStatus === 'paid' ? '#34d399' : user?.feeStatus === 'overdue' ? '#f87171' : '#06b6d4';

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-main" style={{ padding: '0 0 60px' }}>
        {/* Topbar */}
        <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, background: 'var(--navy-2)', position: 'sticky', top: 0, zIndex: 50 }}>
          <button
            id="dash-menu-btn"
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
          >
            <Menu size={22} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)' }}>Student Dashboard</h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date().toDateString()}</p>
          </div>
          <Link to="/dashboard/notifications" style={{ position: 'relative', color: 'var(--text-muted)', lineHeight: 0, textDecoration: 'none' }}>
            <Bell size={20} />
            {unread > 0 && <span className="notif-dot" />}
          </Link>
        </div>

        <div style={{ padding: '28px' }}>
          {/* Profile card */}
          <div style={{
            background: 'linear-gradient(135deg,var(--card) 0%,var(--card-2) 100%)',
            border: '1px solid var(--border)', borderRadius: 20, padding: 28, marginBottom: 24,
            display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: 18,
              background: 'linear-gradient(135deg,#06b6d4,#0891b2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, flexShrink: 0,
            }}>{user?.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} /> : '🎓'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>{user?.name}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>{user?.email}</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {user?.studentId && <span className="badge badge-gold">ID: {user.studentId}</span>}
                {user?.sport && <span className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{user.sport}</span>}
                <span className="badge" style={{ background: `${feeColor}15`, color: feeColor, border: `1px solid ${feeColor}40`, textTransform: 'capitalize' }}>
                  Fee: {user?.feeStatus || 'N/A'}
                </span>
              </div>
            </div>
            <Link to="/dashboard/student/profile" className="btn-outline" style={{ padding: '8px 18px', fontSize: '0.82rem' }}>Edit Profile</Link>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Attendance', value: `${pct}%`, icon: Calendar, color: '#34d399', sub: `${present}/${total} sessions` },
              { label: 'Total Paid', value: `₹${safePayments.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0).toLocaleString()}`, icon: CreditCard, color: '#06b6d4', sub: 'All time' },
              { label: 'Notifications', value: unread, icon: Bell, color: '#60a5fa', sub: 'Unread' },
              { label: 'Bookings', value: '—', icon: BookOpen, color: '#a78bfa', sub: 'This month' },
            ].map(({ label, value, icon: Icon, color, sub }) => (
              <div key={label} className="stat-card" style={{ '--glow-color': `${color}15` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                </div>
                <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 32, color, letterSpacing: '0.04em', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Academic & Personal Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24, marginBottom: 24 }}>
            
            {/* Academic Details */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(6, 182, 212,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={18} style={{ color: '#06b6d4' }} />
                </div>
                <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Academic Details</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: Hash, label: 'Student ID', value: user?.studentId || 'Not assigned' },
                  { icon: Layers, label: 'Sport', value: user?.sport ? user.sport.charAt(0).toUpperCase() + user.sport.slice(1) : '—', capitalize: true },
                  { icon: BookOpen, label: 'Batch', value: user?.batch || 'Not assigned' },
                  { icon: User, label: 'Coach', value: user?.coachName || 'Not assigned' },
                  { icon: Calendar, label: 'Admission Date', value: user?.admissionDate ? new Date(user.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
                  { icon: CreditCard, label: 'Fee Status', value: user?.feeStatus || 'N/A', feeColor: true },
                ].map(({ icon: Icon, label, value, feeColor: isFee }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: isFee ? feeColor : 'var(--text-main)', textTransform: isFee ? 'capitalize' : 'none', marginTop: 1 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Details */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(96,165,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} style={{ color: '#60a5fa' }} />
                </div>
                <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Personal Details</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: User, label: 'Full Name', value: user?.name || '—' },
                  { icon: Mail, label: 'Email Address', value: user?.email || '—' },
                  { icon: Phone, label: 'Phone Number', value: user?.phone || 'Not provided' },
                  { icon: TrendingUp, label: 'Account Role', value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—' },
                  { icon: Calendar, label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
                  { icon: Bell, label: 'Account Status', value: user?.isActive ? 'Active' : 'Inactive', active: user?.isActive },
                ].map(({ icon: Icon, label, value, active }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: active === true ? '#34d399' : active === false ? '#f87171' : 'var(--text-main)', marginTop: 1 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Fee reminder banner */}
          {user?.feeStatus !== 'paid' && (
            <div style={{
              background: user?.feeStatus === 'overdue' ? 'rgba(239,68,68,0.1)' : 'rgba(6, 182, 212,0.08)',
              border: `1px solid ${user?.feeStatus === 'overdue' ? 'rgba(239,68,68,0.3)' : 'rgba(6, 182, 212,0.3)'}`,
              borderRadius: 14, padding: '16px 20px', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <span style={{ fontSize: 24 }}>{user?.feeStatus === 'overdue' ? '⚠️' : '📅'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: user?.feeStatus === 'overdue' ? '#f87171' : '#06b6d4' }}>
                  {user?.feeStatus === 'overdue' ? 'Fee Overdue!' : 'Fee Due'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {user?.nextFeeDate ? `Due by ${new Date(user.nextFeeDate).toDateString()}` : 'Please contact the academy to clear your dues.'}
                </div>
              </div>
              <Link to="/bookings" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>Pay Now</Link>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
            {/* Attendance Calendar */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>📅 Attendance — {new Date().toLocaleString('default',{month:'long'})}</h3>
                <div className="progress-bar" style={{ width: 60 }}>
                  <div className="progress-fill" style={{ width: `${pct}%`, background: pct > 75 ? '#34d399' : pct > 50 ? '#06b6d4' : '#f87171' }} />
                </div>
              </div>
              {loading ? <div className="shimmer" style={{ height: 180 }} /> : <AttendanceCalendar records={safeAttendance} />}
            </div>

            {/* Payment History */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>💳 Payment History</h3>
                <Link to="/dashboard/student/fees" style={{ color: '#06b6d4', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
              </div>
              {loading ? <div className="shimmer" style={{ height: 180 }} /> : safePayments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontSize: '0.88rem' }}>No payment records yet.</div>
              ) : safePayments.map(p => (
                <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', textTransform: 'capitalize' }}>{p.type}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: p.status === 'paid' ? '#34d399' : '#f87171' }}>₹{p.amount.toLocaleString()}</div>
                    <span className="badge" style={{ fontSize: '0.68rem', padding: '2px 8px', background: p.status === 'paid' ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)', color: p.status === 'paid' ? '#34d399' : '#f87171', border: 'none' }}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Notifications */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>🔔 Notifications</h3>
                <Link to="/dashboard/notifications" style={{ color: '#06b6d4', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
              </div>
              {notifications.slice(0, 5).map(n => (
                <div key={n._id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', opacity: n.read ? 0.6 : 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: n.read ? 400 : 600, color: 'var(--text-main)', marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{n.message}</div>
                </div>
              ))}
              {notifications.length === 0 && <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: '0.88rem' }}>No notifications yet.</div>}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { label: '📅 Book a Court', to: '/bookings' },
                { label: '🏆 View Events', to: '/events' },
                { label: '🏅 Membership Plans', to: '/membership' },
                { label: '📞 Contact Academy', to: '/contact' },
              ].map(a => (
                <Link key={a.to} to={a.to} className="btn-outline" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>{a.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        #dash-menu-btn { display: none; }
        @media(max-width:768px){
          #dash-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
