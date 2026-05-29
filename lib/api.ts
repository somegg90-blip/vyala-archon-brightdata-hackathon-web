// ─── Data Contract ────────────────────────────────────────────────────────────

export interface CodeLocation {
  file_path: string;
  line_number: number;
  column_start: number | null;
  column_end: number | null;
}

export interface CryptoFinding {
  finding_id: string;
  file_path: string;
  line_number: number;
  location: CodeLocation;
  language: string;
  algorithm_detected: string;
  code_snippet: string;
  is_quantum_vulnerable: boolean;
  vulnerability_class: string; // "SHOR_VULNERABLE" | "GROVER_WEAKENED"
  severity: string;            // "CRITICAL" | "HIGH" | "MEDIUM"
  usage_context: string | null;
  pqc_replacement: string | null;
  migration_complexity: string | null;
  is_ai_enriched: boolean;
}

export interface CBOMReport {
  error_message: any;
  report_id: string;
  project_name: string;
  status: string;
  findings: CryptoFinding[];
  total_findings: number;
  quantum_vulnerable_count: number;
  critical_findings_count: number;
  algorithms_detected: string[];
  severity_breakdown: Record<string, number>;
}

// ─── API Client ────────────────────────────────────────────────────────────────

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Invoke a cryptographic supply-chain scan against the given target.
 * Maps directly to POST /api/scan/domain on the Python backend.
 */
export async function invokeScan(
  target: string,
  scanType: string = 'local'
): Promise<CBOMReport> {
  const endpoint = `${API_BASE_URL}/api/scan/domain`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      target,
      scan_type: scanType,
    }),
  });

  if (!response.ok) {
    let message = `Scan request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body?.detail ?? body?.message ?? message;
    } catch {
      // ignore parse errors on error bodies
    }
    throw new ApiError(response.status, response.statusText, message);
  }

  const data: CBOMReport = await response.json();
  return data;
}

// ─── Utility helpers ───────────────────────────────────────────────────────────

/** Returns the display label for a vulnerability class */
export function getVulnClassLabel(vulnerabilityClass: string): string {
  const map: Record<string, string> = {
    SHOR_VULNERABLE: "Shor's Algorithm",
    GROVER_WEAKENED: "Grover's Weakened",
  };
  return map[vulnerabilityClass] ?? vulnerabilityClass;
}

/** Returns severity sort weight (lower = more severe) */
export function severityWeight(severity: string): number {
  const weights: Record<string, number> = {
    CRITICAL: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
  };
  return weights[severity] ?? 99;
}

/** Sort findings by severity descending */
export function sortFindingsBySeverity(findings: CryptoFinding[]): CryptoFinding[] {
  return [...findings].sort(
    (a, b) => severityWeight(a.severity) - severityWeight(b.severity)
  );
}
