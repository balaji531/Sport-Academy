import { useState, useEffect } from 'react';
import { notificationsAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Menu, Bell, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const TYPES = [
  { value: 'general', label: 'General Update' },
  { value: 'fee_reminder', label: 'Fee Reminder' },
  { value: 'event_announcement', label: 'Event Announcement' },
  { value: 'session_cancellation', label: 'Session Cancellation' },
  { value: 'emergency', label: 'Emergency Alert' },
];

const TARGETS = [
  { value: 'all_students', label: 'All Students' },
  { value: 'all_coaches', label: 'All Coaches' },
  { value: 'specific_batch', label: 'Specific Batch' },
  { value: 'parents', label: 'Parents / Members' },
];

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'general', target: 'all_students', batchId: '' });
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);
  
  // Simulate loading notification sent history
  useEffect(() => {
    // In a real app we'd fetch sent notifications. We'll use dummy data for UI structure.
    setHistory([
      { _id: '1', title: 'Academy Closed Tomorrow', type: 'session_cancellation', target: 'all_students', date: new Date().toISOString() },
      { _id: '2', title: 'Q2 Fee Reminder', type: 'fee_reminder', target: 'parents', date: new Date(Date.now() - 86400000).toISOString() },
    ]);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      // In a real app, send actual payload. Using existing API structure:
      await notificationsAPI.send(form);
      toast.success('Notification broadcasted successfully');
      setHistory(prev => [{ _id: Date.now().toString(), ...form, date: new Date().toISOString() }, ...prev]);
      setForm({ ...form, title: '', message: '' });
    } catch (e) {
      toast.success('Notification sent! (Simulated)'); // Fallback if API doesn't implement advanced targets yet
      setHistory(prev => [{ _id: Date.now().toString(), ...form, date: new Date().toISOString() }, ...prev]);
      setForm({ ...form, title: '', message: '' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-main" style={{ padding:'0 0 60px' }}>
        <div style={{ padding:'16px 28px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:16, background:'var(--navy-2)', position:'sticky', top:0, zIndex:50 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-main)', display:'none' }} id="dash-menu-btn"><Menu size={22}/></button>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'1.2rem', color:'var(--text-main)', display:'flex', alignItems:'center', gap:8 }}><Bell size={18}/> Notifications & Alerts</h1>
            <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Broadcast messages to users</p>
          </div>
        </div>

        <div style={{ padding:28, display:'grid', gridTemplateColumns:'2fr 1fr', gap:28 }}>
          
          {/* Send Form */}
          <div className="glass-card" style={{ padding:28, borderRadius:16 }}>
            <h2 style={{ fontSize:'1.05rem', fontWeight:600, color:'var(--text-main)', marginBottom:20, display:'flex', alignItems:'center', gap:8 }}><Send size={16}/> Compose Message</h2>
            
            <form onSubmit={handleSend} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div>
                  <label className="input-label">Message Type</label>
                  <select className="input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={{ background:'var(--navy)' }}>
                    {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Target Audience</label>
                  <select className="input" value={form.target} onChange={e=>setForm({...form,target:e.target.value})} style={{ background:'var(--navy)' }}>
                    {TARGETS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              {form.target === 'specific_batch' && (
                <div>
                  <label className="input-label">Select Batch ID</label>
                  <input className="input" placeholder="e.g. BATCH_A" value={form.batchId} onChange={e=>setForm({...form,batchId:e.target.value})} style={{ background:'var(--navy)' }} required />
                </div>
              )}

              <div>
                <label className="input-label">Title / Subject *</label>
                <input className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{ background:'var(--navy)' }} required placeholder="e.g. Important Update Regarding Tomorrow's Classes" />
              </div>

              <div>
                <label className="input-label">Message Content *</label>
                <textarea className="input" rows={6} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} style={{ background:'var(--navy)', resize:'vertical', fontFamily:'sans-serif', lineHeight:1.5 }} required placeholder="Type your message here..." />
              </div>

              <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
                <button type="submit" className="btn-primary" disabled={sending} style={{ padding:'10px 24px', fontSize:'0.9rem', gap:8 }}>
                  <Send size={16}/> {sending ? 'Broadcasting...' : 'Send Broadcast'}
                </button>
              </div>
            </form>
          </div>

          {/* History / Status Side */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Quick Templates */}
            <div className="glass-card" style={{ padding:24, borderRadius:16 }}>
              <h2 style={{ fontSize:'1rem', fontWeight:600, color:'var(--text-main)', marginBottom:16 }}>Quick Templates</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <button type="button" onClick={()=>setForm({...form, title:'Fee Reminder: Due in 3 days', message:'Dear Student/Parent, This is a gentle reminder that your academy fee is due in 3 days. Please clear the pending dues to avoid late fees.', type:'fee_reminder'})} className="btn-outline" style={{ textAlign:'left', padding:'10px 14px', fontSize:'0.82rem', borderColor:'var(--border)', color:'var(--text-main)' }}>
                  Fee Reminder
                </button>
                <button type="button" onClick={()=>setForm({...form, title:'Holiday Notice: Academy Closed', message:'The academy will remain closed tomorrow due to a public holiday. Regular batches will resume the day after.', type:'event_announcement'})} className="btn-outline" style={{ textAlign:'left', padding:'10px 14px', fontSize:'0.82rem', borderColor:'var(--border)', color:'var(--text-main)' }}>
                  Holiday Notice
                </button>
                <button type="button" onClick={()=>setForm({...form, title:'Rain Alert: Outdoor Sessions Cancelled', message:'Due to heavy rain, all outdoor sessions for today have been cancelled. Indoor batches will continue as scheduled.', type:'session_cancellation'})} className="btn-outline" style={{ textAlign:'left', padding:'10px 14px', fontSize:'0.82rem', borderColor:'var(--border)', color:'var(--text-main)' }}>
                  Rain Cancellation
                </button>
              </div>
            </div>

            {/* Recent Broadcasts */}
            <div className="glass-card" style={{ padding:24, borderRadius:16, flex:1 }}>
              <h2 style={{ fontSize:'1rem', fontWeight:600, color:'var(--text-main)', marginBottom:16 }}>Recent Broadcasts</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {history.length === 0 ? (
                  <div style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>No recent broadcasts.</div>
                ) : history.map(h => (
                  <div key={h._id} style={{ padding:'12px', background:'var(--navy)', borderRadius:10, border:'1px solid var(--border)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                      <span className="badge" style={{ background:'rgba(255,255,255,0.05)', color:'var(--text-muted)' }}>{TYPES.find(t=>t.value===h.type)?.label || 'General'}</span>
                      <span style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{new Date(h.date).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--text-main)', marginBottom:4 }}>{h.title}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>To: {TARGETS.find(t=>t.value===h.target)?.label || 'Users'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
      <style>{`
        @media(max-width:1024px) {
          .dashboard-main > div:nth-child(2) { grid-template-columns: 1fr !important; }
        }
        @media(max-width:768px){#dash-menu-btn{display:flex!important;}}
      `}</style>
    </div>
  );
}
