import { useEffect, useRef, useState } from 'react';

export function useInView(options?: IntersectionObserverInit & { once?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options?.once !== false) {
            observer.unobserve(el);
          }
        } else if (options?.once === false) {
          setIsInView(false);
        }
      },
      { threshold: options?.threshold ?? 0.15, rootMargin: options?.rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin, options?.once]);

  return { ref, isInView };
}
