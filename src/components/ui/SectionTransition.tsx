import { motion } from 'framer-motion';

interface SectionTransitionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function SectionTransition({ children, delay = 0, className = '' }: SectionTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
