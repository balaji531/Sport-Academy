import { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Menu, ClipboardList, Download, Activity, Users, DollarSign, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportsAPI.getSummary().then(r => {
      setSummary(r.data);
      setLoading(false);
    }).catch(()=>{ setLoading(false); });
  }, []);

  const handleExport = async (type) => {
    toast.success(`Exporting ${type} report as CSV...`);
    // In a real implementation we would fetch the data and convert to CSV blob
    // For this UI, we simulate the action as requested
    setTimeout(() => { toast.success(`Export complete`); }, 1500);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-main" style={{ padding:'0 0 60px' }}>
        <div style={{ padding:'16px 28px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:16, background:'var(--navy-2)', position:'sticky', top:0, zIndex:50 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-main)', display:'none' }} id="dash-menu-btn"><Menu size={22}/></button>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'1.2rem', color:'var(--text-main)', display:'flex', alignItems:'center', gap:8 }}><ClipboardList size={18}/> Reports & Analytics</h1>
            <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Export and analyze academy data</p>
          </div>
        </div>

        <div style={{ padding:28 }}>
          
          {/* Master Summary */}
          {!loading && summary && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:20, marginBottom:30 }}>
              <div className="glass-card stat-card" style={{ borderBottom:'3px solid #06b6d4', padding:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:600, marginBottom:4, textTransform:'uppercase' }}>Total Students</div>
                    <div style={{ fontSize:'1.5rem', fontWeight:700, color:'var(--text-main)' }}>{summary.students}</div>
                  </div>
                  <div style={{ padding:8, background:'rgba(6,182,212,0.1)', color:'#06b6d4', borderRadius:10 }}><Users size={20}/></div>
                </div>
              </div>
              
              <div className="glass-card stat-card" style={{ borderBottom:'3px solid #34d399', padding:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:600, marginBottom:4, textTransform:'uppercase' }}>Revenue Collected</div>
                    <div style={{ fontSize:'1.5rem', fontWeight:700, color:'var(--text-main)' }}>₹{(summary.totalFees - summary.pendingFees - summary.overdueFees).toLocaleString()}</div>
                  </div>
                  <div style={{ padding:8, background:'rgba(52,211,153,0.1)', color:'#34d399', borderRadius:10 }}><DollarSign size={20}/></div>
                </div>
              </div>

              <div className="glass-card stat-card" style={{ borderBottom:'3px solid #f87171', padding:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:600, marginBottom:4, textTransform:'uppercase' }}>Overdue Dues</div>
                    <div style={{ fontSize:'1.5rem', fontWeight:700, color:'var(--text-main)' }}>₹{(summary.overdueFees).toLocaleString()}</div>
                  </div>
                  <div style={{ padding:8, background:'rgba(248,113,113,0.1)', color:'#f87171', borderRadius:10 }}><Activity size={20}/></div>
                </div>
              </div>

              <div className="glass-card stat-card" style={{ borderBottom:'3px solid #facc15', padding:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:600, marginBottom:4, textTransform:'uppercase' }}>Active Batches</div>
                    <div style={{ fontSize:'1.5rem', fontWeight:700, color:'var(--text-main)' }}>{summary.activeBatches}</div>
                  </div>
                  <div style={{ padding:8, background:'rgba(250,204,21,0.1)', color:'#facc15', borderRadius:10 }}><Layers size={20}/></div>
                </div>
              </div>
            </div>
          )}

          <h2 style={{ fontSize:'1rem', fontWeight:600, color:'var(--text-main)', marginBottom:16, fontFamily:'Rajdhani,sans-serif' }}>Available Reports</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20 }}>
            
            {[
              { id:'students', name:'Student Master Report', desc:'Complete list of students, parents info, registered sports and skill levels.', icon:Users, color:'#06b6d4' },
              { id:'fees', name:'Fees Collection Report', desc:'Detailed ledger of all payments collected, grouped by date and mode.', icon:DollarSign, color:'#34d399' },
              { id:'dues', name:'Pending & Overdue Report', desc:'List of students with outstanding balances and overdue periods.', icon:Activity, color:'#f87171' },
              { id:'attendance', name:'Attendance Summary', desc:'Monthly attendance percentages per student and batch defaults.', icon:ClipboardList, color:'#facc15' },
              { id:'batches', name:'Batch Utilization', desc:'Capacity vs enrollment metrics for all active training batches.', icon:Layers, color:'#a78bfa' },
            ].map(r => (
              <div key={r.id} className="glass-card" style={{ padding:20, borderRadius:16, borderLeft:`4px solid ${r.color}`, display:'flex', flexDirection:'column' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <r.icon size={18} color={r.color} />
                  <div style={{ fontWeight:700, color:'var(--text-main)', fontSize:'1.05rem' }}>{r.name}</div>
                </div>
                <div style={{ fontSize:'0.85rem', color:'var(--text-muted)', flex:1, marginBottom:16, lineHeight:1.5 }}>{r.desc}</div>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => handleExport(r.id)} className="btn-outline" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, flex:1, fontSize:'0.82rem', padding:'8px 0' }}>
                    <Download size={14}/> Export CSV
                  </button>
                  <button onClick={() => handleExport(`${r.id}-pdf`)} className="btn-primary" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, flex:1, fontSize:'0.82rem', padding:'8px 0' }}>
                    <Download size={14}/> Export PDF
                  </button>
                </div>
              </div>
            ))}

          </div>

        </div>
      </main>
      <style>{`@media(max-width:768px){#dash-menu-btn{display:flex!important;}}`}</style>
    </div>
  );
}
