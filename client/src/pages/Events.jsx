import { useState, useEffect } from 'react';
import { eventsAPI, paymentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Users, Trophy, Filter, Loader } from 'lucide-react';

const SPORT_COLORS = { badminton: '#06b6d4', skating: '#60a5fa', pickleball: '#34d399', all: '#a78bfa' };
const SPORT_EMOJIS = { badminton: '🏸', skating: '⛸️', pickleball: '🏓', all: '🏆' };

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ sport: '', status: 'upcoming' });
  const [selected, setSelected] = useState(null);
  const [enrolling, setEnrolling] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(null);

  useEffect(() => {
    setLoading(true);
    eventsAPI.getAll(filter).then(r => setEvents(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [filter]);

  const enroll = async (event) => {
    if (!user) return toast.error('Please login to enroll');
    setEnrolling(event._id);
    try {
      if (event.entryFee > 0) {
        const orderRes = await paymentsAPI.createOrder({ amount: event.entryFee, type: 'event', description: event.title });
        const { order, paymentId } = orderRes.data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
          amount: order.amount, currency: 'INR',
          name: 'Sport Faction', description: event.title, order_id: order.id,
          handler: async (res) => {
            await paymentsAPI.verify({ ...res, paymentId });
            await eventsAPI.enroll(event._id);
            setEvents(ev => ev.map(e => e._id === event._id ? { ...e, enrolledUsers: [...(e.enrolledUsers || []), user._id] } : e));
            toast.success('Enrolled successfully! 🎉');
          },
          theme: { color: SPORT_COLORS[event.sport] || '#06b6d4' },
        };
        if (window.Razorpay) {
          const rp = new window.Razorpay(options);
          rp.open();
        } else {
          toast.error('Payment gateway not loaded. Please refresh.');
        }
      } else {
        await eventsAPI.enroll(event._id);
        setEvents(ev => ev.map(e => e._id === event._id ? { ...e, enrolledUsers: [...(e.enrolledUsers || []), user._id] } : e));
        toast.success('Enrolled successfully! 🎉');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(null);
    }
  };

  const isEnrolled = (event) => user && event.enrolledUsers?.some(id => String(id) === String(user._id) || id === user._id);

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', paddingTop: 80, background: 'var(--navy)' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,var(--navy) 0%,#f3e8ff 100%)', padding: '60px 0 80px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,0.1),transparent 70%)' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="badge" style={{ marginBottom: 14, background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}>🏆 Events & Tournaments</div>
            <h1 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(40px,7vw,76px)', letterSpacing: '0.03em', color: 'var(--text-main)', marginBottom: 12, lineHeight: 0.95 }}>
              COMPETE. WIN. <span style={{ color: '#a78bfa' }}>REPEAT.</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: 520, lineHeight: 1.7 }}>Join tournaments, skill challenges, and community events. Compete against the best and showcase your talent.</p>
          </div>
        </div>

        <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            {['upcoming','ongoing','completed'].map(s => (
              <button key={s} onClick={() => setFilter(f => ({ ...f, status: f.status === s ? '' : s }))} style={{
                padding: '8px 18px', borderRadius: 20, border: `1px solid ${filter.status === s ? '#a78bfa' : 'var(--border)'}`,
                background: filter.status === s ? 'rgba(167,139,250,0.12)' : 'var(--card-2)',
                color: filter.status === s ? '#a78bfa' : 'var(--text-muted)',
                cursor: 'pointer', fontSize: '0.82rem', fontWeight: filter.status === s ? 700 : 400,
                textTransform: 'capitalize', transition: 'all 0.2s',
              }}>{s}</button>
            ))}
            <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
            {['all','badminton','skating','pickleball'].map(sp => (
              <button key={sp} onClick={() => setFilter(f => ({ ...f, sport: f.sport === sp || (sp === 'all' && !f.sport) ? '' : sp === 'all' ? '' : sp }))} style={{
                padding: '8px 18px', borderRadius: 20, border: `1px solid ${(filter.sport === sp || (sp === 'all' && !filter.sport)) ? SPORT_COLORS[sp] : 'var(--border)'}`,
                background: (filter.sport === sp || (sp === 'all' && !filter.sport)) ? `${SPORT_COLORS[sp]}12` : 'var(--card-2)',
                color: (filter.sport === sp || (sp === 'all' && !filter.sport)) ? SPORT_COLORS[sp] : 'var(--text-muted)',
                cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s',
              }}>{SPORT_EMOJIS[sp]} {sp.charAt(0).toUpperCase() + sp.slice(1)}</button>
            ))}
          </div>

          {/* Event cards */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
              {Array(6).fill(0).map((_, i) => <div key={i} className="shimmer" style={{ height: 280, borderRadius: 16 }} />)}
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 80 }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🏆</div>
              <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>No events found</h3>
              <p style={{ color: 'var(--text-muted)' }}>Check back soon for upcoming tournaments!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
              {events.map((event, i) => {
                const color = SPORT_COLORS[event.sport] || '#a78bfa';
                const enrolled = isEnrolled(event);
                return (
                  <ScrollReveal key={event._id} delay={i * 60}>
                    <div style={{
                      background: 'var(--card)', border: `1px solid ${color}20`, borderRadius: 18,
                      overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${color}50`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = `${color}20`; }}
                    >
                      {/* Cover */}
                      <div style={{ height: 140, background: `linear-gradient(135deg,${color}20,${color}08)`, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {event.coverImage ? <img src={event.coverImage} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 52 }}>{SPORT_EMOJIS[event.sport]}</span>}
                        <div style={{ position: 'absolute', top: 12, right: 12 }}>
                          <span className="badge" style={{ background: `${color}20`, color, border: `1px solid ${color}40`, fontSize: '0.70rem' }}>{event.status}</span>
                        </div>
                        {event.entryFee === 0 && <div style={{ position: 'absolute', top: 12, left: 12 }}>
                          <span className="badge badge-green" style={{ fontSize: '0.70rem' }}>FREE</span>
                        </div>}
                      </div>

                      <div style={{ padding: '18px 20px' }}>
                        <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 8 }}>{event.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', lineHeight: 1.5, marginBottom: 14 }}>{event.description?.substring(0, 100)}...</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                          <div style={{ display: 'flex', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)', alignItems: 'center' }}>
                            <Calendar size={12} /> {new Date(event.date).toDateString()}
                          </div>
                          {event.venue && <div style={{ display: 'flex', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)', alignItems: 'center' }}>
                            <MapPin size={12} /> {event.venue}
                          </div>}
                          <div style={{ display: 'flex', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)', alignItems: 'center' }}>
                            <Users size={12} /> {event.enrolledUsers?.length || 0} enrolled
                            {event.maxParticipants && ` / ${event.maxParticipants} max`}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 22, color, letterSpacing: '0.04em' }}>
                            {event.entryFee === 0 ? 'FREE' : `₹${event.entryFee}`}
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {event.gallery?.length > 0 && (
                              <button onClick={() => setSelected(event)} style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card-2)', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                📷 Gallery
                              </button>
                            )}
                            {event.status === 'upcoming' && (
                              <button onClick={() => enroll(event)} disabled={enrolled || enrolling === event._id || event.status !== 'upcoming'} style={{
                                padding: '7px 16px', borderRadius: 8, border: 'none',
                                background: enrolled ? 'rgba(52,211,153,0.12)' : `linear-gradient(135deg,${color},${color}cc)`,
                                color: enrolled ? '#34d399' : '#000',
                                cursor: enrolled ? 'default' : 'pointer', fontSize: '0.82rem', fontWeight: 700, transition: 'all 0.2s',
                              }}>
                                {enrolling === event._id ? <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> : enrolled ? '✓ Enrolled' : 'Enroll'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Gallery Modal */}
      {selected && (
        <div onClick={() => { setSelected(null); setGalleryOpen(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{selected.title} — Gallery</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }}>✕</button>
            </div>
            <div style={{ padding: 20 }}>
              {selected.gallery?.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No gallery items yet.</p>
              ) : (
                <div className="gallery-grid">
                  {selected.gallery.map((item, i) => (
                    <div key={i} className="gallery-item" onClick={() => setGalleryOpen(i)}>
                      {item.type === 'video' ? (
                        <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <img src={item.url} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                      <div className="gallery-item-overlay"><span style={{ fontSize: 24 }}>🔍</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
