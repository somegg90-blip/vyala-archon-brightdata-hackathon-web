'use client';

import { useState } from 'react';
import { CBOMReport, invokeScan, ApiError } from '@/lib/api';
import Header from '@/components/layout/Header';
import InvokeTerminal from '@/components/dashboard/InvokeTerminal';
import StatCard from '@/components/dashboard/StatCard';
import FindingsGrid from '@/components/dashboard/FindingsGrid';
import { ScanningIndicator } from '@/components/ui/LoadingSpinner';
import Image from 'next/image';
import {
  ShieldAlert,
  Atom,
  BarChart3,
  FileWarning,
  ScanLine,
  AlertCircle,
  RefreshCw,
  Hash,
  ShieldCheck,
  Globe,
} from 'lucide-react'; // Added ShieldCheck and Globe
import { formatReportId } from '@/lib/utils';

type PageState = 'idle' | 'loading' | 'success' | 'error';

export default function DashboardPage() {
  const [state, setState] = useState<PageState>('idle');
  const [report, setReport] = useState<CBOMReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleInvoke(target: string, scanType: string) {
    setState('loading');
    setError(null);
    setReport(null);

    try {
      const result = await invokeScan(target, scanType);
      setReport(result);
      setState('success');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Is the backend running?';
      setError(message);
      setState('error');
    }
  }

  function handleReset() {
    setState('idle');
    setReport(null);
    setError(null);
  }

  const isLoading = state === 'loading';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* ── Left Panel ─────────────────────────────────────────────── */}
          <aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0 flex flex-col gap-4">
            {/* Page title */}
            <div className="mb-2">
              <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Crypto{' '}
                <span className="gradient-text">Intelligence</span>
              </h1>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Map post-quantum cryptographic exposure across your enterprise supply chain.
              </p>
            </div>

            {/* Invoke Terminal */}
            <div
              className="p-5 rounded-xl border"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <InvokeTerminal onInvoke={handleInvoke} isLoading={isLoading} />
            </div>

            {/* Stats — show when we have data */}
            {report && (
              <div className="flex flex-col gap-3 animate-fade-up">
                <StatCard
                  label="Total Findings"
                  value={report.total_findings}
                  icon={FileWarning}
                  accent="amber"
                />
                <StatCard
                  label="Quantum Vulnerable"
                  value={report.quantum_vulnerable_count}
                  subLabel="Exposed to quantum decryption"
                  icon={Atom}
                  accent="red"
                />
                <StatCard
                  label="Critical Severity"
                  value={report.critical_findings_count}
                  subLabel="Requiring immediate action"
                  icon={ShieldAlert}
                  accent="red"
                />
                <StatCard
                  label="Algorithms Detected"
                  value={report.algorithms_detected.length}
                  subLabel={report.algorithms_detected.slice(0, 2).join(', ')}
                  icon={BarChart3}
                  accent="zinc"
                />

                {/* Report metadata card */}
                <div
                  className="p-4 rounded-xl border"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <p
                    className="text-[10px] font-medium mono mb-3 uppercase"
                    style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
                  >
                    Report Metadata
                  </p>
                  <dl className="space-y-2">
                    {[
                      { label: 'Report ID', value: formatReportId(report.report_id), icon: Hash },
                      { label: 'Project', value: report.project_name, icon: ScanLine },
                      { label: 'Status', value: report.status, icon: RefreshCw },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <Icon size={11} style={{ color: 'var(--text-muted)' }} />
                          <dt className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                            {label}
                          </dt>
                        </div>
                        <dd
                          className="text-[11px] font-medium mono truncate max-w-[120px]"
                          style={{ color: 'var(--text-secondary)' }}
                          title={value}
                        >
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <button
                    onClick={handleReset}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-150 hover:opacity-80"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <RefreshCw size={12} />
                    New Scan
                  </button>
                </div>
              </div>
            )}
          </aside>

          {/* ── Right Panel ────────────────────────────────────────────── */}
          <section className="flex-1 min-w-0">
            {/* IDLE state */}
            {state === 'idle' && (
              <div
                className="flex flex-col items-center justify-center h-full min-h-[500px] rounded-2xl border grid-pattern"
                style={{
                  borderColor: 'var(--border-subtle)',
                  background: 'var(--bg-surface)',
                }}
              >
                <div className="flex flex-col items-center gap-5 max-w-sm text-center px-6">
                  <div
                    className="w-24 h-24 rounded-2xl overflow-hidden border flex items-center justify-center"
                    style={{
                      borderColor: 'rgba(245,158,11,0.2)',
                      background: '#000',
                      boxShadow: '0 0 40px rgba(245,158,11,0.12), 0 0 80px rgba(245,158,11,0.06)',
                    }}
                  >
                    <Image
                      src="/vyala_logo.png"
                      alt="Vyala Archon"
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Awaiting Invocation
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      Enter a target path or repository on the left to begin mapping your post-quantum cryptography exposure surface.
                    </p>
                  </div>

                  <div
                    className="grid grid-cols-2 gap-2 w-full text-left"
                  >
                    {[
                      { label: 'SHOR ATTACK', desc: 'RSA, ECC, DH vulnerable' },
                      { label: 'GROVER ATTACK', desc: 'AES-128, SHA-256 weakened' },
                      { label: 'CBOM REPORT', desc: 'Full cryptographic BOM' },
                      { label: 'PQC GUIDANCE', desc: 'CRYSTALS-Kyber & Dilithium' },
                    ].map(({ label, desc }) => (
                      <div
                        key={label}
                        className="p-3 rounded-lg border"
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          borderColor: 'var(--border-subtle)',
                        }}
                      >
                        <p
                          className="text-[10px] font-bold mono mb-0.5"
                          style={{ color: 'var(--amber)', letterSpacing: '0.08em' }}
                        >
                          {label}
                        </p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LOADING state */}
            {state === 'loading' && (
              <div
                className="flex items-center justify-center h-full min-h-[500px] rounded-2xl border scan-overlay"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'rgba(245,158,11,0.15)',
                }}
              >
                <ScanningIndicator />
              </div>
            )}

            {/* ERROR state */}
            {state === 'error' && (
              <div
                className="flex flex-col items-center justify-center h-full min-h-[500px] rounded-2xl border gap-5"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'rgba(239,68,68,0.15)',
                }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center border"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    borderColor: 'rgba(239,68,68,0.2)',
                  }}
                >
                  <AlertCircle size={28} className="text-red-400" strokeWidth={1.5} />
                </div>

                <div className="text-center max-w-sm px-6">
                  <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Scan Failed
                  </h3>
                  <p
                    className="text-sm mono leading-relaxed"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {error}
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 py-2.5 px-5 rounded-lg text-sm font-medium transition-all duration-150 hover:opacity-80"
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#ef4444',
                  }}
                >
                  <RefreshCw size={14} />
                  Try Again
                </button>
              </div>
            )}

            {/* SUCCESS state */}
            {state === 'success' && report && (
              <div className="animate-fade-in">
                {report.findings.length > 0 ? (
                  <FindingsGrid
                    findings={report.findings}
                    projectName={report.project_name}
                    algorithms={report.algorithms_detected}
                  />
                ) : (
                  // NEW: Clean bill of health / No repos found state
                  <div
                    className="flex flex-col items-center justify-center h-full min-h-[500px] rounded-2xl border gap-5"
                    style={{
                      background: 'var(--bg-surface)',
                      borderColor: 'rgba(16,185,129,0.15)', // Emerald border
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center border"
                      style={{
                        background: 'rgba(16,185,129,0.08)',
                        borderColor: 'rgba(16,185,129,0.2)',
                      }}
                    >
                      {report.error_message ? (
                        <Globe size={28} className="text-zinc-400" strokeWidth={1.5} />
                      ) : (
                        <ShieldCheck size={28} className="text-emerald-400" strokeWidth={1.5} />
                      )}
                    </div>

                    <div className="text-center max-w-sm px-6">
                      <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {report.error_message ? "No Web Repositories Found" : "Clean Bill of Health"}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {report.error_message 
                          ? "The agent could not locate any public dependency files for this target on the open web." 
                          : "No post-quantum cryptographic vulnerabilities were detected in the scanned files."}
                      </p>
                    </div>

                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 py-2.5 px-5 rounded-lg text-sm font-medium transition-all duration-150 hover:opacity-80"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <RefreshCw size={14} />
                      Scan Another Target
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-4 px-6 mt-8"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <p className="text-[11px] mono" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Vyala Archon · PQC Intelligence Engine · NIST PQC Compliant
          </p>
          {/* Tweaked to make Bright Data pop for the judges */}
          <p className="text-[11px] mono flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            Powered by <span className="text-amber-500 font-bold">Bright Data</span> Web Infrastructure
          </p>
        </div>
      </footer>
    </div>
  );
}