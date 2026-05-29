'use client';

import { useState, useEffect } from 'react';
import { Activity, Cpu } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      setTime(
        new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZoneName: 'short',
        }).format(new Date())
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 glass border-b"
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Left — Brand */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg overflow-hidden border"
            style={{
              borderColor: 'rgba(245,158,11,0.2)',
              background: '#000',
              boxShadow: '0 0 12px rgba(245,158,11,0.15)',
            }}
          >
            <Image
              src="/vyala_logo.png"
              alt="Vyala Logo"
              width={36}
              height={36}
              className="object-cover"
              priority
            />
          </div>

          <div className="flex items-baseline gap-2">
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: 'var(--text-primary)', letterSpacing: '0.04em' }}
            >
              Vyala
            </span>
            <span
              className="text-sm font-bold tracking-widest gradient-text"
              style={{ letterSpacing: '0.1em' }}
            >
              ARCHON
            </span>
          </div>

          <div
            className="hidden sm:block h-4 w-px mx-1"
            style={{ background: 'var(--border-default)' }}
          />

          <div className="hidden sm:flex items-center gap-1.5">
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full border mono"
              style={{
                color: 'var(--text-muted)',
                borderColor: 'var(--border-subtle)',
                background: 'rgba(255,255,255,0.02)',
                letterSpacing: '0.06em',
              }}
            >
              PQC INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Center — Nav hints (desktop) */}
        <nav className="hidden lg:flex items-center gap-6">
          {['Dashboard', 'Reports', 'Algorithms', 'Settings'].map((item, i) => (
            <button
              key={item}
              className="text-xs font-medium transition-colors duration-150"
              style={{
                color: i === 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                letterSpacing: '0.03em',
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right — Status indicators */}
        <div className="flex items-center gap-3">
          {/* Clock */}
          {mounted && (
            <div
              className="hidden md:flex items-center gap-1.5 mono text-[11px] px-2.5 py-1 rounded-md border"
              style={{
                color: 'var(--text-muted)',
                borderColor: 'var(--border-subtle)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <Activity size={10} className="text-amber-400/60" />
              {time}
            </div>
          )}

          {/* Network status */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border"
            style={{
              borderColor: 'rgba(34,197,94,0.15)',
              background: 'rgba(34,197,94,0.05)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ background: 'var(--green)' }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: 'var(--green)' }}
              />
            </span>
            <span
              className="text-[11px] font-medium"
              style={{ color: 'rgba(34,197,94,0.9)', letterSpacing: '0.04em' }}
            >
              System Online
            </span>
          </div>

          {/* Engine badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border"
            style={{
              borderColor: 'var(--border-subtle)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <Cpu size={12} style={{ color: 'var(--text-muted)' }} />
            <span
              className="text-[11px] mono"
              style={{ color: 'var(--text-muted)', letterSpacing: '0.04em' }}
            >
              v2.4.1
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
