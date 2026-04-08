import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { membershipsAPI, paymentsAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Menu, CreditCard, Calendar, Shield, Bell, ChevronRight } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export default function MemberDashboard() {
  const { user } = useAuth();
  const { unread } = useNotifications() || { unread: 0 };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [membership, setMembership] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([membershipsAPI.getMy(), paymentsAPI.getHistory()])
      .then(([m, p]) => { setMembership(m.data); setPayments(p.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const daysLeft = membership
    ? Math.max(0, Math.ceil((new Date(membership.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;
  const totalDays = membership
    ? Math.ceil((new Date(membership.expiryDate) - new Date(membership.startDate)) / (1000 * 60 * 60 * 24))
    : 1;
  const validityPct = membership ? Math.round((daysLeft / totalDays) * 100) : 0;

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-main" style={{ padding: '0 0 60px' }}>
        {/* Topbar */}
        <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, background: 'var(--navy-2)', position: 'sticky', top: 0, zIndex: 50 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'none' }} id="dash-menu-btn"><Menu size={22} /></button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)' }}>Member Dashboard</h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date().toDateString()}</p>
          </div>
          <Link to="/dashboard/notifications" style={{ position: 'relative', color: 'var(--text-muted)', lineHeight: 0, textDecoration: 'none' }}>
            <Bell size={20} />
            {unread > 0 && <span className="notif-dot" />}
          </Link>
        </div>

        <div style={{ padding: 28 }}>
          {/* Profile + Membership Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 24 }}>
            {/* Profile */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg,#60a5fa,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🏅</div>
                <div>
                  <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                  <span className="badge badge-blue" style={{ marginTop: 4 }}>Member</span>
                </div>
              </div>
              {[
                { label: 'Phone', val: user?.phone || '—' },
                { label: 'Sport', val: user?.sport || '—' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600, textTransform: 'capitalize' }}>{r.val}</span>
                </div>
              ))}
              <Link to="/dashboard/member/profile" className="btn-outline" style={{ marginTop: 16, width: '100%', justifyContent: 'center', padding: '10px' }}>Edit Profile</Link>
            </div>

            {/* Membership Status */}
            <div style={{
              background: membership ? 'linear-gradient(135deg,var(--navy-2) 0%,rgba(96,165,250,0.06) 100%)' : 'var(--card)',
              border: `1px solid ${membership ? 'rgba(96,165,250,0.3)' : 'var(--border)'}`, borderRadius: 20, padding: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Shield size={22} style={{ color: '#60a5fa' }} />
                <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Membership Status</h3>
              </div>

              {loading ? <div className="shimmer" style={{ height: 120 }} /> : membership ? (
                <>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Plan</div>
                      <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 28, color: '#60a5fa', letterSpacing: '0.04em', textTransform: 'capitalize' }}>{membership.plan}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Days Left</div>
                      <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 28, color: daysLeft < 7 ? '#f87171' : '#34d399', letterSpacing: '0.04em' }}>{daysLeft}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                      <span>Validity</span><span>{validityPct}% remaining</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${validityPct}%`, background: validityPct > 30 ? 'linear-gradient(90deg,#60a5fa,#3b82f6)' : 'linear-gradient(90deg,#f87171,#ef4444)' }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Expires: <span style={{ color: 'var(--text-main)' }}>{new Date(membership.expiryDate).toDateString()}</span>
                  </div>

                  {daysLeft < 7 && (
                    <Link to="/membership" className="btn-primary" style={{ marginTop: 16, width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.85rem' }}>
                      Renew Membership
                    </Link>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 16 }}>No active membership</div>
                  <Link to="/membership" className="btn-primary" style={{ display: 'inline-flex', padding: '10px 20px', fontSize: '0.85rem' }}>Get Membership</Link>
                </div>
              )}
            </div>
          </div>

          {/* Payment History */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>💳 Payment History</h3>
            </div>
            {loading ? <div className="shimmer" style={{ height: 140 }} /> : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Type</th><th>Amount</th><th>Status</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(payments) ? payments : []).length === 0 ? (
                      <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No payments yet</td></tr>
                    ) : (Array.isArray(payments) ? payments : []).map(p => (
                      <tr key={p._id}>
                        <td style={{ textTransform: 'capitalize' }}>{p.type}</td>
                        <td style={{ fontWeight: 700, color: '#34d399' }}>₹{p.amount.toLocaleString()}</td>
                        <td><span className={`badge ${p.status === 'paid' ? 'badge-green' : 'badge-red'}`}>{p.status}</span></td>
                        <td style={{ color: 'var(--text-muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Benefits */}
          {membership?.benefits?.length > 0 && (
            <div className="card">
              <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: 16 }}>✅ Your Plan Benefits</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {membership.benefits.map((b, i) => (
                  <span key={i} className="badge badge-blue" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>✓ {b}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <style>{`@media(max-width:768px){#dash-menu-btn{display:flex!important;}}`}</style>
    </div>
  );
}
