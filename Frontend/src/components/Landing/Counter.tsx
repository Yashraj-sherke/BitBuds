import React, { useEffect, useRef, useState } from 'react';
import { useInView, usePrefersReducedMotion } from '../../lib/landing-utils';

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const Counter: React.FC<CounterProps> = ({
  value,
  suffix = '',
  duration = 1600,
  className,
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, 0.4);
  const reduced = usePrefersReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, duration]);

  return (
    <span ref={ref} className={className}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
};
