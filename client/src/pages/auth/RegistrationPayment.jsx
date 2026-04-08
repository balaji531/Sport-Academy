import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { paymentsAPI } from '../../services/api';
import { CheckCircle, ArrowRight, ShieldCheck, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxx';

const plans = [
  {
    id: 'basic',
    name: 'Starter',
    price: 1999,
    duration: '1 Month',
    icon: '🏅',
    color: '#60a5fa',
    perks: ['Academy access', 'Group coaching sessions', 'Locker facility', 'Basic equipment provided'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 4999,
    duration: '3 Months',
    icon: '🥇',
    color: '#06b6d4',
    popular: true,
    perks: ['Everything in Starter', 'Personal coach session (4/month)', 'Fitness assessment', 'Nutrition guidance', 'Tournament access'],
  },
  {
    id: 'premium',
    name: 'Elite',
    price: 8999,
    duration: '6 Months',
    icon: '🏆',
    color: '#34d399',
    perks: ['Everything in Standard', 'Unlimited personal coaching', 'Video analysis', 'Priority court booking', 'Sports kit included', 'Certificate of excellence'],
  },
];

const colorRgb = c => c === '#60a5fa' ? '96,165,250' : c === '#06b6d4' ? '245,166,35' : '52,211,153';

// Load Razorpay script dynamically
const loadRazorpayScript = () =>
  new Promise(resolve => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const s = document.createElement('script');
    s.id  = 'razorpay-script';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

export default function RegistrationPayment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);            // 1: plan, 2: success
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [loading, setLoading] = useState(false);

  const plan = plans.find(p => p.id === selectedPlan);
  const totalAmount = Math.round(plan.price * 1.18);

  const handlePay = async () => {
    setLoading(true);
    try {
      // 1. Load the Razorpay JS SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load payment gateway. Check your internet connection.');
        setLoading(false);
        return;
      }

      // 2. Create an order on the backend
      const { data } = await paymentsAPI.createOrder({
        amount:      totalAmount,
        type:        'registration',
        description: `${plan.name} plan registration — ${plan.duration}`,
      });

      const { order, paymentId } = data;
      
      // 3. Open Razorpay checkout
      const options = {
        key:          RAZORPAY_KEY,
        amount:       order.amount,           // already in paise
        currency:     order.currency || 'INR',
        name:         'Sport Faction',
        description:  `${plan.name} Plan — ${plan.duration}`,
        order_id:     order.id,
        prefill: {
          name:  user?.name  || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: '#06b6d4' },

        handler: async (response) => {
          try {
            // 5. Verify the payment on the backend
            await paymentsAPI.verify({
              paymentId,
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            toast.success('Payment successful! Welcome to Sport Faction! 🎉');
            setStep(2);
          } catch {
            toast.error('Payment verification failed. Please contact support.');
          }
        },

        modal: {
          ondismiss: () => {
            toast('Payment cancelled.', { icon: '⚠️' });
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        toast.error(`Payment failed: ${resp.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not initiate payment. Try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{
      minHeight: '100vh', background: 'var(--navy)',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%,rgba(6, 182, 212,0.06) 0%,transparent 60%)',
      padding: '60px 24px 40px',
    }}>
      <div style={{ maxWidth: 940, margin: '0 auto' }}>

        {/* Logo + header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,#06b6d4,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue,cursive', fontSize: 22, color: '#000' }}>SF</div>
          </Link>

          {step === 1 && (
            <>
              <h1 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(32px,5vw,52px)', letterSpacing: '0.04em', color: '#e8f0ff', marginBottom: 8 }}>
                Complete Your <span style={{ color: '#06b6d4' }}>Registration</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Welcome, <strong style={{ color: '#e8f0ff' }}>{user?.name}</strong>! Choose a training plan to begin your journey.
              </p>
              {/* Steps */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 28 }}>
                {['Choose Plan', 'Pay Securely', 'Start Training'].map((s, i) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', background: i === 0 ? '#06b6d4' : 'rgba(255,255,255,0.08)', color: i === 0 ? '#000' : 'var(--text-muted)', transition: 'all 0.3s' }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: '0.82rem', color: i === 0 ? '#e8f0ff' : 'var(--text-muted)', fontWeight: i === 0 ? 600 : 400 }}>{s}</span>
                    </div>
                    {i < 2 && <div style={{ width: 40, height: 1, background: 'var(--border)' }} />}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* STEP 1 — Plan Selection */}
        {step === 1 && (
          <div>
            {/* Plan Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, marginBottom: 40 }}>
              {plans.map(p => (
                <div key={p.id} onClick={() => setSelectedPlan(p.id)} style={{ borderRadius: 20, padding: 28, cursor: 'pointer', position: 'relative', background: selectedPlan === p.id ? `rgba(${colorRgb(p.color)},0.08)` : 'var(--card)', border: `2px solid ${selectedPlan === p.id ? p.color : 'var(--border)'}`, transition: 'all 0.25s', transform: selectedPlan === p.id ? 'translateY(-4px)' : 'none', boxShadow: selectedPlan === p.id ? `0 24px 50px rgba(0,0,0,0.3)` : 'none' }}>
                  {p.popular && (
                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#06b6d4', color: '#000', fontSize: '0.7rem', fontWeight: 700, padding: '4px 14px', borderRadius: 20, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>MOST POPULAR</div>
                  )}
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>{p.icon}</div>
                    <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 26, color: '#e8f0ff', letterSpacing: '0.04em' }}>{p.name}</div>
                    <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 42, color: p.color, lineHeight: 1, marginTop: 4 }}>₹{p.price.toLocaleString()}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{p.duration}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {p.perks.map(perk => (
                      <div key={perk} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.85rem', color: '#aab8cc' }}>
                        <CheckCircle size={14} style={{ color: p.color, flexShrink: 0, marginTop: 2 }} />{perk}
                      </div>
                    ))}
                  </div>
                  {selectedPlan === p.id && <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: p.color }}>✓ Selected</div>}
                </div>
              ))}
            </div>

            {/* Selected plan summary + Pay button */}
            <div style={{ maxWidth: 520, margin: '0 auto', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{plan.name} Plan ({plan.duration})</span>
                <span style={{ color: '#e8f0ff' }}>₹{plan.price.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>GST (18%)</span>
                <span style={{ color: '#e8f0ff' }}>₹{Math.round(plan.price * 0.18).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid var(--border)', fontWeight: 700, marginBottom: 20 }}>
                <span style={{ color: '#e8f0ff', fontSize: '1.1rem' }}>Total</span>
                <span style={{ color: '#06b6d4', fontFamily: 'Bebas Neue,cursive', fontSize: '1.5rem', letterSpacing: '0.04em' }}>₹{totalAmount.toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34d399', fontSize: '0.78rem', marginBottom: 20 }}>
                <ShieldCheck size={14} />
                100% secure payment via Razorpay · UPI · Cards · Net Banking
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={handlePay} disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px 20px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
                  {loading
                    ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Opening Payment…</>
                    : <>🔒 Pay ₹{totalAmount.toLocaleString()} Securely</>}
                </button>
              </div>
            </div>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 16 }}>
              Powered by <strong style={{ color: '#e8f0ff' }}>Razorpay</strong> · Your payment info is never stored on our servers.
            </p>
          </div>
        )}

        {/* STEP 2 — Success */}
        {step === 2 && (
          <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', border: '2px solid #34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', animation: 'pop 0.5s ease' }}>
              <CheckCircle size={48} style={{ color: '#34d399' }} />
            </div>
            <h1 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(36px,5vw,56px)', color: '#e8f0ff', letterSpacing: '0.04em', marginBottom: 12 }}>Payment Successful!</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
              Welcome to Sport Faction, <strong style={{ color: '#e8f0ff' }}>{user?.name}</strong>! 🎉
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 36 }}>
              Your <strong style={{ color: '#06b6d4' }}>{plan.name} Plan ({plan.duration})</strong> is now active.<br />
              A confirmation receipt has been sent to <strong style={{ color: '#e8f0ff' }}>{user?.email}</strong>.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 36 }}>
              {[{ icon: '🎓', label: 'Student Portal' }, { icon: '📅', label: 'Book Courts' }, { icon: '🏆', label: 'Join Events' }].map(item => (
                <div key={item.label} style={{ padding: 20, borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/dashboard/student')} className="btn-primary" style={{ padding: '14px 40px', fontSize: '1rem' }}>
              Go to My Dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pop  { 0%{transform:scale(0.5);opacity:0} 80%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
      `}</style>
    </div>
  );
}
