import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Menu, Search, Trash2, Edit2, Plus, X, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const SPORTS = ['badminton', 'skating', 'pickleball', 'multiple', ''];
const EMPTY = { name: '', email: '', phone: '', sport: 'badminton', coachName: '', role: 'coach', password: 'coach@123' };

function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function CoachesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminAPI.getUsers({ search, role: 'coach', page, limit: 15 })
      .then(r => { setUsers(r.data.users); setTotal(r.data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, page]);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (u) => { setForm({ ...u, password: '' }); setModal(u); };

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'add') {
        const { authAPI } = await import('../../services/api');
        await authAPI.register({ ...form, role: 'coach' });
      } else {
        const p = { ...form }; if (!p.password) delete p.password;
        await adminAPI.updateUser(modal._id, p);
      }
      toast.success(modal === 'add' ? 'Coach added' : 'Coach updated');
      setModal(null); load();
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this coach?')) return;
    await adminAPI.deleteUser(id);
    setUsers(u => u.filter(x => x._id !== id));
    toast.success('Deleted');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-main" style={{ padding: '0 0 60px' }}>
        <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, background: 'var(--navy-2)', position: 'sticky', top: 0, zIndex: 50 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'none' }} id="dash-menu-btn"><Menu size={22} /></button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}><UserCheck size={18} /> Coaches & Trainers</h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{total} coaches</p>
          </div>
          <button className="btn-primary" onClick={openAdd} style={{ gap: 6, padding: '8px 18px', fontSize: '0.85rem' }}><Plus size={15} /> Add Coach</button>
        </div>

        <div style={{ padding: 28 }}>
          <div className="glass-card" style={{ padding: '14px 18px', borderRadius: 14, marginBottom: 20, display: 'flex', gap: 12 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" placeholder="Search coaches..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ paddingLeft: 36, background: 'var(--navy)' }} />
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Sport</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? Array(5).fill(0).map((_, i) => <tr key={i}>{Array(6).fill(0).map((_, j) => <td key={j}><div className="shimmer" style={{ height: 16, borderRadius: 4 }} /></td>)}</tr>)
                  : users.length === 0
                    ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No coaches found</td></tr>
                    : users.map(u => (
                      <tr key={u._id}>
                        <td><div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.name}</div></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.email}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.phone || '—'}</td>
                        <td><span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>{u.sport || '—'}</span></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => openEdit(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#06b6d4', padding: 4 }}><Edit2 size={14} /></button>
                            <button onClick={() => del(u._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: 4 }}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{total} coaches</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-outline" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} style={{ padding: '6px 14px', fontSize: '0.82rem', opacity: page===1?0.4:1 }}>Prev</button>
              <button className="btn-outline" onClick={() => setPage(p => p+1)} disabled={users.length<15} style={{ padding: '6px 14px', fontSize: '0.82rem', opacity: users.length<15?0.4:1 }}>Next</button>
            </div>
          </div>
        </div>

        {modal && (
          <Modal title={modal === 'add' ? 'Add Coach' : 'Edit Coach'} onClose={() => setModal(null)}>
            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="input-label">Full Name *</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                <div><label className="input-label">Phone</label><input className="input" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              </div>
              <div><label className="input-label">Email *</label><input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
              {modal === 'add' && <div><label className="input-label">Password *</label><input className="input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} /></div>}
              <div><label className="input-label">Assigned Sport</label>
                <select className="input" value={form.sport} onChange={e => setForm({ ...form, sport: e.target.value })}>
                  {SPORTS.map(s => <option key={s} value={s}>{s || 'None'}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={saving}>{saving ? 'Saving...' : modal === 'add' ? 'Add Coach' : 'Save'}</button>
                <button type="button" className="btn-outline" onClick={() => setModal(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              </div>
            </form>
          </Modal>
        )}
      </main>
      <style>{`@media(max-width:768px){#dash-menu-btn{display:flex!important;}}`}</style>
    </div>
  );
}
