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

// ─── API Client ───────────────────────────────────────────────────────────────

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  'https://vyala-archon-brightdata-hackathon-production.up.railway.app/'
).replace(/\/+$/, '');

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
 * Invoke a scan against a URL/domain or a server-side local folder.
 * Maps to POST /api/scan/domain on the Python backend.
 */
export async function invokeScan(
  target: string,
  scanType: string = 'web'
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

  return response.json() as Promise<CBOMReport>;
}

/**
 * Upload a single source file from the browser for local crypto scanning.
 * Maps to POST /api/scan/upload on the Python backend.
 */
export async function scanUploadedFile(file: File): Promise<CBOMReport> {
  const formData = new FormData();
  formData.append('file', file);

  // Do NOT set Content-Type manually — browser sets it with the correct boundary
  const response = await fetch(`${API_BASE_URL}/api/scan/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let message = `Upload scan failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body?.detail ?? body?.message ?? message;
    } catch {
      // ignore parse errors on error bodies
    }
    throw new ApiError(response.status, response.statusText, message);
  }

  return response.json() as Promise<CBOMReport>;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

const SEVERITY_ORDER: Record<string, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

/**
 * Sort findings from most to least severe.
 * Unrecognised severity values sort to the end.
 */
export function sortFindingsBySeverity(findings: CryptoFinding[]): CryptoFinding[] {
  return [...findings].sort((a, b) => {
    const aOrder = SEVERITY_ORDER[a.severity] ?? 99;
    const bOrder = SEVERITY_ORDER[b.severity] ?? 99;
    return aOrder - bOrder;
  });
}