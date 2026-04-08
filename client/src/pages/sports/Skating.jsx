import { SportPage } from './SportPage';

const config = {
  id: 'skating',
  emoji: '⛸️',
  badge: 'Skating Academy',
  color: '#60a5fa',
  colorDark: '#3b82f6',
  bgFrom: '#e0f2fe',
  bgTo: '#f8fafc',
  particleEmoji: '⛸️',
  particleSpeed: 1.8,
  titleLine1: 'SKATING',
  titleLine2: 'MASTERY',
  heroDesc: 'From your first glide to competitive championships — our Olympic-grade rink and ISU-certified coaches will take you there. All disciplines, all ages.',

  infrastructure: [
    { icon: '🧊', title: 'Olympic-Grade Rink', desc: 'Full international-size inline skating rink with Maruhachi Olympic-grade flooring — perfect for speed, figure, and freestyle disciplines.' },
    { icon: '🛡️', title: 'Safety-First Design', desc: 'Premium padded side railing, CCTV monitoring, first-aid station on-site, and certified safety officers at all sessions.' },
    { icon: '🎵', title: 'Sound & Lighting', desc: 'Professional audio system with performance lighting for figure skating showcases and freestyle sessions.' },
    { icon: '🔧', title: 'Equipment Rentals', desc: 'Full range of inline and quad skates available for rental, plus on-site sharpening and repair services.' },
    { icon: '🏋️', title: 'Off-Ice Training', desc: 'Coordinated gym and balance programs designed specifically for skating endurance and technique off the rink.' },
    { icon: '🎖️', title: 'Certified Instructors', desc: 'ISU and Roller Sports Federation-certified coaches with national and international competition experience.' },
  ],

  tieUps: [
    { icon: '🏅', name: 'Roller Sports Federation of India', desc: 'RSFI affiliated center' },
    { icon: '🌍', name: 'World Skate India', desc: 'Official partner' },
    { icon: '🎿', name: 'Maruhachi Flooring', desc: 'Rink technology partner' },
    { icon: '⛸️', name: 'Powerslide Skates', desc: 'Equipment partner' },
    { icon: '🇮🇳', name: 'SAI Recognized', desc: 'Sports Authority of India' },
    { icon: '🏫', name: 'DPS School Network', desc: 'Educational outreach partner' },
  ],

  fees: [
    {
      label: 'Starter', price: 1800, period: 'month', popular: false,
      includes: ['8 sessions/month', 'Rented skates included', 'Group beginner class', 'Safety gear provided', 'Weekend open rink'],
    },
    {
      label: 'Performer', price: 3500, period: 'month', popular: true,
      includes: ['16 sessions/month', 'Personal skating gear', 'Certified coach (group)', 'Off-ice gym access', 'Competition prep', 'Video review sessions'],
    },
    {
      label: 'Champion', price: 7000, period: 'month', popular: false,
      includes: ['Unlimited sessions', '1-on-1 personal coach', 'Full equipment set', 'National meet entries', 'Strength & conditioning', 'Nutrition guidance'],
    },
  ],

  timings: [
    { session: 'Early Morning Rink', time: '5:00 AM – 7:00 AM', days: 'Mon–Sat', level: 'Advanced / Solo Practice' },
    { session: 'Toddler Batch', time: '9:00 AM – 10:00 AM', days: 'Tue, Thu, Sat', level: 'Age 3–6' },
    { session: 'Kids Batch', time: '10:00 AM – 11:30 AM', days: 'Mon, Wed, Fri', level: 'Age 7–14' },
    { session: 'Evening Batch', time: '4:30 PM – 7:30 PM', days: 'Mon–Fri', level: 'All Levels' },
    { session: 'Adult Batch', time: '7:30 PM – 9:00 PM', days: 'Mon, Wed, Fri', level: 'Adults 18+' },
  ],

  venue: {
    address: 'Sport Faction Skating Wing, Block B, Sector 18, Noida',
    parking: 'Shared parking with main complex (200 spots)',
    metro: 'Sector 18 Metro (Blue Line) – 3 min walk',
    phone: '+91 98765 43211',
  },

  gallery: [
    { url: 'https://images.unsplash.com/photo-1587460924747-d1fdf5f7d3d0?w=600&q=80', alt: 'Skating rink' },
    { url: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&q=80', alt: 'Figure skater' },
    { url: 'https://images.unsplash.com/photo-1559829604-3c07ba0040c5?w=600&q=80', alt: 'Speed skating' },
    { url: 'https://images.unsplash.com/photo-1574940733163-be9b49a59ebe?w=600&q=80', alt: 'Inline skating' },
    { url: 'https://images.unsplash.com/photo-1620126811015-1cb266f38d73?w=600&q=80', alt: 'Kids class' },
    { url: 'https://images.unsplash.com/photo-1594737626072-90dc274bc2bd?w=600&q=80', alt: 'Skating jump' },
  ],
};

export default function Skating() {
  return <SportPage config={config} />;
}
