import type { BrandStatus } from '../../data/brands';

const statusStyles: Record<BrandStatus, { bg: string; text: string; dot: string }> = {
  success: { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]', dot: 'bg-[#16A34A]' },
  warning: { bg: 'bg-[#FEF3C7]', text: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]' },
  danger: { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', dot: 'bg-[#DC2626]' },
  neutral: { bg: 'bg-[#F3F4F6]', text: 'text-[#9CA3AF]', dot: 'bg-[#9CA3AF]' },
};

interface BadgeProps {
  status: BrandStatus;
  label: string;
  showDot?: boolean;
}

export default function Badge({ status, label, showDot = true }: BadgeProps) {
  const s = statusStyles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label ${s.bg} ${s.text}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />}
      {label}
    </span>
  );
}
