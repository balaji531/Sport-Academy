import { useState, useEffect } from 'react';
import { attendanceAPI, batchesAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Menu, Calendar, Check, X as XIcon, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AttendancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    batchesAPI.getAll({ isActive: true }).then(r => setBatches(r.data)).catch(()=>{});
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      setLoading(true);
      // Fetch batch details to get enrolled students
      batchesAPI.getById(selectedBatch).then(r => {
        setStudents(r.data.students || []);
        // Initialize attendance state (defaults to present if not marked)
        const init = {};
        (r.data.students || []).forEach(s => init[s._id] = 'present');
        setAttendance(init);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [selectedBatch, date]);

  const toggleStatus = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const markAll = (status) => {
    const next = {};
    students.forEach(s => next[s._id] = status);
    setAttendance(next);
  };

  const save = async () => {
    if (!selectedBatch) return;
    setSaving(true);
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId, status, date, batchId: selectedBatch
      }));
      // In a real app we'd bulk-save here
      await attendanceAPI.mark({ batchId: selectedBatch, date, records });
      toast.success('Attendance saved successfully');
    } catch (e) {
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-main" style={{ padding:'0 0 60px' }}>
        <div style={{ padding:'16px 28px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:16, background:'var(--navy-2)', position:'sticky', top:0, zIndex:50 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-main)', display:'none' }} id="dash-menu-btn"><Menu size={22}/></button>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'1.2rem', color:'var(--text-main)', display:'flex', alignItems:'center', gap:8 }}><Calendar size={18}/> Attendance Management</h1>
            <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Mark daily attendance for batches</p>
          </div>
          <button className="btn-primary" onClick={save} disabled={saving || !selectedBatch} style={{ gap:6, padding:'8px 18px', fontSize:'0.85rem', opacity: (!selectedBatch || saving) ? 0.5 : 1 }}>
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>

        <div style={{ padding:28 }}>
          
          <div className="glass-card" style={{ padding:'18px', borderRadius:16, marginBottom:24, display:'flex', gap:20, alignItems:'flex-end', flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:200 }}>
              <label className="input-label" style={{ marginBottom:6, display:'block' }}>Select Batch</label>
              <select className="input" value={selectedBatch || ''} onChange={e => setSelectedBatch(e.target.value)} style={{ background:'var(--navy)', cursor:'pointer' }}>
                <option value="">-- Choose a Batch --</option>
                {batches.map(b => <option key={b._id} value={b._id}>{b.name} ({b.sport})</option>)}
              </select>
            </div>
            <div style={{ flex:1, minWidth:200 }}>
              <label className="input-label" style={{ marginBottom:6, display:'block' }}>Session Date</label>
              <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} style={{ background:'var(--navy)' }} />
            </div>
          </div>

          {!selectedBatch ? (
            <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)', background:'var(--card)', borderRadius:16, border:'1px solid var(--border)' }}>
              <Calendar size={40} style={{ opacity:0.2, marginBottom:16 }} />
              <div>Select a batch and date to mark attendance</div>
            </div>
          ) : (
            <div className="glass-card" style={{ padding:0, overflow:'hidden', borderRadius:16 }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--navy-2)' }}>
                <div style={{ fontSize:'0.9rem', fontWeight:600, color:'var(--text-main)' }}>Enrolled Students ({students.length})</div>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => markAll('present')} className="btn-outline" style={{ fontSize:'0.75rem', padding:'4px 10px', borderColor:'#34d399', color:'#34d399' }}>Mark All Present</button>
                  <button onClick={() => markAll('absent')} className="btn-outline" style={{ fontSize:'0.75rem', padding:'4px 10px', borderColor:'#f87171', color:'#f87171' }}>Mark All Absent</button>
                </div>
              </div>
              
              <div className="table-wrap" style={{ border:'none', borderRadius:0 }}>
                <table style={{ margin:0 }}>
                  <thead>
                    <tr><th>Student Name</th><th>Student ID</th><th>Fee Status</th><th style={{ textAlign:'right' }}>Attendance Status</th></tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={4} style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>Loading students...</td></tr>
                    ) : students.length === 0 ? (
                      <tr><td colSpan={4} style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>No students enrolled in this batch.</td></tr>
                    ) : (
                      students.map(s => (
                        <tr key={s._id}>
                          <td style={{ fontWeight:600, color:'var(--text-main)' }}>{s.name}</td>
                          <td style={{ color:'var(--text-muted)', fontSize:'0.85rem', fontFamily:'monospace' }}>{s.studentId || '—'}</td>
                          <td><span className={`badge ${s.feeStatus === 'paid' ? 'badge-green' : s.feeStatus==='overdue' ? 'badge-red' : 'badge-gold'}`}>{s.feeStatus||'pending'}</span></td>
                          <td style={{ textAlign:'right' }}>
                            <div style={{ display:'inline-flex', gap:6, background:'var(--navy)', padding:4, borderRadius:20, border:'1px solid var(--border)' }}>
                              <button 
                                onClick={() => toggleStatus(s._id, 'present')}
                                style={{ 
                                  background: attendance[s._id] === 'present' ? '#34d399' : 'transparent',
                                  color: attendance[s._id] === 'present' ? '#000' : 'var(--text-muted)',
                                  border: 'none', borderRadius:16, padding:'4px 12px', fontSize:'0.8rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4, transition:'all 0.2s'
                                }}
                              ><Check size={14}/> Present</button>
                              <button 
                                onClick={() => toggleStatus(s._id, 'absent')}
                                style={{ 
                                  background: attendance[s._id] === 'absent' ? '#f87171' : 'transparent',
                                  color: attendance[s._id] === 'absent' ? '#000' : 'var(--text-muted)',
                                  border: 'none', borderRadius:16, padding:'4px 12px', fontSize:'0.8rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4, transition:'all 0.2s'
                                }}
                              ><XIcon size={14}/> Absent</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
      <style>{`@media(max-width:768px){#dash-menu-btn{display:flex!important;}}`}</style>
    </div>
  );
}
