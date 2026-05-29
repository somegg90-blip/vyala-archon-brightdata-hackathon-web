'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Terminal, Zap, ChevronRight, FolderCode, Globe } from 'lucide-react'; // Added Globe
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';

interface InvokeTerminalProps {
  onInvoke: (target: string, scanType: string) => Promise<void>;
  isLoading: boolean;
}

// FIXED: Changed 'remote' to 'web' to match FastAPI backend
const SCAN_TYPES = [
  { value: 'local', label: 'Local', icon: FolderCode },
  { value: 'web', label: 'Web (Bright Data)', icon: Globe }, 
];

export default function InvokeTerminal({ onInvoke, isLoading }: InvokeTerminalProps) {
  const [target, setTarget] = useState('core/tests');
  const [scanType, setScanType] = useState('local');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInvoke = () => {
    if (!target.trim() || isLoading) return;
    onInvoke(target.trim(), scanType);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleInvoke();
  };

  // Dynamic placeholder based on scan type
  const placeholderText = scanType === 'local' 
    ? "core/tests or ./my-project" 
    : "stripe.com or github.com/torvalds";

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center gap-2">
        <Terminal size={13} style={{ color: 'var(--text-muted)' }} />
        <span
          className="text-[11px] font-medium mono uppercase"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
        >
          Invoke Scan
        </span>
      </div>

      {/* Scan type selector */}
      <div
        className="flex items-center gap-1 p-1 rounded-lg border"
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {SCAN_TYPES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => {
              setScanType(value);
              // Auto-clear input when switching modes for better UX
              setTarget(value === 'local' ? 'core/tests' : ''); 
            }}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all duration-150',
              scanType === value
                ? 'text-amber-400'
                : 'hover:text-zinc-300'
            )}
            style={{
              background: scanType === value
                ? 'rgba(245,158,11,0.12)'
                : 'transparent',
              color: scanType === value ? 'var(--amber)' : 'var(--text-muted)',
              border: scanType === value ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
            }}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Input field */}
      <div
        className={cn(
          'relative flex items-center rounded-xl border transition-all duration-200',
          focused ? 'border-amber-500/40' : ''
        )}
        style={{
          background: focused ? 'rgba(245,158,11,0.04)' : 'var(--bg-surface)',
          borderColor: focused ? 'rgba(245,158,11,0.35)' : 'var(--border-default)',
          boxShadow: focused
            ? '0 0 0 3px rgba(245,158,11,0.06), 0 0 20px rgba(245,158,11,0.06)'
            : 'none',
        }}
      >
        {/* Prompt glyph */}
        <div
          className="flex items-center justify-center w-10 h-10 shrink-0"
          style={{ color: focused ? 'rgba(245,158,11,0.7)' : 'var(--text-muted)' }}
        >
          <ChevronRight size={14} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholderText} // DYNAMIC PLACEHOLDER
          disabled={isLoading}
          className="flex-1 bg-transparent text-sm outline-none mono disabled:opacity-40"
          style={{
            color: 'var(--text-primary)',
            caretColor: 'var(--amber)',
            paddingRight: '8px',
          }}
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {/* Invoke button */}
      <button
        onClick={handleInvoke}
        disabled={isLoading || !target.trim()}
        className={cn(
          'w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl',
          'text-sm font-semibold transition-all duration-200',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          !isLoading && target.trim() ? 'hover:scale-[1.01] active:scale-[0.99]' : ''
        )}
        style={{
          background: isLoading
            ? 'rgba(245,158,11,0.1)'
            : 'linear-gradient(135deg, rgba(245,158,11,0.9) 0%, rgba(249,115,22,0.9) 100%)',
          color: isLoading ? 'var(--amber)' : '#0a0600',
          border: isLoading ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(245,158,11,0.3)',
          boxShadow: !isLoading && target.trim()
            ? '0 4px 16px rgba(245,158,11,0.2), inset 0 1px 0 rgba(255,255,255,0.15)'
            : 'none',
          letterSpacing: '0.04em',
        }}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size={16} />
            <span>Scanning…</span>
          </>
        ) : (
          <>
            <Zap size={15} strokeWidth={2.5} />
            <span>Invoke Scan</span>
          </>
        )}
      </button>

      {/* Hint */}
      <p className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
        Press <kbd
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] border mono"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)' }}
        >⏎ Enter</kbd> to invoke
      </p>
    </div>
  );
}