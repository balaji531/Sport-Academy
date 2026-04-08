import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ArrowRight, Loader, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', sport: 'badminton' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const sports = ['badminton', 'skating', 'pickleball'];

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register({ ...form, role: 'student', sport: form.sport.toLowerCase() });
      toast.success(`Account created! Let's set up your plan, ${user.name}! 🎉`);
      navigate('/register/payment');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Access to all sport facilities & courts',
    'Professional coaching & training sessions',
    'Track attendance & performance online',
    'Exclusive event & tournament registration',
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

      {/* LEFT PANEL */}
      <div style={{
        flex: '0 0 42%',
        background: 'linear-gradient(160deg, #0a0e1a 0%, #0d1526 40%, #111d35 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 52px', position: 'relative', overflow: 'hidden',
      }} className="register-left">
        <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', top: -120, left: -120, background: 'radial-gradient(circle, rgba(6, 182, 212,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', bottom: -60, right: -80, background: 'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12, zIndex: 1 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#06b6d4,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue, cursive', fontSize: 22, color: '#000', fontWeight: 900, boxShadow: '0 4px 20px rgba(6, 182, 212,0.35)' }}>SF</div>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 24, letterSpacing: '0.06em', color: '#e8f0ff', lineHeight: 1 }}>Sport <span style={{ color: '#06b6d4' }}>Faction</span></div>
            <div style={{ fontSize: 11, color: '#8899aa', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>Sports Academy Portal</div>
          </div>
        </Link>

        <div style={{ zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 100, padding: '5px 16px', fontSize: 12, color: '#34d399', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 24 }}>New Registration</div>
          <h1 style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 46, lineHeight: 1.05, letterSpacing: '0.03em', color: '#e8f0ff', marginBottom: 20 }}>
            Join the<br /><span style={{ color: '#06b6d4' }}>Sport Faction</span><br />Family
          </h1>
          <p style={{ color: '#8899aa', fontSize: 14, lineHeight: 1.7, maxWidth: 300, marginBottom: 32 }}>
            Create your account today and unlock world-class sports training.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {benefits.map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <CheckCircle size={16} style={{ color: '#34d399', flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, color: '#aab8cc', lineHeight: 1.5 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: '#4a5568', zIndex: 1 }}>© 2026 Sport Faction Academy · All rights reserved</div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1a202c', marginBottom: 6 }}>Create your account</h2>
            <p style={{ color: '#718096', fontSize: 14 }}>Fill in the details below to get started</p>
          </div>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2d3748', marginBottom: 6 }}>Full Name</label>
              <input type="text" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="light-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2d3748', marginBottom: 6 }}>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="light-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2d3748', marginBottom: 6 }}>Phone Number</label>
              <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required className="light-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2d3748', marginBottom: 6 }}>Primary Sport</label>
              <select value={form.sport} onChange={e => setForm({ ...form, sport: e.target.value })} className="light-input">
                {sports.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2d3748', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={show ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className="light-input" style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0', lineHeight: 0 }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#06b6d4,#0891b2)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6, boxShadow: '0 4px 14px rgba(6, 182, 212,0.35)', opacity: loading ? 0.75 : 1, transition: 'all 0.2s' }}>
              {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating Account...</> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#718096', marginTop: 24 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#06b6d4', fontWeight: 600, textDecoration: 'none' }}>Sign in here</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .light-input { width: 100%; padding: 11px 14px; border: 1.5px solid #cbd5e0; border-radius: 8px; font-size: 14px; color: #1a202c; background: #fff; outline: none; box-sizing: border-box; transition: border-color 0.2s; font-family: 'Inter', sans-serif; }
        .light-input:focus { border-color: #06b6d4; box-shadow: 0 0 0 3px rgba(6, 182, 212,0.1); }
        .light-input::placeholder { color: #a0aec0; }
        select.light-input { appearance: auto; }
        @media (max-width: 768px) { .register-left { display: none !important; } }
      `}</style>
    </div>
  );
}
