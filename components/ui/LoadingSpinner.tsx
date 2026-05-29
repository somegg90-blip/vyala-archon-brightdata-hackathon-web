'use client';

export function LoadingSpinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      style={{ color: 'var(--amber)' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.15"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ScanningIndicator() {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Orbital rings */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-dashed animate-spin"
          style={{
            borderColor: 'rgba(245,158,11,0.2)',
            animationDuration: '4s',
            animationDirection: 'reverse',
          }}
        />
        {/* Middle ring */}
        <div
          className="absolute inset-3 rounded-full border animate-spin"
          style={{
            borderColor: 'rgba(245,158,11,0.15)',
            borderTopColor: 'rgba(245,158,11,0.6)',
            animationDuration: '1.5s',
          }}
        />
        {/* Core */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p
          className="text-sm font-medium mono"
          style={{ color: 'var(--amber)', letterSpacing: '0.06em' }}
        >
          SCANNING IN PROGRESS
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Analyzing cryptographic primitives across supply chain…
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full bg-amber-400 animate-bounce"
            style={{ animationDelay: `${i * 0.12}s`, animationDuration: '0.8s' }}
          />
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div
      className="rounded-xl border p-5 space-y-4"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex justify-between items-start">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="skeleton h-3 w-48 rounded" />
      <div className="skeleton h-16 w-full rounded-lg" />
      <div className="flex gap-2">
        <div className="skeleton h-4 w-12 rounded" />
        <div className="skeleton h-4 w-16 rounded" />
      </div>
      <div className="skeleton h-4 w-40 rounded" />
    </div>
  );
}
