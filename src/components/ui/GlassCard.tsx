import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  delay?: number;
}

export default function GlassCard({ children, className = '', onClick, interactive = false, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay }}
      whileHover={interactive ? { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)' } : undefined}
      onClick={onClick}
      className={`glass rounded-2xl p-7 ${interactive ? 'cursor-pointer transition-shadow duration-150' : ''} ${className}`}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
