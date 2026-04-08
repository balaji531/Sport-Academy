import { useState, useEffect } from 'react';
import { performanceAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Menu, Plus, Edit2, Trash2, X, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const METRICS = ['footwork', 'serveAccuracy', 'smashControl', 'stamina', 'discipline', 'fitness', 'teamwork'];
const EMPTY = { studentName:'', sport:'', month:new Date().getMonth()+1, year:new Date().getFullYear(), coachName:'', metrics:{footwork:0,serveAccuracy:0,smashControl:0,stamina:0,discipline:0,fitness:0,teamwork:0}, coachFeedback:'', matchStats:{played:0,won:0,lost:0} };

function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, padding:28, width:'100%', maxWidth:550, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h3 style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'1.1rem', color:'var(--text-main)' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={18}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function PerformancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    performanceAPI.getAll().then(r => setRecords(r.data)).catch(()=>{}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (r) => { setForm({ ...r, metrics: r.metrics||EMPTY.metrics, matchStats: r.matchStats||EMPTY.matchStats }); setModal(r); };

  const handleMetricChange = (m, val) => setForm(f => ({ ...f, metrics: { ...f.metrics, [m]: Number(val) } }));

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'add') await performanceAPI.create(form);
      else await performanceAPI.update(modal._id, form);
      toast.success(modal === 'add' ? 'Record saved' : 'Record updated');
      setModal(null); load();
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this record?')) return;
    await performanceAPI.delete(id);
    setRecords(x => x.filter(r => r._id !== id));
    toast.success('Record deleted');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-main" style={{ padding:'0 0 60px' }}>
        <div style={{ padding:'16px 28px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:16, background:'var(--navy-2)', position:'sticky', top:0, zIndex:50 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-main)', display:'none' }} id="dash-menu-btn"><Menu size={22}/></button>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'1.2rem', color:'var(--text-main)', display:'flex', alignItems:'center', gap:8 }}><TrendingUp size={18}/> Performance Tracking</h1>
            <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{records.length} evaluation records</p>
          </div>
          <button className="btn-primary" onClick={openAdd} style={{ gap:6, padding:'8px 18px', fontSize:'0.85rem' }}><Plus size={15}/> Evaluate Student</button>
        </div>

        <div style={{ padding:28 }}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Sport</th><th>Period</th><th>Coach</th><th>Overall Rating</th><th>Match Stats</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? Array(4).fill(0).map((_,i) => <tr key={i}>{Array(7).fill(0).map((_,j)=><td key={j}><div className="shimmer" style={{ height:16, borderRadius:4 }}/></td>)}</tr>)
                  : records.length === 0
                    ? <tr><td colSpan={7} style={{ textAlign:'center', color:'var(--text-muted)', padding:32 }}>No evaluations found.</td></tr>
                    : records.map(r => (
                      <tr key={r._id}>
                        <td><div style={{ fontWeight:600, color:'var(--text-main)' }}>{r.studentName||'—'}</div></td>
                        <td><span className="badge badge-gold" style={{ textTransform:'capitalize' }}>{r.sport||'—'}</span></td>
                        <td style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{MONTHS[r.month-1]} {r.year}</td>
                        <td style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{r.coachName||'—'}</td>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <div style={{ width:40, height:40, borderRadius:'50%', border:`2px solid ${r.overallRating>=8 ? '#34d399' : r.overallRating>=5 ? '#facc15' : '#f87171'}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.9rem', color:'var(--text-main)' }}>
                              {r.overallRating||0}
                            </div>
                            <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>/ 10</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>
                            <span style={{ color:'#34d399' }}>W: {r.matchStats?.won||0}</span> / 
                            <span style={{ color:'#f87171' }}> L: {r.matchStats?.lost||0}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display:'flex', gap:6 }}>
                            <button onClick={() => openEdit(r)} style={{ background:'none', border:'none', cursor:'pointer', color:'#06b6d4', padding:4 }}><Edit2 size={14}/></button>
                            <button onClick={() => del(r._id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#f87171', padding:4 }}><Trash2 size={14}/></button>
                          </div>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {modal && (
          <Modal title={modal === 'add' ? 'New Evaluation' : 'Edit Evaluation'} onClose={() => setModal(null)}>
            <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label className="input-label">Student Name</label><input className="input" value={form.studentName||''} onChange={e=>setForm({...form,studentName:e.target.value})} /></div>
                <div><label className="input-label">Sport</label><input className="input" value={form.sport||''} onChange={e=>setForm({...form,sport:e.target.value})} placeholder="e.g. Badminton"/></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label className="input-label">Month</label>
                  <select className="input" value={form.month} onChange={e=>setForm({...form,month:Number(e.target.value)})}>
                    {MONTHS.map((m,i)=><option key={m} value={i+1}>{m}</option>)}
                  </select>
                </div>
                <div><label className="input-label">Year</label><input className="input" type="number" value={form.year} onChange={e=>setForm({...form,year:Number(e.target.value)})}/></div>
              </div>

              {/* Metrics Grid */}
              <div style={{ border:'1px solid var(--border)', borderRadius:12, padding:14, background:'var(--navy)' }}>
                <label className="input-label" style={{ marginBottom:10, display:'block' }}>Skill Metrics (0-10)</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  {METRICS.map(m => (
                    <div key={m} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:'0.82rem', color:'var(--text-muted)', textTransform:'capitalize' }}>{m.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <input className="input" type="number" min={0} max={10} value={form.metrics?.[m]||0} onChange={e=>handleMetricChange(m, e.target.value)} style={{ width:60, padding:'4px 8px' }}/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Match Stats */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                <div><label className="input-label">Played</label><input className="input" type="number" min={0} value={form.matchStats?.played||0} onChange={e=>setForm({...form,matchStats:{...form.matchStats,played:Number(e.target.value)}})}/></div>
                <div><label className="input-label">Won</label><input className="input" type="number" min={0} value={form.matchStats?.won||0} onChange={e=>setForm({...form,matchStats:{...form.matchStats,won:Number(e.target.value)}})}/></div>
                <div><label className="input-label">Lost</label><input className="input" type="number" min={0} value={form.matchStats?.lost||0} onChange={e=>setForm({...form,matchStats:{...form.matchStats,lost:Number(e.target.value)}})}/></div>
              </div>

              <div><label className="input-label">Coach Feedback</label><textarea className="input" rows={2} value={form.coachFeedback||''} onChange={e=>setForm({...form,coachFeedback:e.target.value})} style={{ resize:'vertical' }}/></div>
              
              <div style={{ display:'flex', gap:10, marginTop:4 }}>
                <button type="submit" className="btn-primary" style={{ flex:1, justifyContent:'center' }} disabled={saving}>{saving?'Saving...':'Save Record'}</button>
                <button type="button" className="btn-outline" onClick={()=>setModal(null)} style={{ flex:1, justifyContent:'center' }}>Cancel</button>
              </div>
            </form>
          </Modal>
        )}
      </main>
      <style>{`@media(max-width:768px){#dash-menu-btn{display:flex!important;}}`}</style>
    </div>
  );
}
