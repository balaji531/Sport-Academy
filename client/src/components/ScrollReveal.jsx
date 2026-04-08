import { useEffect, useRef } from 'react';

export default function ScrollReveal({ children, className = '', direction = 'up', delay = 0, style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cls = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : 'reveal';
    el.classList.add(cls);
    if (delay) el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('visible');
        observer.disconnect();
      }
    }, { threshold: 0.15 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [direction, delay]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
