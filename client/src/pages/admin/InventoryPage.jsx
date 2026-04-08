import { useState, useEffect } from 'react';
import { inventoryAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Menu, Plus, Edit2, Trash2, X, Package, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['shuttlecock', 'racket', 'ball', 'net', 'jersey', 'cone', 'fitness', 'other'];
const EMPTY = { name:'', category:'other', quantity:0, damagedQty:0, lowStockThreshold:5, issuedTo:'', purchasePrice:0, vendor:'', notes:'' };

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

export default function InventoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);

  const load = () => {
    setLoading(true);
    const params = {};
    if (filterCat) params.category = filterCat;
    if (showLowStock) params.lowStock = true;
    
    inventoryAPI.getAll(params).then(r => setItems(r.data)).catch(()=>{}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filterCat, showLowStock]);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (i) => { setForm({ ...i }); setModal(i); };

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'add') await inventoryAPI.create(form);
      else await inventoryAPI.update(modal._id, form);
      toast.success(modal === 'add' ? 'Item added' : 'Item updated');
      setModal(null); load();
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this item?')) return;
    await inventoryAPI.delete(id);
    setItems(x => x.filter(r => r._id !== id));
    toast.success('Item deleted');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-main" style={{ padding:'0 0 60px' }}>
        <div style={{ padding:'16px 28px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:16, background:'var(--navy-2)', position:'sticky', top:0, zIndex:50 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-main)', display:'none' }} id="dash-menu-btn"><Menu size={22}/></button>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'1.2rem', color:'var(--text-main)', display:'flex', alignItems:'center', gap:8 }}><Package size={18}/> Equipment & Inventory</h1>
            <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{items.length} items logged</p>
          </div>
          <button className="btn-primary" onClick={openAdd} style={{ gap:6, padding:'8px 18px', fontSize:'0.85rem' }}><Plus size={15}/> Add Item</button>
        </div>

        <div style={{ padding:28 }}>
          <div className="glass-card" style={{ padding:'14px 18px', borderRadius:14, marginBottom:20, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
            <span style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-muted)' }}>Filter Category:</span>
            <select className="input" value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{ width:160, cursor:'pointer', background:'var(--navy)' }}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c=><option key={c} value={c} style={{ textTransform:'capitalize' }}>{c}</option>)}
            </select>
            <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 8px' }} />
            <button
              onClick={() => setShowLowStock(!showLowStock)}
              style={{
                background: showLowStock ? 'rgba(248, 113, 113, 0.15)' : 'transparent',
                border: showLowStock ? '1px solid #f87171' : '1px solid var(--border)',
                color: showLowStock ? '#f87171' : 'var(--text-muted)',
                padding: '8px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s'
              }}
            >
              <AlertTriangle size={14} /> Low Stock Alerts
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>Item Name</th><th>Category</th><th>Total Qty</th><th>Damaged</th><th>Available</th><th>Issued To</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? Array(5).fill(0).map((_,i) => <tr key={i}>{Array(8).fill(0).map((_,j)=><td key={j}><div className="shimmer" style={{ height:16, borderRadius:4 }}/></td>)}</tr>)
                  : items.length === 0
                    ? <tr><td colSpan={8} style={{ textAlign:'center', color:'var(--text-muted)', padding:32 }}>No inventory items found.</td></tr>
                    : items.map(t => (
                      <tr key={t._id}>
                        <td><div style={{ fontWeight:600, color:'var(--text-main)' }}>{t.name}</div><div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{t.vendor||'—'}</div></td>
                        <td><span className="badge badge-gold" style={{ textTransform:'capitalize' }}>{t.category}</span></td>
                        <td style={{ color:'var(--text-main)', fontSize:'0.85rem', fontWeight:600 }}>{t.quantity}</td>
                        <td style={{ color:'#f87171', fontSize:'0.85rem', fontWeight:600 }}>{t.damagedQty}</td>
                        <td style={{ color:'#34d399', fontSize:'0.85rem', fontWeight:700 }}>{t.availableQty}</td>
                        <td style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{t.issuedTo||'—'}</td>
                        <td>
                          {t.isLowStock
                            ? <span className="badge badge-red" style={{ gap:4 }}><AlertTriangle size={10}/> Low Stock</span>
                            : <span className="badge badge-green">In Stock</span>
                          }
                        </td>
                        <td>
                          <div style={{ display:'flex', gap:6 }}>
                            <button onClick={() => openEdit(t)} style={{ background:'none', border:'none', cursor:'pointer', color:'#06b6d4', padding:4 }}><Edit2 size={14}/></button>
                            <button onClick={() => del(t._id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#f87171', padding:4 }}><Trash2 size={14}/></button>
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
          <Modal title={modal === 'add' ? 'Add Item' : 'Edit Item'} onClose={() => setModal(null)}>
            <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div><label className="input-label">Item Name *</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required placeholder="e.g. Yonex Mavis 350"/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label className="input-label">Category</label>
                  <select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    {CATEGORIES.map(c=><option key={c} value={c} style={{ textTransform:'capitalize' }}>{c}</option>)}
                  </select>
                </div>
                <div><label className="input-label">Issued To / Location</label><input className="input" value={form.issuedTo||''} onChange={e=>setForm({...form,issuedTo:e.target.value})} placeholder="e.g. Coach Raj"/></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                <div><label className="input-label">Total Qty</label><input className="input" type="number" min={0} value={form.quantity} onChange={e=>setForm({...form,quantity:Number(e.target.value)})}/></div>
                <div><label className="input-label">Damaged Qty</label><input className="input" type="number" min={0} value={form.damagedQty} onChange={e=>setForm({...form,damagedQty:Number(e.target.value)})}/></div>
                <div><label className="input-label">Alert Limit</label><input className="input" type="number" min={1} value={form.lowStockThreshold} onChange={e=>setForm({...form,lowStockThreshold:Number(e.target.value)})} title="Warn if stock falls below this"/></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label className="input-label">Vendor/Brand</label><input className="input" value={form.vendor||''} onChange={e=>setForm({...form,vendor:e.target.value})}/></div>
                <div><label className="input-label">Purchase Price (₹)</label><input className="input" type="number" min={0} value={form.purchasePrice} onChange={e=>setForm({...form,purchasePrice:Number(e.target.value)})}/></div>
              </div>
              <div><label className="input-label">Notes</label><textarea className="input" rows={2} value={form.notes||''} onChange={e=>setForm({...form,notes:e.target.value})} style={{ resize:'vertical' }}/></div>
              
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
