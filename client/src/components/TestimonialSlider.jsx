import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  { name: 'Arjun Mehta', sport: 'Badminton', avatar: '🏸', rating: 5, text: 'Sport Faction completely transformed my game. The coaches are world-class and the facilities are top-notch. I\'ve improved my ranking significantly in just 6 months!' },
  { name: 'Priya Sharma', sport: 'Skating', avatar: '⛸️', rating: 5, text: 'My daughter has been skating here for 2 years and the progress is unbelievable. Safe environment, professional trainers, and awesome infrastructure.' },
  { name: 'Rohan Gupta', sport: 'Pickleball', avatar: '🏓', rating: 5, text: 'Best pickleball academy in the city. The court booking system is super smooth and the academy tie-ups mean we get to compete at national level events.' },
  { name: 'Kavya Nair', sport: 'Badminton', avatar: '🏸', rating: 5, text: 'Joined as a complete beginner. Within 3 months I was playing in local tournaments. The structured coaching program here is exceptional.' },
  { name: 'Dev Patel', sport: 'Skating', avatar: '⛸️', rating: 5, text: 'Amazing atmosphere, great coaches and the online dashboard to track attendance and fees makes managing everything super easy for parents.' },
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const visible = [
    testimonials[(current - 1 + testimonials.length) % testimonials.length],
    testimonials[current],
    testimonials[(current + 1) % testimonials.length],
  ];

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
        {visible.map((t, i) => (
          <div key={i} style={{
            background: 'var(--card)',
            border: `1px solid ${i === 1 ? 'rgba(6, 182, 212,0.35)' : 'var(--border)'}`,
            borderRadius: 16,
            padding: '28px 24px',
            transition: 'all 0.4s ease',
            transform: i === 1 ? 'scale(1.02)' : 'scale(0.97)',
            opacity: i === 1 ? 1 : 0.65,
          }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {Array(t.rating).fill(0).map((_, i) => <Star key={i} size={14} fill="#06b6d4" color="#06b6d4" />)}
            </div>
            <p style={{ color: '#c8d8e8', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'var(--card-2)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>{t.avatar}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{t.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#06b6d4' }}>{t.sport}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 32 }}>
        <button onClick={prev} style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'var(--card)', border: '1px solid var(--border)',
          cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#06b6d4'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-main)'; }}
        ><ChevronLeft size={18} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{
              width: i === current ? 24 : 8, height: 8, borderRadius: 4,
              background: i === current ? '#06b6d4' : 'var(--border)',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s',
            }} />
          ))}
        </div>
        <button onClick={next} style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'var(--card)', border: '1px solid var(--border)',
          cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#06b6d4'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-main)'; }}
        ><ChevronRight size={18} /></button>
      </div>
    </div>
  );
}
