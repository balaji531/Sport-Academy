import { useState, useEffect } from 'react';
import { adminAPI, feesAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Menu, Users, BookOpen, CreditCard, Trophy, GraduationCap, Dumbbell, Layers, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function StatCard({ label, value, icon: Icon, color, subtitle }) {
  return (
    <div className="stat-card glass-card" style={{ '--glow-color': `${color}15`, borderBottom: `3px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</span>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={15} style={{ color }} /></div>
      </div>
      <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 36, color, letterSpacing: '0.04em', lineHeight: 1 }}>{value}</div>
      {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>{subtitle}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({});
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentFees, setRecentFees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    adminAPI.getStats().then(r => setStats(r.data)).catch(() => {});
    adminAPI.getUsers({ role: 'student', limit: 5 }).then(r => setRecentStudents(r.data.users)).catch(() => {});
    feesAPI.getAll({ limit: 5 }).then(r => setRecentFees(r.data.fees)).catch(() => {});
  }, []);

  const actionCards = [
    { label: 'Students', desc: 'Manage players & members', icon: <GraduationCap size={28}/>, color: '#06b6d4', to: '/students' },
    { label: 'Sports & Programs', desc: 'Configure sports structures', icon: <Dumbbell size={28}/>, color: '#60a5fa', to: '/sports' },
    { label: 'Batches', desc: 'View training sessions', icon: <Layers size={28}/>, color: '#34d399', to: '/batches' },
    { label: 'Fees & Billing', desc: 'Collect and track payments', icon: <CreditCard size={28}/>, color: '#facc15', to: '/fees' },
    { label: 'Performance', desc: 'Log player evaluations', icon: <TrendingUp size={28}/>, color: '#a78bfa', to: '/performance' },
    { label: 'Events & Tournaments', desc: 'Manage upcoming events', icon: <Trophy size={28}/>, color: '#f87171', to: '/events' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-main" style={{ padding: '0 0 60px' }}>
        {/* Topbar */}
        <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, background: 'var(--navy-2)', position: 'sticky', top: 0, zIndex: 50 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'none' }} id="dash-menu-btn"><Menu size={22} /></button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)' }}>Academy Overview</h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date().toDateString()}</p>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          
          <div className="fade-in-up">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 16 }}>Key Metrics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 36 }}>
              <StatCard label="Students" value={stats.totalStudents || 0} icon={Users} color="#06b6d4" subtitle="Active enrollments" />
              <StatCard label="Members" value={stats.totalMembers || 0} icon={Users} color="#60a5fa" subtitle="General memberships" />
              <StatCard label="Bookings" value={stats.totalBookings || 0} icon={BookOpen} color="#34d399" subtitle={`${stats.activeBookings || 0} active today`} />
              <StatCard label="Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} icon={CreditCard} color="#facc15" subtitle="Total collected" />
              <StatCard label="Events" value={stats.totalEvents || 0} icon={Trophy} color="#f87171" subtitle="Scheduled events" />
            </div>

            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 16 }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, marginBottom: 36 }}>
              {actionCards.map(({ label, desc, icon, color, to }) => (
                <div key={label} onClick={() => navigate(to)} className="card glass-card smooth-transition" style={{ cursor: 'pointer', borderLeft: `4px solid ${color}`, padding: 20 }}>
                  <div style={{ color, marginBottom: 10 }}>{icon}</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{desc}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Recent Students Panel */}
              <div className="glass-card" style={{ padding: 24, borderRadius: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>Recent Enrollments</h2>
                  <button onClick={() => navigate('/students')} style={{ background:'none', border:'none', color:'#06b6d4', fontSize:'0.82rem', cursor:'pointer', fontWeight:600 }}>View All</button>
                </div>
                <div className="table-wrap" style={{ margin: 0 }}>
                  <table style={{ margin: 0 }}>
                    <thead><tr><th>Name</th><th>Sport</th><th>Joined</th></tr></thead>
                    <tbody>
                      {recentStudents.length === 0 ? (
                        <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No recent enrollments</td></tr>
                      ) : recentStudents.map(s => (
                        <tr key={s._id}>
                          <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{s.name}</td>
                          <td><span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>{s.sport || 'none'}</span></td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Fees Panel */}
              <div className="glass-card" style={{ padding: 24, borderRadius: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>Recent Transactions</h2>
                  <button onClick={() => navigate('/fees')} style={{ background:'none', border:'none', color:'#06b6d4', fontSize:'0.82rem', cursor:'pointer', fontWeight:600 }}>View All</button>
                </div>
                <div className="table-wrap" style={{ margin: 0 }}>
                  <table style={{ margin: 0 }}>
                    <thead><tr><th>Student</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                      {recentFees.length === 0 ? (
                        <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No recent fees</td></tr>
                      ) : recentFees.map(f => (
                        <tr key={f._id}>
                          <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{f.studentName || '—'}</td>
                          <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>₹{f.totalAmount}</td>
                          <td><span className={`badge ${f.status === 'paid' ? 'badge-green' : f.status === 'overdue' ? 'badge-red' : 'badge-gold'}`}>{f.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <style>{`@media(max-width:768px){#dash-menu-btn{display:flex!important;}}`}</style>
    </div>
  );
}
