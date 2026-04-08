// Shared sport page layout used by Badminton, Skating, Pickleball
// Each page passes its own data config
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock, MapPin } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export function SportPage({ config }) {
  const canvasRef = useRef(null);
  const [galleryOpen, setGalleryOpen] = useState(null);

  // Sport-specific canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const createParticle = () => {
      const p = {};
      p.reset = () => {
        p.x = Math.random() * canvas.width;
        p.y = canvas.height + 40;
        p.size = 12 + Math.random() * 20;
        p.speed = config.particleSpeed + Math.random();
        p.drift = (Math.random() - 0.5) * 0.5;
        p.opacity = 0.1 + Math.random() * 0.2;
        p.rotation = Math.random() * Math.PI * 2;
        p.rotSpeed = (Math.random() - 0.5) * 0.02;
      };
      p.update = () => {
        p.y -= p.speed;
        p.x += p.drift;
        p.rotation += p.rotSpeed;
        if (p.y < -50) p.reset();
      };
      p.draw = () => {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `${p.size}px serif`;
        ctx.fillText(config.particleEmoji, -p.size / 2, p.size / 2);
        ctx.restore();
      };
      p.reset();
      return p;
    };

    const particles = Array.from({ length: 30 }, () => createParticle());
    const animate = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); raf = requestAnimationFrame(animate); };
    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [config]);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="sport-hero" style={{ background: `linear-gradient(135deg, ${config.bgFrom} 0%, ${config.bgTo} 100%)`, overflow: 'hidden', position: 'relative' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,14,26,0.6)', zIndex: 1 }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: 100 }}>
          <div className="badge" style={{ marginBottom: 16, background: `${config.color}15`, color: config.color, border: `1px solid ${config.color}40` }}>
            {config.emoji} {config.badge}
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(48px,8vw,90px)', lineHeight: 0.93, letterSpacing: '0.02em', marginBottom: 20 }}>
            <span style={{ color: 'var(--text-main)' }}>{config.titleLine1}</span><br />
            <span style={{ color: config.color }}>{config.titleLine2}</span>
          </h1>
          <p style={{ color: '#8899aa', maxWidth: 560, lineHeight: 1.7, fontSize: '1rem', marginBottom: 32 }}>{config.heroDesc}</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary">Enroll Now <ArrowRight size={16} /></Link>
            <Link to="/bookings" className="btn-outline">Book a Court</Link>
          </div>
        </div>
      </section>

      {/* INFRASTRUCTURE */}
      <section className="section">
        <div className="container">
          <ScrollReveal style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="badge" style={{ marginBottom: 14, background: `${config.color}15`, color: config.color, border: `1px solid ${config.color}40` }}>Infrastructure</div>
            <h2 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(30px,5vw,52px)', letterSpacing: '0.04em', color: 'var(--text-main)' }}>
              WORLD-CLASS <span style={{ color: config.color }}>FACILITIES</span>
            </h2>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {config.infrastructure.map((item, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="card" style={{ borderTop: `2px solid ${config.color}`, padding: '22px 20px' }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ACADEMY TIE-UPS */}
      <section className="section-sm" style={{ background: 'var(--navy-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <ScrollReveal style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="badge" style={{ marginBottom: 14, background: `${config.color}15`, color: config.color, border: `1px solid ${config.color}40` }}>Academy Tie-Ups</div>
            <h2 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '0.04em', color: 'var(--text-main)' }}>
              OUR <span style={{ color: config.color }}>PARTNERS & AFFILIATIONS</span>
            </h2>
          </ScrollReveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            {config.tieUps.map((partner, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 22px', background: 'var(--card)', borderRadius: 12,
                  border: '1px solid var(--border)', transition: 'all 0.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = config.color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}
                >
                  <span style={{ fontSize: 24 }}>{partner.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>{partner.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{partner.desc}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEES */}
      <section className="section">
        <div className="container">
          <ScrollReveal style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="badge" style={{ marginBottom: 14, background: `${config.color}15`, color: config.color, border: `1px solid ${config.color}40` }}>Fee Structure</div>
            <h2 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(30px,5vw,52px)', letterSpacing: '0.04em', color: 'var(--text-main)' }}>
              TRANSPARENT <span style={{ color: config.color }}>PRICING</span>
            </h2>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>
            {config.fees.map((fee, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="card" style={{ textAlign: 'center', borderTop: fee.popular ? `2px solid ${config.color}` : '1px solid var(--border)', position: 'relative' }}>
                  {fee.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: config.color, color: '#000', fontSize: '0.7rem', fontWeight: 700, padding: '3px 12px', borderRadius: 20 }}>POPULAR</div>}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{fee.label}</div>
                  <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 44, color: config.color, letterSpacing: '0.02em', lineHeight: 1 }}>
                    ₹{fee.price.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16 }}>/{fee.period}</div>
                  <ul style={{ listStyle: 'none', textAlign: 'left' }}>
                    {fee.includes.map((item, j) => (
                      <li key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8, fontSize: '0.85rem', color: '#c8d8e8' }}>
                        <Check size={14} style={{ color: config.color, marginTop: 2, flexShrink: 0 }} /> {item}
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16, background: fee.popular ? `linear-gradient(135deg,${config.color},${config.colorDark})` : 'transparent', color: fee.popular ? '#000' : config.color, border: `1px solid ${config.color}`, padding: '10px' }}>
                    Enroll Now
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TIMINGS */}
      <section className="section-sm" style={{ background: 'var(--navy-2)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 40, alignItems: 'center' }}>
            <ScrollReveal direction="left">
              <div className="badge" style={{ marginBottom: 14, background: `${config.color}15`, color: config.color, border: `1px solid ${config.color}40` }}>
                <Clock size={12} style={{ display: 'inline', marginRight: 4 }} /> Timings
              </div>
              <h2 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: 24 }}>
                TRAINING <span style={{ color: config.color }}>SCHEDULE</span>
              </h2>
              <div className="timeline">
                {config.timings.map((t, i) => (
                  <div key={i} className="timeline-item" style={{ '--tl-color': config.color }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: 2 }}>{t.session}</div>
                    <div style={{ fontSize: '0.88rem', color: config.color, fontWeight: 600 }}>{t.time}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t.days} • {t.level}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="card" style={{ border: `1px solid ${config.color}30` }}>
                <h3 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                  📍 Venue Details
                </h3>
                {[
                  { icon: <MapPin size={14} />, label: 'Address', val: config.venue.address },
                  { icon: '🅿️', label: 'Parking', val: config.venue.parking },
                  { icon: '🚇', label: 'Nearest Metro', val: config.venue.metro },
                  { icon: '📞', label: 'Enquiry', val: config.venue.phone },
                ].map((row, j) => (
                  <div key={j} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                    <span style={{ color: config.color }}>{row.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.label}</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{row.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section">
        <div className="container">
          <ScrollReveal style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="badge" style={{ marginBottom: 14, background: `${config.color}15`, color: config.color, border: `1px solid ${config.color}40` }}>Gallery</div>
            <h2 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(30px,5vw,52px)', letterSpacing: '0.04em', color: 'var(--text-main)' }}>
              THE <span style={{ color: config.color }}>EXPERIENCE</span>
            </h2>
          </ScrollReveal>
          <div className="gallery-grid">
            {config.gallery.map((item, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="gallery-item" onClick={() => setGalleryOpen(i)}>
                  <img src={item.url} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = `https://picsum.photos/seed/${config.id}${i}/400/300`; }} />
                  <div className="gallery-item-overlay">
                    <span style={{ fontSize: 28, color: '#fff' }}>🔍</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {galleryOpen !== null && (
        <div onClick={() => setGalleryOpen(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src={config.gallery[galleryOpen]?.url || `https://picsum.photos/seed/${config.id}${galleryOpen}/800/600`}
            alt="" style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 12 }}
            onError={e => { e.target.src = `https://picsum.photos/seed/${config.id}lg${galleryOpen}/800/600`; }} />
          <button onClick={() => setGalleryOpen(null)} style={{ position: 'fixed', top: 20, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <Footer />
    </>
  );
}
