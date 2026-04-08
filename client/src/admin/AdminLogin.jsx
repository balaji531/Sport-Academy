import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowRight, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { user, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in as admin
  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'admin') {
        toast.error('This login is for administrators only.');
        return;
      }
      toast.success(`Welcome back, Commander ${user.name}! 🚀`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--navy)',
      backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(6, 182, 212,0.05) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(6, 182, 212,0.05) 0%, transparent 50%)',
      padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Admin Branding */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg,#06b6d4,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue,cursive', fontSize: 32, color: '#000', margin: '0 auto 20px', boxShadow: '0 0 30px rgba(6, 182, 212,0.2)' }}>SF</div>
          <h1 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 42, letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: 8 }}>
            ADMIN <span style={{ color: '#06b6d4' }}>PORTAL</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Secure Access Restricted</p>
        </div>

        {/* Login Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255, 255, 255, 0.7)', borderRadius: 24, padding: 32, backdropFilter: 'blur(10px)' }}>
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="input-label" style={{ color: '#06b6d4' }}>Control ID (Email)</label>
              <input type="email" className="input" placeholder="admin@sportfaction.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required 
                style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.1)' }} />
            </div>
            <div>
              <label className="input-label" style={{ color: '#06b6d4' }}>Access Key (Password)</label>
              <div style={{ position: 'relative' }}>
                <input type={show ? 'text' : 'password'} className="input" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required 
                  style={{ paddingRight: 44, background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.1)' }} />
                <button type="button" onClick={() => setShow(!show)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: 10, padding: '14px', borderRadius: 12 }}>
              {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Initialize Session'} {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            &larr; Return to Public Website
          </a>
        </div>

        <style>{`@keyframes spin {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}
