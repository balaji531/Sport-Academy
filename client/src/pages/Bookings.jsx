import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI, paymentsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, CreditCard, CheckCircle, Loader } from 'lucide-react';

const SPORTS = ['badminton','skating','pickleball'];
const TYPES  = ['court','coach'];
const SLOTS  = ['05:30-06:30','06:30-07:30','07:30-08:30','09:00-10:00','10:00-11:00','14:00-15:00','15:00-16:00','17:00-18:00','18:00-19:00','19:00-20:00'];
const RATES  = { badminton:{court:300,coach:800}, skating:{court:200,coach:700}, pickleball:{court:350,coach:900} };

export default function Bookings() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ sport: 'badminton', type: 'court', date: '', timeSlot: '', courtNumber: 1, coachName: '', notes: '' });
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(null);
  const [myBookings, setMyBookings] = useState([]);

  const amount = RATES[form.sport]?.[form.type] || 0;

  useEffect(() => {
    if (user) bookingsAPI.getMyBookings().then(r => setMyBookings(r.data)).catch(() => {});
  }, [user, booked]);

  useEffect(() => {
    if (form.sport && form.date) {
      bookingsAPI.getAvailability(form.sport, form.date).then(r => setAvailability(r.data)).catch(() => {});
    }
  }, [form.sport, form.date]);

  const isSlotTaken = (slot) => availability.some(a => a.timeSlot === slot);

  const handleBook = async () => {
    if (!user) return toast.error('Please login first');
    if (!form.date || !form.timeSlot) return toast.error('Select date and time');
    setLoading(true);
    try {
      const booking = await bookingsAPI.create({ ...form, amount });
      const bookingId = booking.data._id;

      // Razorpay payment
      const orderRes = await paymentsAPI.createOrder({ amount, type: 'booking', description: `${form.sport} ${form.type} booking`, referenceId: bookingId });
      const { order, paymentId } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: order.amount,
        currency: 'INR',
        name: 'Sport Faction',
        description: `${form.sport} ${form.type} booking`,
        order_id: order.id,
        handler: async (response) => {
          await paymentsAPI.verify({ ...response, paymentId });
          await bookingsAPI.confirm(bookingId, paymentId);
          setBooked(booking.data);
          setStep(3);
          toast.success('Booking confirmed! 🎉');
        },
        theme: { color: '#06b6d4' },
      };

      if (window.Razorpay) {
        const rp = new window.Razorpay(options);
        rp.open();
      } else {
        toast.error('Payment gateway not loaded. Please refresh.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Choose Sport & Type', 'Select Date & Time', 'Confirmed!'];

  return (
    <>
      <Navbar />
      {/* Load Razorpay SDK */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div style={{ minHeight: '100vh', paddingTop: 80, background: 'var(--navy)', backgroundImage: 'radial-gradient(ellipse at 10% 50%,rgba(6, 182, 212,0.05) 0%,transparent 50%)' }}>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>

          {/* Header */}
          <ScrollReveal style={{ marginBottom: 40 }}>
            <div className="badge badge-gold" style={{ marginBottom: 12 }}>Book Now</div>
            <h1 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(36px,6vw,64px)', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: 8 }}>
              RESERVE YOUR <span className="gradient-text">COURT</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Book courts or coach sessions instantly. Payment confirms your slot.</p>
          </ScrollReveal>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40, maxWidth: 500 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: step > i + 1 ? '#34d399' : step === i + 1 ? '#06b6d4' : 'var(--card-2)',
                    color: step >= i + 1 ? '#000' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem',
                    border: step === i + 1 ? '2px solid #06b6d4' : 'none', transition: 'all 0.3s',
                  }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: step === i + 1 ? '#06b6d4' : 'var(--text-muted)', whiteSpace: 'nowrap', textAlign: 'center' }}>{s}</span>
                </div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? '#34d399' : 'var(--border)', margin: '0 8px', marginBottom: 24, transition: 'background 0.3s' }} />}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 28, alignItems: 'start' }}>

            {/* Booking Form */}
            <div>
              {/* Step 1: Sport & Type */}
              {step >= 1 && (
                <div className="card" style={{ marginBottom: 20 }}>
                  <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: 20 }}>1. Choose Sport & Type</h3>
                  {/* Sport */}
                  <label className="input-label">Sport</label>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                    {SPORTS.map(s => (
                      <button key={s} onClick={() => setForm({ ...form, sport: s })} style={{
                        padding: '10px 18px', borderRadius: 10, border: `1px solid ${form.sport === s ? '#06b6d4' : 'var(--border)'}`,
                        background: form.sport === s ? 'rgba(6, 182, 212,0.1)' : 'var(--card-2)',
                        color: form.sport === s ? '#06b6d4' : 'var(--text-muted)',
                        cursor: 'pointer', textTransform: 'capitalize', fontWeight: form.sport === s ? 700 : 400, transition: 'all 0.2s',
                      }}>
                        {s === 'badminton' ? '🏸' : s === 'skating' ? '⛸️' : '🏓'} {s}
                      </button>
                    ))}
                  </div>
                  {/* Type */}
                  <label className="input-label">Booking Type</label>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    {TYPES.map(t => (
                      <button key={t} onClick={() => setForm({ ...form, type: t })} style={{
                        flex: 1, padding: '10px', borderRadius: 10,
                        border: `1px solid ${form.type === t ? '#06b6d4' : 'var(--border)'}`,
                        background: form.type === t ? 'rgba(6, 182, 212,0.1)' : 'var(--card-2)',
                        color: form.type === t ? '#06b6d4' : 'var(--text-muted)',
                        cursor: 'pointer', fontWeight: form.type === t ? 700 : 400, transition: 'all 0.2s',
                      }}>
                        {t === 'court' ? '🏟️' : '🎓'} {t === 'court' ? 'Court Booking' : 'Coach Session'}
                      </button>
                    ))}
                  </div>
                  {form.type === 'coach' && (
                    <div>
                      <label className="input-label">Preferred Coach (optional)</label>
                      <input className="input" placeholder="Coach name..." value={form.coachName} onChange={e => setForm({ ...form, coachName: e.target.value })} />
                    </div>
                  )}
                  {step === 1 && (
                    <button className="btn-primary" onClick={() => setStep(2)} style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
                      Next: Select Time →
                    </button>
                  )}
                </div>
              )}

              {/* Step 2: Date & Slot */}
              {step >= 2 && (
                <div className="card" style={{ marginBottom: 20 }}>
                  <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: 20 }}>2. Select Date & Time</h3>
                  <div style={{ marginBottom: 16 }}>
                    <label className="input-label"><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />Date</label>
                    <input type="date" className="input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value, timeSlot: '' })}
                      min={new Date().toISOString().split('T')[0]} />
                  </div>
                  {form.date && (
                    <div>
                      <label className="input-label"><Clock size={12} style={{ display: 'inline', marginRight: 4 }} />Time Slot</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
                        {SLOTS.map(slot => {
                          const taken = isSlotTaken(slot);
                          return (
                            <button key={slot} disabled={taken} onClick={() => setForm({ ...form, timeSlot: slot })} style={{
                              padding: '10px', borderRadius: 8, border: `1px solid ${form.timeSlot === slot ? '#06b6d4' : taken ? 'transparent' : 'var(--border)'}`,
                              background: taken ? 'rgba(239,68,68,0.08)' : form.timeSlot === slot ? 'rgba(6, 182, 212,0.1)' : 'var(--card-2)',
                              color: taken ? '#f87171' : form.timeSlot === slot ? '#06b6d4' : 'var(--text-muted)',
                              cursor: taken ? 'not-allowed' : 'pointer', fontSize: '0.82rem', fontWeight: form.timeSlot === slot ? 700 : 400,
                              transition: 'all 0.2s',
                            }}>
                              {taken ? '✗ ' : ''}{slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div style={{ marginTop: 16 }}>
                    <label className="input-label">Notes (optional)</label>
                    <textarea className="input" rows={2} placeholder="Any special requirements..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: 'none' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Summary + Pay */}
            {step === 3 ? (
              <div className="card" style={{ textAlign: 'center', border: '1px solid rgba(52,211,153,0.3)' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 36, color: '#34d399', letterSpacing: '0.04em', marginBottom: 8 }}>Booking Confirmed!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Your {booked?.sport} {booked?.type} is booked for {new Date(booked?.date).toDateString()} at {booked?.timeSlot}.</p>
                <button className="btn-primary" onClick={() => { setStep(1); setBooked(null); setForm({ sport:'badminton',type:'court',date:'',timeSlot:'',courtNumber:1,coachName:'',notes:'' }); }} style={{ justifyContent: 'center' }}>
                  Book Another
                </button>
              </div>
            ) : (
              <div style={{ position: 'sticky', top: 100 }}>
                <div className="card" style={{ borderTop: '2px solid #06b6d4' }}>
                  <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: 20 }}>Booking Summary</h3>
                  {[
                    { label: 'Sport', val: form.sport, capitalize: true },
                    { label: 'Type', val: form.type, capitalize: true },
                    { label: 'Date', val: form.date || '—' },
                    { label: 'Time', val: form.timeSlot || '—' },
                    { label: 'Amount', val: `₹${amount}`, bold: true },
                  ].map(({ label, val, capitalize, bold }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <span style={{ color: bold ? '#06b6d4' : 'var(--text-main)', fontWeight: bold ? 700 : 600, textTransform: capitalize ? 'capitalize' : 'none' }}>{val}</span>
                    </div>
                  ))}
                  <button className="btn-primary" onClick={handleBook} disabled={loading || step < 2 || !form.date || !form.timeSlot} style={{ marginTop: 20, width: '100%', justifyContent: 'center', opacity: (step < 2 || !form.date || !form.timeSlot) ? 0.5 : 1, cursor: (step < 2 || !form.date || !form.timeSlot) ? 'not-allowed' : 'pointer' }}>
                    {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CreditCard size={16} />}
                    {loading ? 'Processing...' : 'Pay & Confirm'}
                  </button>
                  {!user && <p style={{ textAlign: 'center', marginTop: 10, fontSize: '0.82rem', color: '#f87171' }}>Please login to book</p>}
                </div>
              </div>
            )}
          </div>

          {/* My Bookings */}
          {user && myBookings.length > 0 && (
            <ScrollReveal style={{ marginTop: 48 }}>
              <h2 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: 20 }}>📋 My Bookings</h2>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Sport</th><th>Type</th><th>Date</th><th>Time</th><th>Status</th><th>Amount</th></tr></thead>
                  <tbody>
                    {myBookings.map(b => (
                      <tr key={b._id}>
                        <td style={{ textTransform: 'capitalize' }}>{b.sport === 'badminton' ? '🏸' : b.sport === 'skating' ? '⛸️' : '🏓'} {b.sport}</td>
                        <td style={{ textTransform: 'capitalize', color: 'var(--text-muted)' }}>{b.type}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{new Date(b.date).toLocaleDateString()}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{b.timeSlot}</td>
                        <td><span className={`badge ${b.status==='confirmed'?'badge-green':b.status==='cancelled'?'badge-red':'badge-gold'}`}>{b.status}</span></td>
                        <td style={{ color: '#34d399', fontWeight: 700 }}>₹{b.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
      <Footer />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
