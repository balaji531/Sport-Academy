import { useState, useEffect } from 'react';
import { batchesAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Menu, Plus, Edit2, Trash2, X, Layers, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const SPORTS   = ['badminton', 'skating', 'pickleball', 'multiple'];
const SKILLS   = ['Beginner', 'Intermediate', 'Advanced', 'All'];
const DAYS_OPT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const EMPTY = { name:'', sport:'badminton', ageGroup:'', skillLevel:'All', timeSlot:'', days:[], capacity:20, coachName:'', venue:'', startDate:'', endDate:'', isActive:true };

function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, padding:28, width:'100%', maxWidth:500, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h3 style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'1.1rem', color:'var(--text-main)' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={18}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function BatchesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [sportFilter, setSportFilter] = useState('');

  const load = () => {
    setLoading(true);
    batchesAPI.getAll(sportFilter ? { sport: sportFilter } : {})
      .then(r => setBatches(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [sportFilter]);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (b) => { setForm({ ...b, startDate: b.startDate?.slice(0,10)||'', endDate: b.endDate?.slice(0,10)||'' }); setModal(b); };

  const toggleDay = (d) => setForm(f => ({ ...f, days: f.days.includes(d) ? f.days.filter(x=>x!==d) : [...f.days, d] }));

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'add') await batchesAPI.create(form);
      else await batchesAPI.update(modal._id, form);
      toast.success(modal === 'add' ? 'Batch created' : 'Batch updated');
      setModal(null); load();
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this batch?')) return;
    await batchesAPI.delete(id);
    setBatches(b => b.filter(x => x._id !== id));
    toast.success('Batch deleted');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-main" style={{ padding:'0 0 60px' }}>
        <div style={{ padding:'16px 28px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:16, background:'var(--navy-2)', position:'sticky', top:0, zIndex:50 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-main)', display:'none' }} id="dash-menu-btn"><Menu size={22}/></button>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'1.2rem', color:'var(--text-main)', display:'flex', alignItems:'center', gap:8 }}><Layers size={18}/> Batches / Training Groups</h1>
            <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{batches.length} batches</p>
          </div>
          <button className="btn-primary" onClick={openAdd} style={{ gap:6, padding:'8px 18px', fontSize:'0.85rem' }}><Plus size={15}/> Add Batch</button>
        </div>

        <div style={{ padding:28 }}>
          <div className="glass-card" style={{ padding:'14px 18px', borderRadius:14, marginBottom:20, display:'flex', gap:12, alignItems:'center' }}>
            <span style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-muted)' }}>Filter Sport:</span>
            <select className="input" value={sportFilter} onChange={e => setSportFilter(e.target.value)} style={{ width:160, cursor:'pointer', background:'var(--navy)' }}>
              <option value="">All Sports</option>
              {SPORTS.map(s => <option key={s} value={s} style={{ textTransform:'capitalize' }}>{s}</option>)}
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>Batch Name</th><th>Sport</th><th>Skill</th><th>Time Slot</th><th>Coach</th><th>Venue</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? Array(4).fill(0).map((_,i) => <tr key={i}>{Array(9).fill(0).map((_,j)=><td key={j}><div className="shimmer" style={{ height:16, borderRadius:4 }}/></td>)}</tr>)
                  : batches.length === 0
                    ? <tr><td colSpan={9} style={{ textAlign:'center', color:'var(--text-muted)', padding:32 }}>No batches found. Click "Add Batch" to create one.</td></tr>
                    : batches.map(b => (
                      <tr key={b._id}>
                        <td><div style={{ fontWeight:600, color:'var(--text-main)' }}>{b.name}</div><div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{(b.days||[]).join(', ')}</div></td>
                        <td><span className="badge badge-gold" style={{ textTransform:'capitalize' }}>{b.sport}</span></td>
                        <td style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{b.skillLevel}</td>
                        <td style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{b.timeSlot||'—'}</td>
                        <td style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{b.coachName||'—'}</td>
                        <td style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{b.venue||'—'}</td>
                        <td>
                          <div style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>
                            <span style={{ fontWeight:600, color:'var(--text-main)' }}>{(b.students||[]).length}</span>/{b.capacity}
                          </div>
                        </td>
                        <td><span className={`badge ${b.isActive ? 'badge-green' : 'badge-red'}`}>{b.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td>
                          <div style={{ display:'flex', gap:6 }}>
                            <button onClick={() => openEdit(b)} style={{ background:'none', border:'none', cursor:'pointer', color:'#06b6d4', padding:4 }}><Edit2 size={14}/></button>
                            <button onClick={() => del(b._id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#f87171', padding:4 }}><Trash2 size={14}/></button>
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
          <Modal title={modal === 'add' ? 'Create Batch' : 'Edit Batch'} onClose={() => setModal(null)}>
            <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div><label className="input-label">Batch Name *</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required placeholder="e.g. Batch A – Morning"/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label className="input-label">Sport</label>
                  <select className="input" value={form.sport} onChange={e=>setForm({...form,sport:e.target.value})}>
                    {SPORTS.map(s=><option key={s} value={s} style={{ textTransform:'capitalize' }}>{s}</option>)}
                  </select>
                </div>
                <div><label className="input-label">Skill Level</label>
                  <select className="input" value={form.skillLevel} onChange={e=>setForm({...form,skillLevel:e.target.value})}>
                    {SKILLS.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label className="input-label">Time Slot</label><input className="input" value={form.timeSlot||''} onChange={e=>setForm({...form,timeSlot:e.target.value})} placeholder="6:00 AM – 7:30 AM"/></div>
                <div><label className="input-label">Capacity</label><input className="input" type="number" min={1} value={form.capacity} onChange={e=>setForm({...form,capacity:Number(e.target.value)})}/></div>
              </div>
              <div>
                <label className="input-label">Days</label>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:4 }}>
                  {DAYS_OPT.map(d=>(
                    <button key={d} type="button" onClick={()=>toggleDay(d)} style={{ padding:'4px 12px', borderRadius:20, fontSize:'0.8rem', cursor:'pointer', border:'1px solid var(--border)', background:(form.days||[]).includes(d)?'rgba(6,182,212,0.15)':'var(--card-2)', color:(form.days||[]).includes(d)?'#06b6d4':'var(--text-muted)', fontWeight:(form.days||[]).includes(d)?600:400 }}>{d}</button>
                  ))}
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label className="input-label">Coach Name</label><input className="input" value={form.coachName||''} onChange={e=>setForm({...form,coachName:e.target.value})}/></div>
                <div><label className="input-label">Venue / Court</label><input className="input" value={form.venue||''} onChange={e=>setForm({...form,venue:e.target.value})} placeholder="Court 1"/></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label className="input-label">Start Date</label><input className="input" type="date" value={form.startDate||''} onChange={e=>setForm({...form,startDate:e.target.value})}/></div>
                <div><label className="input-label">End Date</label><input className="input" type="date" value={form.endDate||''} onChange={e=>setForm({...form,endDate:e.target.value})}/></div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input type="checkbox" id="batchActive" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})} />
                <label htmlFor="batchActive" style={{ fontSize:'0.9rem', color:'var(--text-main)', cursor:'pointer' }}>Batch is Active</label>
              </div>
              <div style={{ display:'flex', gap:10, marginTop:4 }}>
                <button type="submit" className="btn-primary" style={{ flex:1, justifyContent:'center' }} disabled={saving}>{saving?'Saving...':modal==='add'?'Create Batch':'Save Changes'}</button>
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
