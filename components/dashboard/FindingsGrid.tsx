'use client';

import { CryptoFinding } from '@/lib/api';
import { sortFindingsBySeverity } from '@/lib/api';
import ThreatCard from '@/components/scan/ThreatCard';
import { CardSkeleton } from '@/components/ui/LoadingSpinner';
import { LayoutGrid, SortAsc } from 'lucide-react';
import { useState } from 'react';

interface FindingsGridProps {
  findings: CryptoFinding[];
  isLoading?: boolean;
  projectName?: string;
  algorithms?: string[];
}

export default function FindingsGrid({
  findings,
  isLoading,
  projectName,
  algorithms = [],
}: FindingsGridProps) {
  const [filter, setFilter] = useState<string>('ALL');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const severityFilters = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'];
  const filtered = filter === 'ALL'
    ? sortFindingsBySeverity(findings)
    : sortFindingsBySeverity(findings.filter((f) => f.severity === filter));

  return (
    <div className="flex flex-col gap-4">
      {/* Grid toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <LayoutGrid size={13} style={{ color: 'var(--text-muted)' }} />
          <span
            className="text-[11px] font-medium mono uppercase"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
          >
            {projectName ? `${projectName} · ` : ''}
            {findings.length} Findings
          </span>
        </div>

        {/* Severity filter */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg border"
          style={{
            background: 'rgba(255,255,255,0.02)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          {severityFilters.map((s) => {
            const isActive = filter === s;
            const colorMap: Record<string, string> = {
              CRITICAL: '#ef4444',
              HIGH: '#f97316',
              MEDIUM: '#f59e0b',
              ALL: 'var(--text-secondary)',
            };
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all duration-150 mono"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                  color: isActive ? colorMap[s] : 'var(--text-muted)',
                  border: isActive ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                  letterSpacing: '0.06em',
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detected algorithms strip */}
      {algorithms.length > 0 && (
        <div
          className="flex flex-wrap items-center gap-2 px-3 py-2.5 rounded-lg border"
          style={{
            background: 'rgba(245,158,11,0.03)',
            borderColor: 'rgba(245,158,11,0.1)',
          }}
        >
          <SortAsc size={12} style={{ color: 'rgba(245,158,11,0.6)' }} />
          <span
            className="text-[10px] font-medium mono"
            style={{ color: 'rgba(245,158,11,0.6)', letterSpacing: '0.06em' }}
          >
            Detected:
          </span>
          {algorithms.map((algo) => (
            <span
              key={algo}
              className="text-[10px] mono px-2 py-0.5 rounded border"
              style={{
                color: 'rgba(245,158,11,0.75)',
                borderColor: 'rgba(245,158,11,0.15)',
                background: 'rgba(245,158,11,0.06)',
              }}
            >
              {algo}
            </span>
          ))}
        </div>
      )}

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div
          className="flex items-center justify-center py-16 rounded-xl border"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No findings match the selected filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((finding, i) => (
            <div key={finding.finding_id} className="animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <ThreatCard finding={finding} index={i} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
