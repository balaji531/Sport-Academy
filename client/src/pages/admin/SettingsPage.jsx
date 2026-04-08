import { useState, useEffect } from 'react';
import { settingsAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Menu, Settings, Save, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    academyName: 'Sport Faction Academy', tagline: '', email: '', phone: '', address: '', website: '',
    sportsOffered: [],
    feeDefaults: { admissionFee: 0, monthlyFee: 0, lateFeeCharge: 0, dueDayOfMonth: 5 },
    notificationSettings: { sendFeeReminders: true, sendEventAlerts: true, reminderDaysBefore: 3 },
    paymentGateway: { provider: 'razorpay', keyId: '', isLive: false }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    settingsAPI.get()
      .then(r => {
        if(r.data) setForm({ ...form, ...r.data, feeDefaults: { ...form.feeDefaults, ...r.data.feeDefaults }, notificationSettings: { ...form.notificationSettings, ...r.data.notificationSettings }, paymentGateway: { ...form.paymentGateway, ...r.data.paymentGateway } });
      })
      .catch(()=>{})
      .finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsAPI.update(form);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDeepChange = (section, key, value) => {
    setForm(f => ({ ...f, [section]: { ...f[section], [key]: value } }));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-main" style={{ padding:'0 0 60px' }}>
        <div style={{ padding:'16px 28px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:16, background:'var(--navy-2)', position:'sticky', top:0, zIndex:50 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-main)', display:'none' }} id="dash-menu-btn"><Menu size={22}/></button>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'1.2rem', color:'var(--text-main)', display:'flex', alignItems:'center', gap:8 }}><Settings size={18}/> Academy Settings</h1>
            <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Configure core platform parameters</p>
          </div>
          <button className="btn-primary" onClick={save} disabled={saving || loading} style={{ gap:6, padding:'8px 18px', fontSize:'0.85rem' }}>
            {saving ? 'Saving...' : <><Save size={15}/> Save Settings</>}
          </button>
        </div>

        {loading ? (
          <div style={{ padding:40, textAlign:'center', color:'var(--text-muted)' }}>Loading settings...</div>
        ) : (
          <div style={{ padding:28, maxWidth:800, margin:'0 auto' }}>
            <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:24 }}>
              
              <div className="glass-card" style={{ padding:28, borderRadius:16 }}>
                <h2 style={{ fontSize:'1.05rem', fontWeight:600, color:'var(--text-main)', marginBottom:20 }}>General Details</h2>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div style={{ gridColumn:'1 / -1' }}><label className="input-label">Academy Name</label><input className="input" value={form.academyName} onChange={e=>setForm({...form,academyName:e.target.value})} style={{ background:'var(--navy)' }} /></div>
                  <div><label className="input-label">Contact Email</label><input className="input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={{ background:'var(--navy)' }} /></div>
                  <div><label className="input-label">Contact Phone</label><input className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} style={{ background:'var(--navy)' }} /></div>
                  <div style={{ gridColumn:'1 / -1' }}><label className="input-label">Address</label><textarea className="input" rows={2} value={form.address} onChange={e=>setForm({...form,address:e.target.value})} style={{ background:'var(--navy)' }} /></div>
                </div>
              </div>

              <div className="glass-card" style={{ padding:28, borderRadius:16 }}>
                <h2 style={{ fontSize:'1.05rem', fontWeight:600, color:'var(--text-main)', marginBottom:20 }}>Fee Management Defaults</h2>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div><label className="input-label">Default Admission Fee (₹)</label><input className="input" type="number" min={0} value={form.feeDefaults.admissionFee} onChange={e=>handleDeepChange('feeDefaults','admissionFee',Number(e.target.value))} style={{ background:'var(--navy)' }} /></div>
                  <div><label className="input-label">Default Monthly Fee (₹)</label><input className="input" type="number" min={0} value={form.feeDefaults.monthlyFee} onChange={e=>handleDeepChange('feeDefaults','monthlyFee',Number(e.target.value))} style={{ background:'var(--navy)' }} /></div>
                  <div><label className="input-label">Late Fee Penalty (₹)</label><input className="input" type="number" min={0} value={form.feeDefaults.lateFeeCharge} onChange={e=>handleDeepChange('feeDefaults','lateFeeCharge',Number(e.target.value))} style={{ background:'var(--navy)' }} /></div>
                  <div><label className="input-label">Due Day of Month</label><input className="input" type="number" min={1} max={28} value={form.feeDefaults.dueDayOfMonth} onChange={e=>handleDeepChange('feeDefaults','dueDayOfMonth',Number(e.target.value))} style={{ background:'var(--navy)' }} title="e.g. 5 for the 5th of every month" /></div>
                </div>
              </div>

              <div className="glass-card" style={{ padding:28, borderRadius:16 }}>
                <h2 style={{ fontSize:'1.05rem', fontWeight:600, color:'var(--text-main)', marginBottom:20 }}>Automation & Notifications</h2>
                
                <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'var(--navy)', borderRadius:10, marginBottom:12, border:'1px solid var(--border)' }}>
                  <input type="checkbox" id="sendFeeReminders" checked={form.notificationSettings.sendFeeReminders} onChange={e=>handleDeepChange('notificationSettings','sendFeeReminders',e.target.checked)} style={{ width:18, height:18 }} />
                  <div style={{ flex:1 }}>
                    <label htmlFor="sendFeeReminders" style={{ fontWeight:600, color:'var(--text-main)', cursor:'pointer', display:'block', marginBottom:2 }}>Auto-Send Fee Reminders</label>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Automatically notify students/parents before due date.</div>
                  </div>
                </div>

                <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'var(--navy)', borderRadius:10, marginBottom:16, border:'1px solid var(--border)' }}>
                  <input type="checkbox" id="sendEventAlerts" checked={form.notificationSettings.sendEventAlerts} onChange={e=>handleDeepChange('notificationSettings','sendEventAlerts',e.target.checked)} style={{ width:18, height:18 }} />
                  <div style={{ flex:1 }}>
                    <label htmlFor="sendEventAlerts" style={{ fontWeight:600, color:'var(--text-main)', cursor:'pointer', display:'block', marginBottom:2 }}>Auto-Send Event Alerts</label>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Notify enrolled students when a new event approaches.</div>
                  </div>
                </div>

                <div>
                  <label className="input-label">Send Reminders X Days Before</label>
                  <input className="input" type="number" min={1} max={14} value={form.notificationSettings.reminderDaysBefore} onChange={e=>handleDeepChange('notificationSettings','reminderDaysBefore',Number(e.target.value))} style={{ background:'var(--navy)', width:200 }} />
                </div>
              </div>

              <div className="glass-card" style={{ padding:28, borderRadius:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                  <h2 style={{ fontSize:'1.05rem', fontWeight:600, color:'var(--text-main)' }}>Payment Gateway</h2>
                  <div style={{ display:'flex', alignItems:'center', gap:6, background:form.paymentGateway.isLive ? 'rgba(52,211,153,0.1)' : 'rgba(250,204,21,0.1)', color:form.paymentGateway.isLive ? '#34d399' : '#facc15', padding:'4px 10px', borderRadius:20, fontSize:'0.75rem', fontWeight:700 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:form.paymentGateway.isLive ? '#34d399' : '#facc15' }} /> {form.paymentGateway.isLive ? 'LIVE MODE' : 'TEST MODE'}
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:16 }}>
                  <div><label className="input-label">Provider</label><input className="input" value={form.paymentGateway.provider} readOnly style={{ background:'var(--navy)', opacity:0.7 }} /></div>
                  <div><label className="input-label">API Key ID (Razorpay)</label><input className="input" type="password" value={form.paymentGateway.keyId} onChange={e=>handleDeepChange('paymentGateway','keyId',e.target.value)} style={{ background:'var(--navy)' }} placeholder="rzp_test_..." /></div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:4 }}>
                    <input type="checkbox" id="isLive" checked={form.paymentGateway.isLive} onChange={e=>handleDeepChange('paymentGateway','isLive',e.target.checked)} />
                    <label htmlFor="isLive" style={{ fontSize:'0.9rem', color:'var(--text-main)', cursor:'pointer' }}>Enable Live Transactions</label>
                  </div>
                </div>
              </div>

            </form>
          </div>
        )}
      </main>
      <style>{`@media(max-width:768px){#dash-menu-btn{display:flex!important;}}`}</style>
    </div>
  );
}
