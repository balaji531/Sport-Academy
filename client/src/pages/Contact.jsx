import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import { MapPin, Phone, Mail, Clock, Send, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
    toast.success("Message sent! We'll respond within 24 hours.");
  };

  const contactItems = [
    { icon: MapPin, label: 'Address', val: '123 Sports Complex, Sector 18, Noida, UP 201301', color: '#06b6d4' },
    { icon: Phone,  label: 'Phone',   val: '+91 98765 43210', color: '#34d399' },
    { icon: Mail,   label: 'Email',   val: 'info@sportfaction.in', color: '#60a5fa' },
    { icon: Clock,  label: 'Hours',   val: 'Mon–Fri: 5AM–10PM | Sat–Sun: 5AM–8PM', color: '#a78bfa' },
  ];

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', paddingTop: 80, background: 'var(--navy)' }}>
        <div style={{ background: 'linear-gradient(135deg,var(--navy) 0%,#001a10 100%)', padding: '60px 0 80px', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div className="badge badge-green" style={{ marginBottom: 14 }}>Contact Us</div>
            <h1 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(40px,7vw,72px)', color: 'var(--text-main)', marginBottom: 10 }}>
              LET'S <span className="gradient-green">CONNECT</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: 480, lineHeight: 1.7 }}>Questions about admissions, bookings, or coaching? We're here to help.</p>
          </div>
        </div>

        <div className="container" style={{ paddingTop: 52, paddingBottom: 60 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 40, alignItems: 'start' }}>
            <ScrollReveal direction="left">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                {contactItems.map(({ icon: Icon, label, val, color }) => (
                  <div key={label} style={{ display: 'flex', gap: 16, padding: '16px 20px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <iframe title="Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.3895097993485!2d77.32213387540183!3d28.62748898223305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sSector%2018%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%" height="240" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="card" style={{ borderTop: '2px solid #00e676' }}>
                <h2 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: 24 }}>Send Us a Message</h2>
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <h3 style={{ color: '#34d399', marginBottom: 8 }}>Message Sent!</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Our team will respond within 24 hours.</p>
                    <button className="btn-outline" onClick={() => { setSent(false); setForm({ name:'',email:'',phone:'',subject:'',message:'' }); }}>Send Another</button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <label className="input-label">Full Name *</label>
                        <input id="contact-name" className="input" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                      </div>
                      <div>
                        <label className="input-label">Phone</label>
                        <input id="contact-phone" className="input" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Email *</label>
                      <input id="contact-email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div>
                      <label className="input-label">Subject</label>
                      <select id="contact-subject" className="input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={{ cursor: 'pointer' }}>
                        <option value="">Select a topic...</option>
                        <option value="enrollment">Student Enrollment</option>
                        <option value="coaching">Coaching Enquiry</option>
                        <option value="booking">Court Booking</option>
                        <option value="membership">Membership Plans</option>
                        <option value="events">Events & Tournaments</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Message *</label>
                      <textarea id="contact-message" className="input" rows={5} placeholder="Write your message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: 'vertical' }} />
                    </div>
                    <button id="contact-submit" type="submit" className="btn-green" disabled={loading} style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                      {loading ? <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
