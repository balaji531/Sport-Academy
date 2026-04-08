import { SportPage } from './SportPage';

const config = {
  id: 'pickleball',
  emoji: '🏓',
  badge: 'Pickleball Academy',
  color: '#34d399',
  colorDark: '#059669',
  bgFrom: '#d1fae5',
  bgTo: '#f8fafc',
  particleEmoji: '🏓',
  particleSpeed: 1.5,
  titleLine1: 'PICKLEBALL',
  titleLine2: 'CHAMPIONS',
  heroDesc: "India's fastest-growing sport. 8 dedicated professional courts, nationally ranked coaches, and a buzzing community. Your game starts here.",

  infrastructure: [
    { icon: '🏟️', title: '8 Professional Courts', desc: 'IFP-approved cushioned court surfaces with official 44ft x 20ft dimensions, professional nets, and tournament lighting.' },
    { icon: '🎯', title: 'Strategy Rooms', desc: 'Video analysis suites and whiteboard strategy rooms for in-depth game planning and doubles coordination.' },
    { icon: '🛒', title: 'Pro Shop', desc: 'Full-range pro shop stocking Franklin, Selkirk, Joola, and Engage paddles plus official pickleball balls.' },
    { icon: '🏋️', title: 'Agility Training', desc: 'Sport-specific agility ladders, reaction courts, and conditioning zones for pickleball athleticism.' },
    { icon: '📹', title: 'Live Court Streaming', desc: 'All courts equipped with 4K cameras for live match reviews and remote coaching support.' },
    { icon: '🤝', title: 'Member Lounge', desc: 'Exclusive members lounge with seating, TV, and networking space for the Noida pickleball community.' },
  ],

  tieUps: [
    { icon: '🌍', name: 'International Federation of Pickleball', desc: 'IFP affiliate' },
    { icon: '🇮🇳', name: 'Pickleball Federation of India', desc: 'PFI recognized academy' },
    { icon: '🏅', name: 'Selkirk Sport', desc: 'Official paddle partner' },
    { icon: '⚡', name: 'Franklin Sports', desc: 'Ball & equipment partner' },
    { icon: '🎓', name: 'AIPA Certified', desc: 'American Institute of Pickleball' },
    { icon: '🏫', name: 'Corporate Wellness', desc: 'Partnered with top MNCs' },
  ],

  fees: [
    {
      label: 'Rookie', price: 2000, period: 'month', popular: false,
      includes: ['8 sessions/month', 'Paddle rental included', 'Group beginner coaching', 'Court access (weekends)', 'Learn-to-play clinic'],
    },
    {
      label: 'Competitor', price: 3800, period: 'month', popular: true,
      includes: ['16 sessions/month', 'Personal paddle kit', 'Certified group coach', 'Full court access', 'Tournament entries', 'Strategy video sessions'],
    },
    {
      label: 'Pro Circuit', price: 6500, period: 'month', popular: false,
      includes: ['Unlimited sessions', '1-on-1 national coach', 'Premium equipment set', 'National circuit entries', 'Sports science support', 'Doubles pairing program'],
    },
  ],

  timings: [
    { session: 'Morning Grind', time: '5:30 AM – 7:30 AM', days: 'Mon–Sat', level: 'Competitive / Intermediate' },
    { session: 'Learn & Play', time: '9:00 AM – 10:30 AM', days: 'Tue, Thu, Sat', level: 'Absolute Beginners' },
    { session: 'Lunch Smash', time: '12:00 PM – 2:00 PM', days: 'Mon–Fri', level: 'Recreational / Corporates' },
    { session: 'Evening Battle', time: '5:00 PM – 8:30 PM', days: 'Mon–Fri', level: 'All Levels' },
    { session: 'Weekend Warriors', time: '6:00 AM – 12:00 PM', days: 'Sat & Sun', level: 'All Levels Open Play' },
  ],

  venue: {
    address: 'Sport Faction Pickleball Wing, Sector 18, Noida, UP',
    parking: 'Dedicated 80-spot pickleball parking lot',
    metro: 'Sector 18 Metro (Blue Line) – 2 min walk',
    phone: '+91 98765 43212',
  },

  gallery: [
    { url: 'https://images.unsplash.com/photo-1654722358135-6564b3a1a088?w=600&q=80', alt: 'Pickleball court' },
    { url: 'https://images.unsplash.com/photo-1657654566177-92c4157c64f3?w=600&q=80', alt: 'Pickleball match' },
    { url: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?w=600&q=80', alt: 'Double match' },
    { url: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80', alt: 'Coach session' },
    { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', alt: 'Training' },
    { url: 'https://images.unsplash.com/photo-1620126811015-1cb266f38d73?w=600&q=80', alt: 'Tournament' },
  ],
};

export default function Pickleball() {
  return <SportPage config={config} />;
}
