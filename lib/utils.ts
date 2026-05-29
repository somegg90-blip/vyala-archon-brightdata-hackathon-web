import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatReportId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export function formatTimestamp(): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
}

export function truncatePath(path: string, maxLen = 48): string {
  if (path.length <= maxLen) return path;
  const parts = path.split('/');
  if (parts.length <= 2) return `…${path.slice(-maxLen)}`;
  return `…/${parts.slice(-2).join('/')}`;
}

export function getSeverityConfig(severity: string) {
  switch (severity) {
    case 'CRITICAL':
      return {
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        dot: 'bg-red-400',
        glow: 'shadow-red-500/10',
      };
    case 'HIGH':
      return {
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        dot: 'bg-orange-400',
        glow: 'shadow-orange-500/10',
      };
    case 'MEDIUM':
      return {
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        dot: 'bg-amber-400',
        glow: 'shadow-amber-500/10',
      };
    default:
      return {
        color: 'text-zinc-400',
        bg: 'bg-zinc-500/10',
        border: 'border-zinc-500/20',
        dot: 'bg-zinc-400',
        glow: 'shadow-zinc-500/10',
      };
  }
}

export function getMigrationComplexityConfig(complexity: string | null) {
  switch (complexity) {
    case 'HIGH':
      return { color: 'text-red-400', label: 'High Effort' };
    case 'MEDIUM':
      return { color: 'text-amber-400', label: 'Medium Effort' };
    case 'LOW':
      return { color: 'text-green-400', label: 'Low Effort' };
    default:
      return { color: 'text-zinc-500', label: 'Unknown' };
  }
}
