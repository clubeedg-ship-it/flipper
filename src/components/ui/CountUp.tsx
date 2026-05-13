import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  start?: boolean;
  className?: string;
  formatOptions?: Intl.NumberFormatOptions;
}

export default function CountUp({
  end,
  duration = 800,
  prefix = '',
  suffix = '',
  start = true,
  className = '',
  formatOptions,
}: CountUpProps) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!start) {
      setCurrent(0);
      return;
    }

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);

      setCurrent(Math.round(easedProgress * end));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = undefined;
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, start]);

  const formatted = new Intl.NumberFormat('pt-BR', formatOptions).format(current);

  return (
    <span className={`font-mono ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
