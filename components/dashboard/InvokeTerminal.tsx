import { useState, useRef, KeyboardEvent, DragEvent, useCallback } from 'react';
import { Terminal, Zap, ChevronRight, FolderCode, Globe, Upload, FileCode2, X, CheckCircle2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';

interface InvokeTerminalProps {
  onInvoke: (target: string, scanType: string) => Promise<void>;
  isLoading: boolean;
}

const SCAN_TYPES = [
  { value: 'local', label: 'Local', icon: FolderCode },
  { value: 'remote', label: 'Web (Bright Data)', icon: Globe },
];

export default function InvokeTerminal({ onInvoke, isLoading }: InvokeTerminalProps) {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('local');
  const [focused, setFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFile, setDroppedFile] = useState<{ name: string; path: string } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const isLocal = scanType === 'local';

  const effectiveTarget = isLocal
    ? (droppedFile?.path ?? target)
    : target;

  const handleInvoke = () => {
    if (!effectiveTarget.trim() || isLoading) return;
    onInvoke(effectiveTarget.trim(), scanType);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleInvoke();
  };

  const handleScanTypeChange = (value: string) => {
    setScanType(value);
    setDroppedFile(null);
    setTarget('');
  };

  // ── Drag & Drop ─────────────────────────────────────────────────────────────
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Only leave if truly exiting the drop zone
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    const file = files[0];
    // Use webkitRelativePath if available, else just the name
    const path = (file as File & { path?: string }).path ?? file.name;
    setDroppedFile({ name: file.name, path });
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = (file as File & { path?: string }).path ?? file.name;
    setDroppedFile({ name: file.name, path });
    // Reset so same file can be re-selected
    e.target.value = '';
  };

  const clearFile = () => {
    setDroppedFile(null);
  };

  const canInvoke = effectiveTarget.trim().length > 0 && !isLoading;

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
        style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'var(--border-subtle)' }}
      >
        {SCAN_TYPES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => handleScanTypeChange(value)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all duration-150"
            style={{
              background: scanType === value ? 'rgba(245,158,11,0.12)' : 'transparent',
              color: scanType === value ? 'var(--amber)' : 'var(--text-muted)',
              border: scanType === value ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
            }}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* ── LOCAL: Drag & Drop zone ── */}
      {isLocal ? (
        <div className="space-y-2">
          {/* Hidden real file input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {droppedFile ? (
            /* File selected state */
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200"
              style={{
                background: 'rgba(34,197,94,0.05)',
                borderColor: 'rgba(34,197,94,0.25)',
              }}
            >
              <CheckCircle2 size={16} className="shrink-0" style={{ color: '#22c55e' }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold mono truncate" style={{ color: '#22c55e' }}>
                  {droppedFile.name}
                </p>
                <p className="text-[10px] mono truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {droppedFile.path}
                </p>
              </div>
              <button
                onClick={clearFile}
                className="shrink-0 p-1 rounded-md transition-colors hover:bg-white/5"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            /* Drop zone */
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="relative flex flex-col items-center justify-center gap-3 py-7 px-4 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 group"
              style={{
                borderColor: isDragging ? 'rgba(245,158,11,0.6)' : 'rgba(255,255,255,0.08)',
                background: isDragging
                  ? 'rgba(245,158,11,0.06)'
                  : 'rgba(255,255,255,0.01)',
                boxShadow: isDragging ? '0 0 24px rgba(245,158,11,0.08) inset' : 'none',
              }}
            >
              {/* Animated upload icon */}
              <div
                className="flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-200"
                style={{
                  background: isDragging ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                  borderColor: isDragging ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.07)',
                  transform: isDragging ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
                }}
              >
                {isDragging ? (
                  <FileCode2 size={20} style={{ color: 'var(--amber)' }} />
                ) : (
                  <Upload
                    size={18}
                    style={{ color: 'var(--text-muted)' }}
                    className="group-hover:text-amber-400 transition-colors duration-150"
                  />
                )}
              </div>

              <div className="text-center space-y-1">
                <p
                  className="text-xs font-medium transition-colors duration-150"
                  style={{ color: isDragging ? 'var(--amber)' : 'var(--text-secondary)' }}
                >
                  {isDragging ? 'Drop to add file' : 'Drop a file or click to browse'}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  .py · .ts · .js · .go · .java · .rs · any source file
                </p>
              </div>

              {/* Corner decorations */}
              {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos) => (
                <div
                  key={pos}
                  className={`absolute ${pos} w-2.5 h-2.5 border-t border-l transition-colors duration-200`}
                  style={{
                    borderColor: isDragging ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.1)',
                    transform: pos.includes('right') ? 'rotate(90deg)' : pos.includes('bottom') && pos.includes('left') ? 'rotate(-90deg)' : pos.includes('bottom') ? 'rotate(180deg)' : '',
                  }}
                />
              ))}
            </div>
          )}

          {/* Or type path manually */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
            <span className="text-[10px] mono" style={{ color: 'var(--text-muted)' }}>or type path</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
          </div>

          {/* Manual path input */}
          <div
            className="relative flex items-center rounded-xl border transition-all duration-200"
            style={{
              background: focused ? 'rgba(245,158,11,0.04)' : 'var(--bg-surface)',
              borderColor: focused ? 'rgba(245,158,11,0.35)' : 'var(--border-default)',
              boxShadow: focused ? '0 0 0 3px rgba(245,158,11,0.06)' : 'none',
              opacity: droppedFile ? 0.4 : 1,
              pointerEvents: droppedFile ? 'none' : 'auto',
            }}
          >
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
              placeholder="./my-project or core/tests"
              disabled={isLoading || !!droppedFile}
              className="flex-1 bg-transparent text-sm outline-none mono disabled:opacity-40"
              style={{ color: 'var(--text-primary)', caretColor: 'var(--amber)', paddingRight: '8px' }}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
      ) : (
        /* ── REMOTE: URL input ── */
        <div
          className="relative flex items-center rounded-xl border transition-all duration-200"
          style={{
            background: focused ? 'rgba(245,158,11,0.04)' : 'var(--bg-surface)',
            borderColor: focused ? 'rgba(245,158,11,0.35)' : 'var(--border-default)',
            boxShadow: focused ? '0 0 0 3px rgba(245,158,11,0.06)' : 'none',
          }}
        >
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
            placeholder="github.com/org/repo or domain.com"
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm outline-none mono disabled:opacity-40"
            style={{ color: 'var(--text-primary)', caretColor: 'var(--amber)', paddingRight: '8px' }}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      )}

      {/* Invoke button */}
      <button
        onClick={handleInvoke}
        disabled={!canInvoke}
        className={cn(
          'w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl',
          'text-sm font-semibold transition-all duration-200',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          canInvoke ? 'hover:scale-[1.01] active:scale-[0.99]' : ''
        )}
        style={{
          background: isLoading
            ? 'rgba(245,158,11,0.1)'
            : 'linear-gradient(135deg, rgba(245,158,11,0.9) 0%, rgba(249,115,22,0.9) 100%)',
          color: isLoading ? 'var(--amber)' : '#0a0600',
          border: isLoading ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(245,158,11,0.3)',
          boxShadow: canInvoke
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
      {!isLocal && (
        <p className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
          Press{' '}
          <kbd
            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] border mono"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)' }}
          >
            ⏎ Enter
          </kbd>{' '}
          to invoke
        </p>
      )}
    </div>
  );
}