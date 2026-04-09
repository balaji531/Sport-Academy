import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ArrowRight, Loader, GraduationCap, Medal } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [role, setRole] = useState('student');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: 'student', label: 'Student / Parent', Icon: GraduationCap },
    { id: 'member',  label: 'Member',            Icon: Medal },
  ];

  const onSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const loggedInUser = await login(form.email, form.password);

    const rawRole = String(loggedInUser.role || '').trim().toLowerCase();

    // normalize possible backend role values
    const roleMap = {
      'student': 'student',
      'student / parent': 'student',
      'parent': 'student',
      'member': 'member',
      'admin': 'admin',
    };

    const normalizedRole = roleMap[rawRole] || rawRole;

    console.log('Login success:', loggedInUser);
    console.log('Raw role:', rawRole);
    console.log('Normalized role:', normalizedRole);
    console.log('Expected login role:', role);

    // prevent wrong portal login
    if (normalizedRole !== role) {
      toast.error(`This account is a ${normalizedRole || 'unknown'} account, not ${role}`);
      return;
    }

    toast.success(`Welcome back, ${loggedInUser.name}! 🎉`);

    if (normalizedRole === 'student') {
      navigate('/dashboard/student', { replace: true });
    } else if (normalizedRole === 'member') {
      navigate('/dashboard/member', { replace: true });
    } else if (normalizedRole === 'admin') {
      window.location.href = '/admin/';
    } else {
      toast.error(`Unsupported role: ${loggedInUser.role}`);
    }
  } catch (err) {
    console.error('Login failed:', err.response?.data || err);
    toast.error(err.response?.data?.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

      {/* LEFT PANEL */}
      <div style={{
        flex: '0 0 45%',
        background: 'linear-gradient(160deg, #cffafe 0%, #a5f3fc 40%, #22d3ee 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 52px', position: 'relative', overflow: 'hidden',
      }} className="login-left">
        <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', top: -120, left: -120, background: 'radial-gradient(circle, rgba(6, 182, 212,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', bottom: -60, right: -80, background: 'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12, zIndex: 1 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#06b6d4,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue, cursive', fontSize: 22, color: '#fff', fontWeight: 900, boxShadow: '0 4px 20px rgba(6, 182, 212,0.35)' }}>SF</div>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 24, letterSpacing: '0.06em', color: '#0f172a', lineHeight: 1 }}>Sport <span style={{ color: '#0891b2' }}>Faction</span></div>
            <div style={{ fontSize: 11, color: '#334155', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>Sports Academy Portal</div>
          </div>
        </Link>

        <div style={{ zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: 'rgba(8, 145, 178, 0.12)', border: '1px solid rgba(8, 145, 178, 0.25)', borderRadius: 100, padding: '5px 16px', fontSize: 12, color: '#0891b2', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 24 }}>Member Portal</div>
          <h1 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 52, lineHeight: 1.05, letterSpacing: '0.03em', color: '#0f172a', marginBottom: 20 }}>
            Your Gateway<br />to <span style={{ color: '#0891b2' }}>Elite</span><br />Sports Training
          </h1>
          <p style={{ color: '#334155', fontSize: 15, lineHeight: 1.7, maxWidth: 320 }}>Access your training schedule, track progress, manage bookings, and stay updated with events — all in one place.</p>
          <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
            {[['1200+', 'Students'], ['48', 'Coaches'], ['9+', 'Years']].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 28, color: '#0e7490', letterSpacing: '0.04em' }}>{val}</div>
                <div style={{ fontSize: 12, color: '#1e293b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: '#0f172a', zIndex: 1 }}>© 2026 Sport Faction Academy · All rights reserved</div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1a202c', marginBottom: 6 }}>Sign in to your account</h2>
            <p style={{ color: '#718096', fontSize: 14 }}>Enter your credentials to continue</p>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 28, background: '#e2e8f0', borderRadius: 10, padding: 5 }}>
            {roles.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setRole(id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', background: role === id ? '#fff' : 'transparent', color: role === id ? '#1a202c' : '#718096', fontWeight: role === id ? 600 : 400, fontSize: 13, boxShadow: role === id ? '0 1px 4px rgba(0,0,0,0.12)' : 'none', transition: 'all 0.2s' }}>
                <Icon size={15} style={{ color: role === id ? '#06b6d4' : 'inherit' }} />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2d3748', marginBottom: 6 }}>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="light-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2d3748', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={show ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className="light-input" style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0', lineHeight: 0 }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#06b6d4,#0891b2)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4, boxShadow: '0 4px 14px rgba(6, 182, 212,0.35)', opacity: loading ? 0.75 : 1, transition: 'all 0.2s' }}>
              {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 12, color: '#a0aec0', fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#718096' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#06b6d4', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
          </p>

          <div style={{ marginTop: 24, padding: '12px 16px', background: '#edf2f7', borderRadius: 8, borderLeft: '3px solid #06b6d4' }}>
            <p style={{ fontSize: 12, color: '#718096', margin: 0 }}>
              <strong style={{ color: '#4a5568' }}>Admin?</strong> Use the dedicated <a href="/admin/" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: 600 }}>Admin Portal</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .light-input { width: 100%; padding: 11px 14px; border: 1.5px solid #cbd5e0; border-radius: 8px; font-size: 14px; color: #1a202c; background: #fff; outline: none; box-sizing: border-box; transition: border-color 0.2s; font-family: 'Inter', sans-serif; }
        .light-input:focus { border-color: #06b6d4; }
        .light-input::placeholder { color: #a0aec0; }
        select.light-input { appearance: auto; }
        @media (max-width: 768px) { .login-left { display: none !important; } }
      `}</style>
    </div>
  );
}
