import { SportPage } from './SportPage';

const config = {
  id: 'badminton',
  emoji: '🏸',
  badge: 'Badminton Academy',
  color: '#06b6d4',
  colorDark: '#0891b2',
  bgFrom: '#fdf4ea',
  bgTo: '#f8fafc',
  particleEmoji: '🏸',
  particleSpeed: 1.2,
  titleLine1: 'BADMINTON',
  titleLine2: 'EXCELLENCE',
  heroDesc: 'Train on 12 professional BWF-standard courts with Olympic-certified coaches. From beginners to state champions — we build winners at every level.',

  infrastructure: [
    { icon: '🏟️', title: '12 Professional Courts', desc: 'BWF-approved synthetic wooden flooring with international shuttle speed markings and professional lighting at 500 lux.' },
    { icon: '💡', title: 'LED Lighting (500 Lux)', desc: 'Anti-glare LED lighting system ensuring perfect visibility for both training and competitive play.' },
    { icon: '🪟', title: 'Synthetic Flooring', desc: 'Enlio or Yonex-standard imported courts reducing injury risk and providing optimal bounce.' },
    { icon: '🎯', title: 'Video Analysis Studio', desc: 'Dedicated room with high-speed cameras for detailed stroke analysis and technique improvement.' },
    { icon: '🧘', title: 'Gymnasium & Fitness', desc: 'Fully equipped strength and conditioning gym with badminton-specific training protocols.' },
    { icon: '🚿', title: 'Change Rooms & Café', desc: 'Premium changing facilities, lockers, and an in-house sports café for nutrition support.' },
  ],

  tieUps: [
    { icon: '🏅', name: 'Badminton World Federation', desc: 'BWF affiliated academy' },
    { icon: '🇮🇳', name: 'Badminton Association of India', desc: 'BAI recognized training center' },
    { icon: '🏆', name: 'Yonex India', desc: 'Official equipment partner' },
    { icon: '🎓', name: 'Gopichand Academy', desc: 'Coaching methodology partner' },
    { icon: '⚡', name: 'Li-Ning Sports', desc: 'Official apparel partner' },
    { icon: '🏫', name: 'State Sports Authority', desc: 'State government recognized' },
  ],

  fees: [
    {
      label: 'Beginner', price: 2500, period: 'month', popular: false,
      includes: ['8 sessions/month', 'Basic shuttle supply', 'Beginner coaching', 'Court access (6AM-8AM)', 'Group training'],
    },
    {
      label: 'Intermediate', price: 4500, period: 'month', popular: true,
      includes: ['16 sessions/month', 'Shuttle supply included', 'Certified coach', 'Open court access', 'Video analysis', 'Tournament entries'],
    },
    {
      label: 'Elite', price: 8000, period: 'month', popular: false,
      includes: ['Unlimited sessions', 'Personal coach (1-on-1)', 'All equipment provided', '24hr court access', 'National tournament prep', 'Gym & fitness included'],
    },
  ],

  timings: [
    { session: 'Morning Batch', time: '5:30 AM – 8:00 AM', days: 'Mon–Sat', level: 'All Levels' },
    { session: 'Kids Batch', time: '9:00 AM – 10:30 AM', days: 'Mon, Wed, Fri', level: 'Age 5–12' },
    { session: 'Afternoon Batch', time: '2:00 PM – 4:00 PM', days: 'Tue, Thu, Sat', level: 'Intermediate' },
    { session: 'Evening Batch', time: '5:00 PM – 8:00 PM', days: 'Mon–Fri', level: 'All Levels' },
    { session: 'Weekend Batch', time: '7:00 AM – 12:00 PM', days: 'Sat & Sun', level: 'Competitive' },
  ],

  venue: {
    address: 'Sport Faction Complex, Sector 18, Noida, UP 201301',
    parking: 'Free basement parking for 200 vehicles',
    metro: 'Sector 18 Metro (Blue Line) – 2 min walk',
    phone: '+91 98765 43210',
  },

  gallery: [
    { url: 'https://images.unsplash.com/photo-1599474924187-334a4ae5149f?w=600&q=80', alt: 'Badminton court' },
    { url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80', alt: 'Player training' },
    { url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80', alt: 'Tournament match' },
    { url: 'https://images.unsplash.com/photo-1616877209476-25f0ccf44b9c?w=600&q=80', alt: 'Court view' },
    { url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&q=80', alt: 'Coaching session' },
    { url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&q=80', alt: 'Kids training' },
  ],
};

export default function Badminton() {
  return <SportPage config={config} />;
}
