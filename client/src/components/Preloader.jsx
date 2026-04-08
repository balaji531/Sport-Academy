import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Preloader({ onComplete }) {
  useEffect(() => {
    // Total wait time extended for a slower, highly professional cinematic feel
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Elegant Easing Custom Curve (Premium buttery-smooth feel)
  const smoothEase = [0.22, 1, 0.36, 1];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1.4, ease: smoothEase }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#080e14', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
      }}
    >
      {/* Subtle, elegant neon lime ambient glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3, ease: 'easeOut' }}
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '70vw', height: '70vw',
          background: 'radial-gradient(circle, rgba(196,243,68,0.06) 0%, transparent 60%)',
          zIndex: 0
        }}
      />

      {/* Abstract, slow-moving blurred badminton elements acting as ambient dust/light */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden', pointerEvents: 'none' }}>
        <motion.div
          animate={{
            y: ['0vh', '-8vh', '0vh'],
            x: ['0vw', '4vw', '0vw'],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
          style={{ position: 'absolute', top: '20%', left: '20%', fontSize: 90, opacity: 0.04, filter: 'blur(6px)' }}
        >
          🏸
        </motion.div>

        <motion.div
          animate={{
            y: ['0vh', '12vh', '0vh'],
            x: ['0vw', '-6vw', '0vw'],
            rotate: [0, -15, 0]
          }}
          transition={{ duration: 9, ease: 'easeInOut', repeat: Infinity, delay: 1 }}
          style={{ position: 'absolute', top: '55%', right: '15%', fontSize: 110, opacity: 0.03, filter: 'blur(8px)' }}
        >
          🏸
        </motion.div>

        <motion.div
          animate={{
            y: ['0vh', '-15vh', '0vh'],
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity, delay: 0.5 }}
          style={{ position: 'absolute', bottom: '15%', left: '42%', fontSize: 130, opacity: 0.05, filter: 'blur(10px)' }}
        >
          🏸
        </motion.div>
      </div>

      {/* Main Branding - Elegant, Slow Typography Reveal */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Top Intro Text */}
        <motion.div
          initial={{ opacity: 0, y: 15, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.3em' }}
          transition={{ duration: 1.8, ease: smoothEase, delay: 0.4 }}
          style={{
            fontSize: '0.85rem', color: '#8899aa',
            textTransform: 'uppercase', marginBottom: 28, fontWeight: 600
          }}
        >
          Forging Champions
        </motion.div>

        {/* Main Logo Text with synchronized Clip Path style reveals */}
        <div style={{ display: 'flex', gap: 16, overflow: 'hidden', padding: '10px 0' }}>
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 1.4, ease: smoothEase, delay: 1.0 }}
            style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(50px,8vw,100px)', color: 'var(--text-main)', lineHeight: 0.9 }}
          >
            SPORT
          </motion.div>

          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 1.4, ease: smoothEase, delay: 1.2 }}
            style={{ fontFamily: 'Bebas Neue,cursive', fontSize: 'clamp(50px,8vw,100px)', color: '#c4f344', lineHeight: 0.9 }}
          >
            FACTION
          </motion.div>
        </div>

        {/* Ping-Pong Tracker Loading Line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.8 }}
          style={{
            marginTop: 48, width: 240, height: 2,
            background: 'rgba(255, 255, 255, 0.7)', position: 'relative' // No overflow hidden so the paddle can overflow visually
          }}
        >
          {/* Solid Fill Line */}
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.8, ease: 'circOut', delay: 1.8 }}
            style={{
              position: 'absolute', inset: 0,
              background: '#c4f344' // Neon lime fill
            }}
          />

          {/* Badminton Head Tracker */}
          <motion.div
            initial={{ left: '0%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 2.8, ease: 'circOut', delay: 1.8 }}
            style={{
              position: 'absolute', top: -16,
              display: 'flex', alignItems: 'center',
              transform: 'translateX(-50%)' // Keeps it centered right on the leading edge of the fill
            }}
          >
            {/* Swinging Racket */}
            <motion.div
              animate={{ rotate: [-20, 10, -20] }}
              transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: 26, transformOrigin: 'bottom center', zIndex: 2, filter: 'drop-shadow(0 0 8px rgba(196,243,68,0.5))' }}
            >
              🏸
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
}
