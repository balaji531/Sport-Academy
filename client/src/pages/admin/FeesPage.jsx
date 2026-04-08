import { useState, useEffect } from 'react';
import { feesAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Menu, Plus, Edit2, Trash2, X, DollarSign, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const FEE_TYPES = ['admission', 'monthly', 'quarterly', 'coaching', 'tournament', 'other'];
const STATUSES = ['paid', 'pending', 'overdue', 'partial'];
const MODES = ['cash', 'online', 'upi', 'card', 'cheque'];
const EMPTY = { studentName:'', batch:'', sport:'', feeType:'monthly', dueDate:'', totalAmount:0, paidAmount:0, discount:0, status:'pending', paymentMode:'', paymentDate:'', notes:'' };

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

export default function FeesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({ pendingTotal:0, overdueTotal:0, collectedTotal:0 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    feesAPI.getSummary().then(r => setSummary(r.data)).catch(()=>{});
    feesAPI.getAll({ search, status: statusFilter, page, limit: 15 })
      .then(r => { setFees(r.data.fees); setTotal(r.data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [search, statusFilter, page]);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (f) => { setForm({ ...f, dueDate: f.dueDate?.slice(0,10)||'', paymentDate: f.paymentDate?.slice(0,10)||'' }); setModal(f); };

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'add') await feesAPI.create(form);
      else await feesAPI.update(modal._id, form);
      toast.success(modal === 'add' ? 'Record added' : 'Record updated');
      setModal(null); load();
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this fee record?')) return;
    await feesAPI.delete(id);
    setFees(f => f.filter(x => x._id !== id));
    load();
    toast.success('Record deleted');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-main" style={{ padding:'0 0 60px' }}>
        <div style={{ padding:'16px 28px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:16, background:'var(--navy-2)', position:'sticky', top:0, zIndex:50 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-main)', display:'none' }} id="dash-menu-btn"><Menu size={22}/></button>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'1.2rem', color:'var(--text-main)', display:'flex', alignItems:'center', gap:8 }}><DollarSign size={18}/> Fees & Billing</h1>
            <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{total} records found</p>
          </div>
          <button className="btn-primary" onClick={openAdd} style={{ gap:6, padding:'8px 18px', fontSize:'0.85rem' }}><Plus size={15}/> Collect Fee</button>
        </div>

        <div style={{ padding:28 }}>
          {/* KPI Summary */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:20, marginBottom:24 }}>
            <div className="glass-card stat-card" style={{ borderBottom:'3px solid #34d399' }}>
              <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:600, marginBottom:4, textTransform:'uppercase' }}>Total Collected</div>
              <div style={{ fontSize:'1.5rem', fontWeight:700, color:'var(--text-main)' }}>₹{(summary.collectedTotal||0).toLocaleString()}</div>
            </div>
            <div className="glass-card stat-card" style={{ borderBottom:'3px solid #facc15' }}>
              <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:600, marginBottom:4, textTransform:'uppercase' }}>Pending Fees</div>
              <div style={{ fontSize:'1.5rem', fontWeight:700, color:'var(--text-main)' }}>₹{(summary.pendingTotal||0).toLocaleString()}</div>
            </div>
            <div className="glass-card stat-card" style={{ borderBottom:'3px solid #f87171' }}>
              <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:600, marginBottom:4, textTransform:'uppercase' }}>Overdue Fees</div>
              <div style={{ fontSize:'1.5rem', fontWeight:700, color:'var(--text-main)' }}>₹{(summary.overdueTotal||0).toLocaleString()}</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding:'14px 18px', borderRadius:14, marginBottom:20, display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ position:'relative', flex:1 }}>
              <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
              <input className="input" placeholder="Search by student name..." value={search} onChange={e=>{setSearch(e.target.value); setPage(1);}} style={{ paddingLeft:36, background:'var(--navy)' }} />
            </div>
            <span style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-muted)' }}>Status:</span>
            <select className="input" value={statusFilter} onChange={e=>{setStatusFilter(e.target.value); setPage(1);}} style={{ width:160, cursor:'pointer', background:'var(--navy)' }}>
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s} style={{ textTransform:'capitalize' }}>{s}</option>)}
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>Receipt No.</th><th>Student</th><th>Batch/Sport</th><th>Fee Type</th><th>Due Date</th><th>Total</th><th>Paid</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? Array(5).fill(0).map((_,i) => <tr key={i}>{Array(9).fill(0).map((_,j)=><td key={j}><div className="shimmer" style={{ height:16, borderRadius:4 }}/></td>)}</tr>)
                  : fees.length === 0
                    ? <tr><td colSpan={9} style={{ textAlign:'center', color:'var(--text-muted)', padding:32 }}>No fee records found.</td></tr>
                    : fees.map(f => (
                      <tr key={f._id}>
                        <td><div style={{ fontFamily:'monospace', fontSize:'0.85rem', color:'var(--text-muted)' }}>{f.receiptNo}</div></td>
                        <td><div style={{ fontWeight:600, color:'var(--text-main)' }}>{f.studentName||'—'}</div></td>
                        <td>
                          <div style={{ fontSize:'0.85rem', color:'var(--text-main)' }}>{f.batch||'—'}</div>
                          <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', textTransform:'capitalize' }}>{f.sport||'—'}</div>
                        </td>
                        <td><span className="badge" style={{ background:'var(--navy)', color:'var(--text-muted)', textTransform:'capitalize' }}>{f.feeType}</span></td>
                        <td style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{f.dueDate ? new Date(f.dueDate).toLocaleDateString() : '—'}</td>
                        <td style={{ fontWeight:600, color:'var(--text-main)' }}>₹{f.totalAmount}</td>
                        <td style={{ fontWeight:600, color:'#34d399' }}>₹{f.paidAmount}</td>
                        <td>
                          <span className={`badge ${f.status === 'paid' ? 'badge-green' : f.status === 'overdue' ? 'badge-red' : f.status === 'partial' ? 'badge-gold' : 'badge-gold'}`} style={{ textTransform:'capitalize' }}>
                            {f.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display:'flex', gap:6 }}>
                            <button onClick={() => openEdit(f)} style={{ background:'none', border:'none', cursor:'pointer', color:'#06b6d4', padding:4 }}><Edit2 size={14}/></button>
                            <button onClick={() => del(f._id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#f87171', padding:4 }}><Trash2 size={14}/></button>
                          </div>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14 }}>
            <span style={{ color:'var(--text-muted)', fontSize:'0.82rem' }}>Page {page}</span>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn-outline" onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ padding:'6px 14px', fontSize:'0.82rem', opacity:page===1?0.4:1 }}>Prev</button>
              <button className="btn-outline" onClick={() => setPage(p=>p+1)} disabled={fees.length<15} style={{ padding:'6px 14px', fontSize:'0.82rem', opacity:fees.length<15?0.4:1 }}>Next</button>
            </div>
          </div>
        </div>

        {modal && (
          <Modal title={modal === 'add' ? 'Collect/Record Fee' : 'Edit Fee Record'} onClose={() => setModal(null)}>
            <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label className="input-label">Student Name</label><input className="input" value={form.studentName} onChange={e=>setForm({...form,studentName:e.target.value})} placeholder="Full name (optional if linked)"/></div>
                <div><label className="input-label">Fee Type</label>
                  <select className="input" value={form.feeType} onChange={e=>setForm({...form,feeType:e.target.value})}>
                    {FEE_TYPES.map(t=><option key={t} value={t} style={{ textTransform:'capitalize' }}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label className="input-label">Batch</label><input className="input" value={form.batch||''} onChange={e=>setForm({...form,batch:e.target.value})} placeholder="e.g. Morning A"/></div>
                <div><label className="input-label">Sport</label><input className="input" value={form.sport||''} onChange={e=>setForm({...form,sport:e.target.value})} placeholder="e.g. Badminton"/></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label className="input-label">Total Amount (₹) *</label><input className="input" type="number" min={0} value={form.totalAmount} onChange={e=>setForm({...form,totalAmount:Number(e.target.value)})} required/></div>
                <div><label className="input-label">Paid Amount (₹)</label><input className="input" type="number" min={0} value={form.paidAmount} onChange={e=>setForm({...form,paidAmount:Number(e.target.value)})}/></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label className="input-label">Status</label>
                  <select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                    {STATUSES.map(s=><option key={s} value={s} style={{ textTransform:'capitalize' }}>{s}</option>)}
                  </select>
                </div>
                <div><label className="input-label">Payment Mode</label>
                  <select className="input" value={form.paymentMode} onChange={e=>setForm({...form,paymentMode:e.target.value})}>
                    <option value="">None</option>
                    {MODES.map(m=><option key={m} value={m} style={{ textTransform:'capitalize' }}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label className="input-label">Due Date</label><input className="input" type="date" value={form.dueDate||''} onChange={e=>setForm({...form,dueDate:e.target.value})}/></div>
                <div><label className="input-label">Payment Date</label><input className="input" type="date" value={form.paymentDate||''} onChange={e=>setForm({...form,paymentDate:e.target.value})}/></div>
              </div>
              <div><label className="input-label">Notes</label><textarea className="input" rows={2} value={form.notes||''} onChange={e=>setForm({...form,notes:e.target.value})} style={{ resize:'vertical' }}/></div>
              
              {/* Optional: we simulate student ID for the API if we were linking. In this UI, since it's an additive feature
                  and we might not have a student picker, we let the backend handle raw names or would add a typeahead.
                  For completeness of the visual layout as requested: */}

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
