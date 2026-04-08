import { useState, useEffect } from 'react';
import { membershipsAPI, paymentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import toast from 'react-hot-toast';
import { Check, Zap, Shield, Star, Crown, Loader } from 'lucide-react';

const PLAN_META = {
  basic:    { icon: '🎯', label: 'Basic',    color: 'var(--text-muted)', glow: 'rgba(170,184,204,0.1)', Icon: Shield },
  standard: { icon: '⚡', label: 'Standard', color: '#60a5fa', glow: 'rgba(96,165,250,0.1)',  Icon: Zap },
  premium:  { icon: '⭐', label: 'Premium',  color: '#06b6d4', glow: 'rgba(6, 182, 212,0.1)',  Icon: Star, popular: true },
  elite:    { icon: '👑', label: 'Elite',    color: '#a78bfa', glow: 'rgba(167,139,250,0.1)', Icon: Crown },
};

export default function Membership() {
  const { user } = useAuth();
  const [plans, setPlans] = useState({});
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(null);

  useEffect(() => {
    membershipsAPI.getPlans().then(r => setPlans(r.data)).catch(() => {});
    if (user) membershipsAPI.getMy().then(r => setCurrent(r.data)).catch(() => {});
  }, [user]);

  const purchase = async (planKey) => {
    if (!user) return toast.error('Please login first');
    setPurchasing(planKey);
    const plan = plans[planKey];
    try {
      const orderRes = await paymentsAPI.createOrder({ amount: plan.price, type: 'membership', description: `${planKey} membership plan` });
      const { order, paymentId } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: order.amount, currency: 'INR',
        name: 'Sport Faction', description: `${planKey.charAt(0).toUpperCase() + planKey.slice(1)} Membership`,
        order_id: order.id,
        handler: async (res) => {
          await paymentsAPI.verify({ ...res, paymentId });
          const memRes = await membershipsAPI.purchase({ plan: planKey, paymentId });
          setCurrent(memRes.data);
          toast.success(`🎉 ${planKey.charAt(0).toUpperCase() + planKey.slice(1)} membership activated!`);
        },
        theme: { color: PLAN_META[planKey]?.color || '#06b6d4' },
      };
      if (window.Razorpay) {
        const rp = new window.Razorpay(options);
        rp.open();
      } else {
        toast.error('Payment gateway not loaded. Please refresh.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', paddingTop: 80, background: 'var(--navy)' }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,var(--navy) 0%,#fef3c7 100%)', padding: '60px 0 80px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6, 182, 212,0.1),transparent 70%)' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="badge badge-gold" style={{ marginBottom: 14 }}>Membership Plans</div>
            <h1 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(40px,7vw,76px)', letterSpacing: '0.03em', color: 'var(--text-main)', marginBottom: 12, lineHeight: 0.95 }}>
              UNLOCK YOUR <span className="gradient-text">FULL POTENTIAL</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: 520, lineHeight: 1.7 }}>Choose the plan that fits your training goals. All plans include court access, coaching sessions, and more.</p>
          </div>
        </div>

        <div className="container" style={{ paddingTop: 48, paddingBottom: 60 }}>
          {/* Current membership banner */}
          {current && (
            <ScrollReveal>
              <div style={{
                background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)',
                borderRadius: 16, padding: '20px 24px', marginBottom: 36, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
              }}>
                <div style={{ fontSize: 28 }}>✅</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#34d399', marginBottom: 2 }}>Active Membership: {current.plan?.toUpperCase()} Plan</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Valid until <strong style={{ color: 'var(--text-main)' }}>{new Date(current.expiryDate).toDateString()}</strong>
                  </div>
                </div>
                <div>
                  {Math.ceil((new Date(current.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Plans grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, marginBottom: 60 }}>
            {Object.entries(plans).map(([key, plan], i) => {
              const meta = PLAN_META[key] || {};
              const isCurrentPlan = current?.plan === key;
              return (
                <ScrollReveal key={key} delay={i * 80}>
                  <div className={`plan-card ${meta.popular ? 'popular' : ''}`} style={{ '--glow-color': meta.glow }}>
                    {meta.popular && (
                      <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#06b6d4,#0891b2)', color: '#000', fontSize: '0.72rem', fontWeight: 800, padding: '4px 16px', borderRadius: 20, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                        ⭐ MOST POPULAR
                      </div>
                    )}
                    <div style={{ fontSize: 36, marginBottom: 14 }}>{meta.icon}</div>
                    <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.3rem', color: meta.color, marginBottom: 4, letterSpacing: '0.04em' }}>{meta.label}</div>
                    <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 44, color: 'var(--text-main)', letterSpacing: '0.02em', lineHeight: 1, marginBottom: 4 }}>
                      ₹{plan.price?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20 }}>/{plan.duration} days</div>
                    <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                      {plan.benefits?.map((b, j) => (
                        <li key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10, fontSize: '0.85rem', color: '#c8d8e8' }}>
                          <Check size={14} style={{ color: meta.color, marginTop: 2, flexShrink: 0 }} /> {b}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => !isCurrentPlan && purchase(key)}
                      disabled={isCurrentPlan || purchasing === key}
                      style={{
                        width: '100%', padding: '12px', borderRadius: 10,
                        background: isCurrentPlan ? 'rgba(52,211,153,0.1)' : meta.popular ? `linear-gradient(135deg,${meta.color},${meta.color}cc)` : 'transparent',
                        border: `1px solid ${isCurrentPlan ? '#34d399' : meta.color}`,
                        color: isCurrentPlan ? '#34d399' : meta.popular ? '#000' : meta.color,
                        cursor: isCurrentPlan ? 'default' : 'pointer', fontWeight: 700, fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => !isCurrentPlan && !meta.popular && (e.currentTarget.style.background = `${meta.color}15`)}
                      onMouseLeave={e => !isCurrentPlan && !meta.popular && (e.currentTarget.style.background = 'transparent')}
                    >
                      {purchasing === key ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                      {isCurrentPlan ? '✓ Current Plan' : purchasing === key ? 'Processing...' : 'Get Started'}
                    </button>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Comparison note */}
          <ScrollReveal>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 10 }}>
                🤝 All Plans Include
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 16 }}>
                {['Free parking', 'Locker access', 'Academy events', 'Progress tracking app', 'Community forum', 'Monthly newsletter'].map(item => (
                  <span key={item} className="badge badge-gold" style={{ fontSize: '0.82rem', padding: '7px 16px' }}>✓ {item}</span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
      <Footer />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
