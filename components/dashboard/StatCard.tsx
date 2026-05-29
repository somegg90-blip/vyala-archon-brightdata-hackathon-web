'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  subLabel?: string;
  icon: LucideIcon;
  accent?: 'amber' | 'red' | 'green' | 'zinc';
  className?: string;
}

const accentMap = {
  amber: {
    iconBg: 'rgba(245,158,11,0.1)',
    iconBorder: 'rgba(245,158,11,0.2)',
    iconColor: '#f59e0b',
    valueColor: 'var(--text-primary)',
    glow: '0 0 30px rgba(245,158,11,0.05)',
  },
  red: {
    iconBg: 'rgba(239,68,68,0.1)',
    iconBorder: 'rgba(239,68,68,0.2)',
    iconColor: '#ef4444',
    valueColor: '#ef4444',
    glow: '0 0 30px rgba(239,68,68,0.05)',
  },
  green: {
    iconBg: 'rgba(34,197,94,0.1)',
    iconBorder: 'rgba(34,197,94,0.2)',
    iconColor: '#22c55e',
    valueColor: '#22c55e',
    glow: '0 0 30px rgba(34,197,94,0.05)',
  },
  zinc: {
    iconBg: 'rgba(113,113,122,0.1)',
    iconBorder: 'rgba(113,113,122,0.2)',
    iconColor: '#71717a',
    valueColor: 'var(--text-primary)',
    glow: 'none',
  },
};

export default function StatCard({
  label,
  value,
  subLabel,
  icon: Icon,
  accent = 'amber',
  className,
}: StatCardProps) {
  const a = accentMap[accent];

  return (
    <div
      className={cn(
        'relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 card-lift',
        className
      )}
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        boxShadow: a.glow,
      }}
    >
      {/* Icon */}
      <div
        className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border"
        style={{ background: a.iconBg, borderColor: a.iconBorder }}
      >
        <Icon size={18} style={{ color: a.iconColor }} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[11px] font-medium mb-0.5"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}
        >
          {label}
        </p>
        <p
          className="text-2xl font-bold tabular-nums leading-none mono"
          style={{ color: a.valueColor }}
        >
          {value}
        </p>
        {subLabel && (
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {subLabel}
          </p>
        )}
      </div>
    </div>
  );
}
