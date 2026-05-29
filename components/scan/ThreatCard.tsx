'use client';

import { CryptoFinding } from '@/lib/api';
import { SeverityBadge, VulnClassBadge, LanguageBadge, AiBadge } from '@/components/ui/Badge';
import { getMigrationComplexityConfig, truncatePath } from '@/lib/utils';
import { FileCode2, MapPin, ArrowRight, Atom, Zap } from 'lucide-react';

interface ThreatCardProps {
  finding: CryptoFinding;
  index?: number;
}

export default function ThreatCard({ finding, index = 0 }: ThreatCardProps) {
  const isShor = finding.vulnerability_class === 'SHOR_VULNERABLE';
  const migration = getMigrationComplexityConfig(finding.migration_complexity);

  const borderColor = isShor
    ? 'rgba(239, 68, 68, 0.35)'
    : 'rgba(249, 115, 22, 0.25)';

  const glowColor = isShor
    ? 'rgba(239, 68, 68, 0.04)'
    : 'rgba(249, 115, 22, 0.03)';

  const accentColor = isShor ? '#ef4444' : '#f97316';

  return (
    <div
      className="group relative flex flex-col rounded-xl border overflow-hidden transition-all duration-250 card-lift"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        borderLeftWidth: '3px',
        borderLeftColor: borderColor,
        animationDelay: `${index * 0.05}s`,
        boxShadow: `0 2px 20px ${glowColor}, inset 0 0 40px ${glowColor}`,
      }}
    >
      {/* Subtle gradient top bar */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, ${accentColor}30 0%, transparent 60%)`,
        }}
      />

      <div className="p-5 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Algorithm name — most prominent */}
            <div className="flex items-center gap-2 mb-1.5">
              {isShor ? (
                <Atom size={15} style={{ color: '#ef4444', opacity: 0.8 }} strokeWidth={1.8} />
              ) : (
                <Zap size={15} style={{ color: '#f97316', opacity: 0.8 }} strokeWidth={1.8} />
              )}
              <h3
                className="text-base font-bold mono tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {finding.algorithm_detected}
              </h3>
            </div>

            {/* File path */}
            <div className="flex items-center gap-1.5">
              <FileCode2 size={11} style={{ color: 'var(--text-muted)' }} />
              <span
                className="text-[11px] mono truncate"
                style={{ color: 'var(--text-muted)' }}
                title={finding.file_path}
              >
                {truncatePath(finding.file_path)}
              </span>
            </div>
          </div>

          {/* Severity badge */}
          <SeverityBadge severity={finding.severity} />
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5">
          <VulnClassBadge vulnerabilityClass={finding.vulnerability_class} />
          <LanguageBadge language={finding.language} />
          <AiBadge isEnriched={finding.is_ai_enriched} />
        </div>

        {/* Location */}
        <div
          className="flex items-center gap-1.5 text-[11px] mono"
          style={{ color: 'var(--text-muted)' }}
        >
          <MapPin size={11} />
          <span>
            Line {finding.line_number}
            {finding.location.column_start !== null && (
              <>, col {finding.location.column_start}</>
            )}
          </span>
          {finding.usage_context && (
            <>
              <span className="mx-1" style={{ color: 'var(--border-default)' }}>·</span>
              <span className="truncate" style={{ color: 'var(--text-muted)' }}>
                {finding.usage_context}
              </span>
            </>
          )}
        </div>

        {/* Code snippet */}
        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Line number gutter */}
          <div
            className="absolute left-0 top-0 bottom-0 w-10 flex items-start justify-end pr-2 pt-3"
            style={{
              borderRight: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(0,0,0,0.2)',
            }}
          >
            <span
              className="text-[10px] mono select-none"
              style={{ color: 'var(--text-muted)' }}
            >
              {finding.line_number}
            </span>
          </div>

          <pre
            className="pl-14 pr-4 py-3 text-[11px] mono overflow-x-auto"
            style={{
              color: 'rgba(240,246,252,0.75)',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            <code>{finding.code_snippet}</code>
          </pre>
        </div>

        {/* PQC Replacement */}
        <div
          className="flex items-start gap-2.5 pt-1 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <ArrowRight
            size={13}
            className="mt-0.5 shrink-0"
            style={{ color: finding.pqc_replacement ? 'var(--amber)' : 'var(--text-muted)' }}
          />
          <div className="flex-1 min-w-0">
            <span
              className="text-[10px] font-medium uppercase"
              style={{ color: 'var(--text-muted)', letterSpacing: '0.07em' }}
            >
              PQC Replacement
            </span>
            {finding.pqc_replacement ? (
              <p
                className="text-xs font-semibold mono mt-0.5"
                style={{ color: 'var(--amber)' }}
              >
                {finding.pqc_replacement}
              </p>
            ) : (
              <p
                className="text-xs mono mt-0.5 italic"
                style={{ color: 'var(--text-muted)' }}
              >
                Pending AI Oracle…
              </p>
            )}
          </div>

          {/* Migration complexity pill */}
          {finding.migration_complexity && (
            <span
              className="shrink-0 text-[10px] font-medium mono px-1.5 py-0.5 rounded"
              style={{
                color: migration.color,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {migration.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
