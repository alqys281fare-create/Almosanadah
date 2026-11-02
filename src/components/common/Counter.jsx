import { useEffect, useState } from 'react';
import useInView from '../../hooks/useInView.js';

// Animated count-up that starts when scrolled into view.
export default function Counter({ value = 0, suffix = '', duration = 1800 }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setN(value);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {n.toLocaleString('en-US')}
      {suffix && <span className="counter__suffix">{suffix}</span>}
    </span>
  );
}
