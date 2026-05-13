import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Metric } from '../../data/metrics';
import CountUp from './CountUp';
import GlassCard from './GlassCard';

interface MetricCardProps {
  metric: Metric;
  delay?: number;
  inView?: boolean;
}

export default function MetricCard({ metric, delay = 0, inView = true }: MetricCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const hasBreakdown = metric.breakdown && metric.breakdown.length > 0;

  return (
    <div className="relative">
      <GlassCard
        delay={delay}
        interactive={!!hasBreakdown}
        onClick={hasBreakdown ? () => setShowBreakdown(!showBreakdown) : undefined}
      >
        <p className="font-label text-[#6B7280] mb-2">{metric.label}</p>
        <div className="mb-1">
          {inView && metric.value > 0 ? (
            <CountUp
              end={metric.value}
              prefix="R$ "
              start={inView}
              className="text-[28px] font-bold text-[#111111]"
              formatOptions={{ useGrouping: true }}
            />
          ) : (
            <span className="font-mono text-[28px] font-bold text-[#111111]">{metric.formatted}</span>
          )}
        </div>
        {metric.variation && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: delay + 0.2, duration: 0.3 }}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              metric.variationType === 'success'
                ? 'bg-[#DCFCE7] text-[#16A34A]'
                : metric.variationType === 'warning'
                ? 'bg-[#FEF3C7] text-[#F59E0B]'
                : 'bg-[#F3F4F6] text-[#6B7280]'
            }`}
          >
            {metric.variationType === 'success' && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            )}
            {metric.variation}
          </motion.span>
        )}
        <p className="font-caption text-[#9CA3AF] mt-2">{metric.detail}</p>
      </GlassCard>

      <AnimatePresence>
        {showBreakdown && metric.breakdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 glass rounded-xl p-4 z-20"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}
          >
            {metric.breakdown.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-1.5">
                <span className="font-label text-[#6B7280]">{item.label}</span>
                <span className="font-mono text-sm text-[#111111]">{item.value} <span className="text-[#9CA3AF]">({item.pct})</span></span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
