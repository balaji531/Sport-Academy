import { useState, useEffect } from 'react';
import { sportsAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Menu, Plus, Edit2, Trash2, X, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', ageGroup: '', skillLevels: [], feeStructure: 0, duration: '', maxStudents: 30 };

function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

const SKILL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

export default function SportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); sportsAPI.getAll().then(r => setSports(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (s) => { setForm({ ...s }); setModal(s); };

  const toggleSkill = (lvl) => setForm(f => ({
    ...f,
    skillLevels: f.skillLevels.includes(lvl)
      ? f.skillLevels.filter(x => x !== lvl)
      : [...f.skillLevels, lvl],
  }));

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'add') await sportsAPI.create(form);
      else await sportsAPI.update(modal._id, form);
      toast.success(modal === 'add' ? 'Sport created' : 'Sport updated');
      setModal(null); load();
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this sport?')) return;
    await sportsAPI.delete(id);
    setSports(s => s.filter(x => x._id !== id));
    toast.success('Sport deleted');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-main" style={{ padding: '0 0 60px' }}>
        <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, background: 'var(--navy-2)', position: 'sticky', top: 0, zIndex: 50 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'none' }} id="dash-menu-btn"><Menu size={22} /></button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}><Dumbbell size={18} /> Sports / Programs</h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sports.length} sports configured</p>
          </div>
          <button className="btn-primary" onClick={openAdd} style={{ gap: 6, padding: '8px 18px', fontSize: '0.85rem' }}><Plus size={15} /> Add Sport</button>
        </div>

        <div style={{ padding: 28 }}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Sport Name</th><th>Age Group</th><th>Skill Levels</th><th>Monthly Fee</th><th>Duration</th><th>Max Students</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? Array(4).fill(0).map((_, i) => <tr key={i}>{Array(7).fill(0).map((_, j) => <td key={j}><div className="shimmer" style={{ height: 16, borderRadius: 4 }} /></td>)}</tr>)
                  : sports.length === 0
                    ? <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No sports added yet. Click "Add Sport" to get started.</td></tr>
                    : sports.map(s => (
                      <tr key={s._id}>
                        <td><div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{s.name}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.description}</div></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.ageGroup || '—'}</td>
                        <td>{(s.skillLevels || []).map(l => <span key={l} className="badge badge-gold" style={{ marginRight: 4, fontSize: '0.7rem' }}>{l}</span>)}</td>
                        <td style={{ fontWeight: 600, color: '#34d399' }}>₹{(s.feeStructure || 0).toLocaleString()}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.duration || '—'}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.maxStudents}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => openEdit(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#06b6d4', padding: 4 }}><Edit2 size={14} /></button>
                            <button onClick={() => del(s._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: 4 }}><Trash2 size={14} /></button>
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
          <Modal title={modal === 'add' ? 'Add Sport / Program' : 'Edit Sport'} onClose={() => setModal(null)}>
            <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label className="input-label">Sport Name *</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Badminton" /></div>
              <div><label className="input-label">Description</label><textarea className="input" rows={2} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="input-label">Age Group</label><input className="input" value={form.ageGroup || ''} onChange={e => setForm({ ...form, ageGroup: e.target.value })} placeholder="e.g. 6–18 years" /></div>
                <div><label className="input-label">Duration</label><input className="input" value={form.duration || ''} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 3 months" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="input-label">Monthly Fee (₹)</label><input className="input" type="number" min={0} value={form.feeStructure || 0} onChange={e => setForm({ ...form, feeStructure: Number(e.target.value) })} /></div>
                <div><label className="input-label">Max Students</label><input className="input" type="number" min={1} value={form.maxStudents || 30} onChange={e => setForm({ ...form, maxStudents: Number(e.target.value) })} /></div>
              </div>
              <div>
                <label className="input-label">Skill Levels</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                  {SKILL_OPTIONS.map(lvl => (
                    <button key={lvl} type="button" onClick={() => toggleSkill(lvl)} style={{
                      padding: '5px 14px', borderRadius: 20, fontSize: '0.82rem', cursor: 'pointer', border: '1px solid var(--border)',
                      background: (form.skillLevels || []).includes(lvl) ? 'rgba(6,182,212,0.15)' : 'var(--card-2)',
                      color: (form.skillLevels || []).includes(lvl) ? '#06b6d4' : 'var(--text-muted)',
                      fontWeight: (form.skillLevels || []).includes(lvl) ? 600 : 400,
                    }}>{lvl}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={saving}>{saving ? 'Saving...' : modal === 'add' ? 'Create Sport' : 'Save Changes'}</button>
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
