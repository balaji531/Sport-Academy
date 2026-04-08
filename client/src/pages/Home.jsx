import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Trophy, Users, MapPin, Target, Rocket, Calendar, Clock, Bell, Phone, Mail } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedCounter from '../components/AnimatedCounter';
import TestimonialSlider from '../components/TestimonialSlider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const coachingPrograms = [
  {
    title: 'ATHLETICS (200-METER TRACK & FIELD)',
    desc: 'Develop speed, endurance, and agility with structured training programs.',
    img: 'https://picsum.photos/seed/athletics/400/400',
  },
  {
    title: 'FOOTBALL',
    desc: 'Enhance tactical gameplay, teamwork, and physical fitness with professional coaching.',
    img: 'https://picsum.photos/seed/football/400/400',
  },
  {
    title: 'ARCHERY',
    desc: 'Focus on precision, concentration, and discipline, guided by expert trainers.',
    img: 'https://picsum.photos/seed/archery/400/400',
  },
  {
    title: 'CRICKET',
    desc: 'Train like the pros with expert coaching on batting, bowling, fielding, and fitness.',
    img: 'https://picsum.photos/seed/cricket/400/400',
  },
  {
    title: 'SILAMBAM',
    desc: 'Master this ancient Indian martial art to enhance reflexes and agility.',
    img: 'https://picsum.photos/seed/martial/400/400',
  },
  {
    title: 'YOGA',
    desc: 'Strengthen body and mind with expert-led yoga sessions for flexibility and balance.',
    img: 'https://picsum.photos/seed/yoga/400/400',
  },
  {
    title: 'VOLLEYBALL',
    desc: 'Master the game with professional coaching, skill drills, and match practice for all levels.',
    img: 'https://picsum.photos/seed/volleyball/400/400',
  },
  {
    title: 'ADULT FITNESS PROGRAM (UNISEX)',
    desc: 'Stay fit and strong with our Adult Fitness Program, offering expert-led workouts for all fitness levels in a motivating environment with flexible timings!',
    img: 'https://picsum.photos/seed/fitness/400/400',
  },
];

const announcementsList = [
  { title: 'Admission into Sports Hostel of Excellence', posted: 'Posted 2h ago' },
  { title: 'Admission into Centre of Excellence', posted: 'Posted Yesterday' },
  { title: 'Annual Kit Renewal Process 2026', posted: 'Posted 3 days ago' },
  { title: 'New Sports Physiotherapy Wing Opening', posted: 'Posted 1 week ago' },
  { title: 'Upcoming Parent-Coach Meeting', posted: 'Posted 10 days ago' },
  { title: 'Advanced Skating Masterclass Registration', posted: 'Posted 2 weeks ago' },
];

const eventsList = [
  { year: '2026', title: 'Inter-District Football Championship', date: 'Jul 15 · Main Stadium' },
  { year: '2026', title: 'Summer Coaching Camp-2026', date: 'Aug 01 · All Centers' },
  { year: '2026', title: '3-on-3 Street Basketball Slam', date: 'Sep 10 · Main Stadium' },
  { year: '2026', title: 'National Speed Skating Trials', date: 'Oct 05 · Indoor Rink' },
  { year: '2026', title: 'Junior Athletics Talent Hunt', date: 'Nov 12 · Track & Field' },
  { year: '2026', title: 'Annual Academy Award Night', date: 'Dec 20 · Auditorium' },
];

const stats = [
  { label: 'Students Enrolled', end: 1200, suffix: '+', icon: Users },
  { label: 'Professional Courts', end: 32, suffix: '+', icon: Trophy },
  { label: 'Expert Coaches', end: 48, suffix: '', icon: Shield },
  { label: 'Years of Excellence', end: 9, suffix: '+', icon: Zap },
];

const galleryImages = [
  { src: 'https://picsum.photos/seed/sportgallery1/1400/900', caption: 'Championship Grounds', sub: 'State-of-the-art indoor arenas' },
  { src: 'https://picsum.photos/seed/sportgallery2/1400/900', caption: 'Elite Training Sessions', sub: 'World-class coaching, every day' },
  { src: 'https://picsum.photos/seed/sportgallery3/1400/900', caption: 'Tournament Action', sub: 'Competing at the highest level' },
  { src: 'https://picsum.photos/seed/sportgallery4/1400/900', caption: 'Champions in the Making', sub: 'Nurturing talent from the ground up' },
];

export default function Home() {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const galleryRef = useRef(null);

  // Canvas particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const emojis = ['🏸', '⛸️', '🏓', '🏆', '⭐'];

    // Instead of a class, use a factory function or move it outside if it didn't need closure variables
    const createParticle = () => {
      const p = {};
      p.reset = () => {
        p.x = Math.random() * canvas.width;
        p.y = canvas.height + 40;
        p.size = 14 + Math.random() * 18;
        p.speed = 0.4 + Math.random() * 0.8;
        p.drift = (Math.random() - 0.5) * 0.4;
        p.opacity = 0.15 + Math.random() * 0.2;
        p.rotation = Math.random() * Math.PI * 2;
        p.rotSpeed = (Math.random() - 0.5) * 0.02;
        p.emoji = emojis[Math.floor(Math.random() * emojis.length)];
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
        ctx.fillText(p.emoji, -p.size / 2, p.size / 2);
        ctx.restore();
      };
      p.reset();
      return p;
    };
    const particles = Array.from({ length: 25 }, () => createParticle());
    particles.forEach(p => { p.y = Math.random() * canvas.height; });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  // Parallax on scroll
  useEffect(() => {
    const hero = heroRef.current;
    const onScroll = () => {
      if (!hero) return;
      const y = window.scrollY;
      hero.style.transform = `translateY(${y * 0.3}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Gallery sticky scroll
  useEffect(() => {
    const section = galleryRef.current;
    if (!section) return;
    const imgs = section.querySelectorAll('.gallery-slide');
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const viewH = window.innerHeight;
      // progress: 0 when section top hits viewport top, 1 when section bottom leaves
      const scrolled = -rect.top;
      const total = sectionH - viewH;
      const progress = Math.min(Math.max(scrolled / total, 0), 1);
      const perSlide = 1 / (imgs.length - 1);
      imgs.forEach((img, i) => {
        if (i === 0) { img.style.transform = 'translateX(0%)'; return; }
        const start = perSlide * (i - 1);
        const end = perSlide * i;
        const p = Math.min(Math.max((progress - start) / (end - start), 0), 1);
        const x = 105 - p * 105;
        img.style.transform = `translateX(${x}%)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* TOP STATIC BANNER for Home Page */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 48px', color: 'var(--text-main)'
        }} className="home-top-banner">
          {/* Left: Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,#06b6d4,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue,cursive', fontSize: 22, color: '#000', fontWeight: 700 }}>SF</div>
            <span style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 26, letterSpacing: '0.06em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Sport <span style={{ color: '#06b6d4' }}>Faction</span></span>
          </div>

          {/* Center: Details & Location */}
          <div style={{ textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }} className="home-top-center">
            <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Sport Faction Elite Academy
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-main)', marginTop: 4, opacity: 0.9 }}>
              <MapPin size={14} /> 123 Champion Avenue, Sports District, NY 10001
            </div>
          </div>

          {/* Right: Social Medias */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="home-top-socials">
            {[FaFacebook, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
              <a key={i} href="#" style={{ color: 'var(--text-main)', transition: 'color 0.2s', display: 'flex' }}
                 onMouseEnter={e => e.currentTarget.style.color = '#06b6d4'}
                 onMouseLeave={e => e.currentTarget.style.color = 'var(--text-main)'}
              >
                <Icon size={20} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
              </a>
            ))}
          </div>
        </div>
        {/* Background */}
        <div ref={heroRef} style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 40%, var(--navy-3) 100%)',
        }}>
          <div style={{
            position: 'absolute', top: '-20%', right: '-10%',
            width: '60vw', height: '60vw', borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(6, 182, 212,0.12) 0%,transparent 70%)',
            animation: 'pulse-slow 6s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '-10%', left: '-5%',
            width: '40vw', height: '40vw', borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(0,230,118,0.07) 0%,transparent 70%)',
            animation: 'pulse-slow 8s ease-in-out infinite reverse',
          }} />
        </div>

        {/* Canvas particles */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />

        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
          <div style={{ maxWidth: 720 }}>
            <div className="badge badge-gold" style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span>🏆</span> India's Premier Sports Academy
            </div>

            <h1 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(52px,8vw,100px)', lineHeight: 0.95, marginBottom: 24, letterSpacing: '0.02em' }}>
              <span style={{ color: 'var(--text-main)', display: 'block' }}>FORGE YOUR</span>
              <span style={{ display: 'block' }}>
                <span className="gradient-text">CHAMPION</span>
                <span style={{ color: 'var(--text-main)' }}> SPIRIT</span>
              </span>
            </h1>

            <p style={{ fontSize: 'clamp(16px,2vw,20px)', color: '#8899aa', lineHeight: 1.7, maxWidth: 560, marginBottom: 36 }}>
              World-class training in Badminton, Skating & Pickleball. Expert coaches, professional courts, and a winning culture — all in one place.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 56 }}>
              <Link to="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                Start Training <ArrowRight size={18} />
              </Link>
              <Link to="/bookings" className="btn-outline" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                📅 Book a Court
              </Link>
            </div>

            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[['1200+', 'Students'], ['32+', 'Courts'], ['9+', 'Years']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 28, color: '#06b6d4', letterSpacing: '0.04em' }}>{num}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom,#06b6d4,transparent)', animation: 'scroll-line 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* VISION & MISSION SECTION */}
      <section className="section" style={{ background: 'var(--navy-2)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 32 }}>
            
            {/* Vision */}
            <ScrollReveal direction="up" delay={0}>
              <div className="card" style={{ padding: 40, height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, background: 'radial-gradient(circle,rgba(52,211,153,0.1),transparent 70%)', borderRadius: '50%' }} />
                <Target size={40} style={{ color: '#34d399', marginBottom: 20 }} />
                <h3 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 32, color: 'var(--text-main)', letterSpacing: '0.04em', marginBottom: 16 }}>Our Vision</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8 }}>
                  To be the ultimate breeding ground for world-class athletes, creating an ecosystem where raw talent meets professional-grade infrastructure and expert mentorship. We envision a future where Sport Faction represents the pinnacle of sports excellence globally.
                </p>
              </div>
            </ScrollReveal>

            {/* Mission */}
            <ScrollReveal direction="up" delay={100}>
              <div className="card" style={{ padding: 40, height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, background: 'radial-gradient(circle,rgba(6, 182, 212,0.1),transparent 70%)', borderRadius: '50%' }} />
                <Rocket size={40} style={{ color: '#06b6d4', marginBottom: 20 }} />
                <h3 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 32, color: 'var(--text-main)', letterSpacing: '0.04em', marginBottom: 16 }}>Our Mission</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8 }}>
                  To democratize access to elite-level sports training by providing world-class facilities, certified coaching, and data-driven skill development to players of all ages, cultivating a lifelong passion for sports and a resilient champion’s mindset.
                </p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* FACILITIES GALLERY SECTION */}
      <section className="section">
        <div className="container">
          <ScrollReveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge badge-gold" style={{ marginBottom: 14 }}>Our Facilities</div>
            <h2 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(36px,5vw,60px)', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: 14 }}>
              WORLD-CLASS <span className="gradient-text">GROUNDS</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto', fontSize: '0.95rem' }}>
              Experience elite-level training on our premium surfaces. Built for speed, precision, and championship performance.
            </p>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 32 }}>
            {[
              {
                title: 'Professional Badminton Courts',
                img: '/images/badminton.png',
                stats: ['12 Courts', 'BWF Approved', 'Synthetic Flooring'],
                desc: 'Featuring state-of-the-art shock-absorbent synthetic mats over premium wooden sprung bases to protect athletes while maintaining explosive bounce.',
              },
              {
                title: 'Olympic-Grade Skating Rink',
                img: '/images/skating.png',
                stats: ['Speed Rink', 'ISU Certified', 'Polished Concrete'],
                desc: 'A spectacular, meticulously maintained rink designed for inline speed and figure skating. Optimized for zero friction and max velocity.',
              },
              {
                title: 'Elite Pickleball Arenas',
                img: '/images/pickleball.png',
                stats: ['8 Centers', 'USAPA Standard', 'High Contrast'],
                desc: 'Dedicated high-contrast blue/green surfaces ensuring perfect ball visibility under our bright, stadium-grade overhead lighting systems.',
              },
            ].map((facility, i) => (
              <ScrollReveal direction="up" delay={i * 100} key={facility.title}>
                <div className="card" style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', width: '100%', paddingTop: '65%', overflow: 'hidden' }}>
                    <img src={facility.img} alt={facility.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                  </div>
                  <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>{facility.title}</h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                      {facility.stats.map(s => (
                        <span key={s} style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s}</span>
                      ))}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginTop: 'auto' }}>
                      {facility.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SPORTS COACHING PROGRAMS */}
      <section className="section" style={{ background: 'var(--navy-3)', color: 'var(--text-main)', padding: '80px 0' }}>
        <div className="container">
          <ScrollReveal direction="left" style={{ marginBottom: 50 }}>
            <h2 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(36px,5vw,60px)', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: 14, lineHeight: 1.1 }}>
              <span className="gradient-text">OUR SPORTS</span> COACHING PROGRAMS
            </h2>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '60px 40px' }}>
            {coachingPrograms.map((program, i) => (
              <ScrollReveal direction="up" delay={i * 50} key={program.title}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Circular Image Container */}
                  <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255, 255, 255, 0.7)' }}>
                    <img 
                      src={program.img} 
                      alt={program.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                  
                  {/* Title and Description */}
                  <div style={{ padding: '0 4px' }}>
                    <h3 style={{ fontFamily: 'Inter, sans-serif, system-ui', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.4, minHeight: 40, marginBottom: 8, color: 'var(--text-main)' }}>
                      {program.title}
                    </h3>
                    <p style={{ fontFamily: 'Inter, sans-serif, system-ui', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {program.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS & ANNOUNCEMENTS */}
      {/* EVENTS & ANNOUNCEMENTS TWO-COLUMN VIEW */}
      <section className="section" style={{ background: 'var(--navy)', borderTop: '1px solid var(--border)', padding: '60px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          
          {/* ANNOUNCEMENTS COLUMN */}
          <ScrollReveal direction="left">
            <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 16, display: 'flex', flexDirection: 'column', height: 600 }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 32, color: 'var(--text-main)', letterSpacing: '0.04em', margin: 0 }}>ANNOUNCEMENTS</h3>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }} className="custom-scrollbar">
                {announcementsList.map((item, i) => (
                  <div key={i} style={{ padding: 20, border: '1px solid var(--border)', borderRadius: 12, background: 'rgba(255,255,255,0.02)', transition: 'background 0.2s', cursor: 'pointer' }}
                       onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                       onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: 8, lineHeight: 1.4 }}>
                      {item.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {item.posted} <span style={{ background: '#334155', color: '#fff', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>N</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)' }}>
                <Link to="/announcements" style={{ display: 'block', textAlign: 'center', padding: '12px 0', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s' }}
                   onMouseEnter={e => { e.currentTarget.style.background = '#06b6d4'; e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#000'; }}
                   onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-main)'; }}>
                  View More
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* EVENTS COLUMN */}
          <ScrollReveal direction="right">
            <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', borderRadius: 16, display: 'flex', flexDirection: 'column', height: 600 }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 32, color: 'var(--text-main)', letterSpacing: '0.04em', margin: 0 }}>EVENTS</h3>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }} className="custom-scrollbar">
                {eventsList.map((item, i) => (
                  <div key={i} style={{ padding: 20, border: '1px solid var(--border)', borderRadius: 12, background: 'rgba(255,255,255,0.02)', transition: 'background 0.2s', cursor: 'pointer' }}
                       onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                       onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', display: 'inline-block', padding: '4px 10px', borderRadius: 6, fontFamily: 'Bebas Neue,cursive', fontSize: 16, marginBottom: 12, letterSpacing: '0.04em' }}>
                      {item.year}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: 6, lineHeight: 1.4 }}>
                      {item.title}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {item.date}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)' }}>
                <Link to="/events" style={{ display: 'block', textAlign: 'center', padding: '12px 0', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s' }}
                   onMouseEnter={e => { e.currentTarget.style.background = '#06b6d4'; e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#000'; }}
                   onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-main)'; }}>
                  View More
                </Link>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* STATS SECTION */}
      <section className="section-sm" style={{ background: 'var(--navy-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32 }}>
            {stats.map(({ label, end, suffix, icon: Icon }, i) => (
              <ScrollReveal key={label} delay={i * 80} style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 10 }}>
                  <Icon size={28} style={{ color: '#06b6d4', margin: '0 auto 12px', display: 'block' }} />
                </div>
                <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 48, color: '#06b6d4', lineHeight: 1, letterSpacing: '0.04em' }}>
                  <AnimatedCounter end={end} suffix={suffix} />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section
        ref={galleryRef}
        style={{ height: `${galleryImages.length * 100}vh`, position: 'relative', background: 'var(--navy-2)' }}
      >
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 0', background: 'var(--navy-2)' }}>
          {/* Section Header */}
          <div className="container" style={{ marginBottom: 28 }}>
            <div className="badge badge-gold" style={{ marginBottom: 10 }}>Gallery</div>
            <h2 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(36px,5vw,60px)', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: 0 }}>
              LIFE AT <span className="gradient-text">SPORT FACTION</span>
            </h2>
          </div>

          {/* Image Viewport — constrained */}
          <div className="container" style={{ position: 'relative', height: '60vh', borderRadius: 20, overflow: 'hidden', background: '#000', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
            {galleryImages.map((item, i) => (
              <div
                key={i}
                className="gallery-slide"
                style={{
                  position: 'absolute', inset: 0,
                  transform: i === 0 ? 'translateX(0%)' : 'translateX(105%)',
                  transition: 'transform 0.08s linear',
                  willChange: 'transform',
                }}
              >
                <img src={item.src} alt={item.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                {/* Caption */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '60px 48px 36px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                  <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(22px,3vw,40px)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1 }}>{item.caption}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 6 }}>{item.sub}</div>
                  <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                    {galleryImages.map((_, idx) => (
                      <span key={idx} style={{ display: 'inline-block', width: idx === i ? 28 : 8, height: 6, borderRadius: 4, background: idx === i ? '#06b6d4' : 'rgba(255,255,255,0.3)', transition: 'width 0.3s' }} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 32, alignItems: 'center' }}>
            <ScrollReveal direction="left">
              <div className="badge badge-gold" style={{ marginBottom: 14 }}>Why Sport Faction</div>
              <h2 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(32px,5vw,52px)', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: 20, lineHeight: 1.05 }}>
                BUILT FOR <span className="gradient-text">CHAMPIONS</span> AT EVERY LEVEL
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28, fontSize: '0.95rem' }}>
                From beginners to national-level athletes, we provide the infrastructure, coaching, and competitive exposure to help every player reach their peak.
              </p>
              <Link to="/register" className="btn-primary">Join Us Today <ArrowRight size={16} /></Link>
            </ScrollReveal>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { icon: '🏟️', title: 'Pro Infrastructure', desc: 'Olympic-standard courts and world-class equipment' },
                { icon: '🎓', title: 'Expert Coaches', desc: 'BWF, ISU certified professional trainers' },
                { icon: '🏅', title: 'Tournament Ready', desc: 'Regular state & national-level competitions' },
                { icon: '📱', title: 'Smart Academy', desc: 'Digital tracking, payments & bookings' },
                { icon: '🤝', title: 'Academy Tie-ups', desc: 'Partnered with top national sports bodies' },
                { icon: '👨‍👩‍👧', title: 'All Age Groups', desc: 'Programs for 3 years to 60+ adults' },
              ].map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 80}>
                  <div className="card" style={{ padding: 18 }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{ background: 'var(--navy-2)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <ScrollReveal style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="badge badge-gold" style={{ marginBottom: 14 }}>Testimonials</div>
            <h2 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(32px,5vw,52px)', letterSpacing: '0.04em', color: 'var(--text-main)' }}>
              WHAT OUR <span className="gradient-text">CHAMPIONS</span> SAY
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <TestimonialSlider />
          </ScrollReveal>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="section">
        <div className="container">
          <ScrollReveal>
            <div style={{
              borderRadius: 24,
              background: 'linear-gradient(135deg,#06b6d4 0%,#0891b2 40%,#164e63 100%)',
              padding: 'clamp(40px,6vw,64px)',
              textAlign: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ position: 'absolute', bottom: -60, left: -30, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(32px,5vw,60px)', letterSpacing: '0.04em', color: '#000', marginBottom: 12 }}>
                  READY TO START YOUR JOURNEY?
                </h2>
                <p style={{ color: 'rgba(0,0,0,0.7)', fontSize: '1.05rem', marginBottom: 32 }}>
                   Join 1200+ athletes at Sport Faction. Limited seats available!
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: '#000', color: '#06b6d4', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
                    Enroll Now <ArrowRight size={16} />
                  </Link>
                  <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: 'rgba(0,0,0,0.15)', color: '#000', borderRadius: 10, fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem', border: '1px solid rgba(0,0,0,0.2)' }}>
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOUNDER & CHAIRMAN SECTION */}
      <section className="section" style={{ background: 'var(--navy-2)', borderTop: '1px solid var(--border)', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64, alignItems: 'center' }}>
            
            {/* Left Image Column */}
            <ScrollReveal direction="left">
              <div style={{ position: 'relative' }}>
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: -20, left: -20, width: 100, height: 100, borderLeft: '4px solid #06b6d4', borderTop: '4px solid #06b6d4', zIndex: 1 }} />
                <div style={{ position: 'absolute', bottom: -20, right: -20, width: 100, height: 100, borderRight: '4px solid #06b6d4', borderBottom: '4px solid #06b6d4', zIndex: 1 }} />
                
                {/* Image Container */}
                <div style={{ 
                  borderRadius: 20, 
                  overflow: 'hidden', 
                  boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
                  position: 'relative',
                  background: 'var(--navy)'
                }}>
                  <img 
                    src="/images/founder.png" 
                    alt="Founder & Chairman" 
                    style={{ width: '100%', height: 'auto', display: 'block', filter: 'grayscale(0.2)' }}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(to top, rgba(10,14,26,0.8) 0%, transparent 40%)' 
                  }} />
                  <div style={{ 
                    position: 'absolute', 
                    bottom: 24, 
                    left: 24, 
                    right: 24 
                  }}>
                    <div className="badge badge-gold" style={{ fontSize: '0.7rem' }}>VISIONARY LEADERSHIP</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Content Column */}
            <ScrollReveal direction="right">
              <div>
                <div style={{ color: '#06b6d4', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
                  FOUNDER'S MESSAGE
                </div>
                <h2 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(40px,6vw,72px)', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: 24, lineHeight: 1.05 }}>
                  THE FORCE BEHIND <span className="gradient-text">SPORT FACTION</span>
                </h2>
                
                <div style={{ position: 'relative', paddingLeft: 32, marginBottom: 32 }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: 'linear-gradient(to bottom, #06b6d4, transparent)' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, fontStyle: 'italic' }}>
                    "Our goal is simple: to provide every child with the opportunity to shine, not just on the field, but in life. Sport Faction is more than an academy; it's a family where champions are born through discipline, passion, and world-class guidance."
                  </p>
                </div>

                <div style={{ marginTop: 40 }}>
                  <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 32, color: 'var(--text-main)', letterSpacing: '0.04em' }}>S. VIKRANTH</div>
                  <div style={{ fontSize: '0.85rem', color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginTop: 4 }}>
                    Founder & Chairman, Sport Faction
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 24, marginTop: 48, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 24, color: 'var(--text-main)' }}>15+</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Years Exp.</div>
                  </div>
                  <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 24, color: 'var(--text-main)' }}>5000+</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lives Impacted</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* LOCATION & CONTACT SECTION */}
      <section className="section" style={{ background: 'var(--navy)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48 }}>
              
              {/* Left Column: Contact info */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ color: '#06b6d4', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
                  VISIT US
                </div>
                <h2 style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(36px,5vw,60px)', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: 24, lineHeight: 1.1 }}>
                  OUR <span className="gradient-text">LOCATION</span>
                </h2>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 40 }}>
                  We're located in the heart of the sports district. Come visit our world-class facilities and meet our expert coaching staff today!
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {[
                    { icon: MapPin, title: 'Address', detail: '123 Champion Avenue, Sports District, NY 10001' },
                    { icon: Phone, title: 'Call Us', detail: '+1 (555) 000-1234' },
                    { icon: Mail, title: 'Email', detail: 'info@sportfaction.com' },
                    { icon: Clock, title: 'Hours', detail: 'Mon - Sun | 6:00 AM - 10:00 PM' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(6, 182, 212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <item.icon size={20} style={{ color: '#06b6d4' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{item.title}</div>
                        <div style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 48 }}>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    Get Directions <ArrowRight size={18} />
                  </a>
                </div>
              </div>

              {/* Right Column: Google Maps Embed */}
              <div style={{ position: 'relative', minHeight: 450 }}>
                {/* Decorative frames */}
                <div style={{ position: 'absolute', top: -16, right: -16, width: '100%', height: '100%', border: '1px solid rgba(6, 182, 212,0.2)', borderRadius: 24, zIndex: 0 }} />
                
                <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 24px 60px rgba(0,0,0,0.3)', zIndex: 1 }}>
                  <iframe 
                    title="Academy Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1712086400000!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'grayscale(0.6) invert(0.9) contrast(0.9)' }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes pulse-slow { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes scroll-line { 0%,100%{opacity:0;transform:scaleY(0);transform-origin:top} 50%{opacity:1;transform:scaleY(1)} }
        @media(max-width:768px){
          .home-top-banner { flex-direction: column; gap: 16px; padding: 20px!important; }
          .home-top-center { display: none; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </>
  );
}
