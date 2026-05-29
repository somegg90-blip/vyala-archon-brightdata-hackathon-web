import { cn, getSeverityConfig } from '@/lib/utils';

interface BadgeProps {
  severity: string;
  className?: string;
}

export function SeverityBadge({ severity, className }: BadgeProps) {
  const config = getSeverityConfig(severity);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border mono',
        config.bg,
        config.border,
        config.color,
        className
      )}
      style={{ letterSpacing: '0.06em' }}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {severity}
    </span>
  );
}

interface VulnBadgeProps {
  vulnerabilityClass: string;
  className?: string;
}

export function VulnClassBadge({ vulnerabilityClass, className }: VulnBadgeProps) {
  const isShor = vulnerabilityClass === 'SHOR_VULNERABLE';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border mono',
        isShor
          ? 'bg-red-500/8 border-red-500/15 text-red-400/80'
          : 'bg-orange-500/8 border-orange-500/15 text-orange-400/80',
        className
      )}
      style={{ letterSpacing: '0.05em' }}
    >
      {isShor ? '⚛ SHOR' : '◈ GROVER'}
    </span>
  );
}

interface LanguageBadgeProps {
  language: string;
  className?: string;
}

export function LanguageBadge({ language, className }: LanguageBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border mono',
        'bg-zinc-500/8 border-zinc-500/15 text-zinc-400',
        className
      )}
      style={{ letterSpacing: '0.04em' }}
    >
      {language}
    </span>
  );
}

interface AiBadgeProps {
  isEnriched: boolean;
  className?: string;
}

export function AiBadge({ isEnriched, className }: AiBadgeProps) {
  if (!isEnriched) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border',
        'bg-violet-500/8 border-violet-500/15 text-violet-400/80',
        className
      )}
      style={{ letterSpacing: '0.04em' }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
      AI Enriched
    </span>
  );
}
