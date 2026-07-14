/**
 * safeLogger.ts
 *
 * Monkey-patches console.log / console.warn / console.error globally.
 * Prevents ENOBUFS crashes caused by logging large objects to stdout.
 *
 * How it works:
 *  - Every console call is intercepted BEFORE writing to stdout.
 *  - The serialized string size is measured via Buffer.byteLength().
 *  - If it exceeds MAX_LOG_BYTES, only a summary is logged instead.
 *
 * This covers ALL console.log calls across every service file automatically.
 * No changes needed in individual service files.
 */

/** Max allowed bytes per log line before it gets suppressed. Default: 50 KB.
 *  Loki's hard limit is 256 KB per line, but we stay well under to be safe.
 *  Override via env: MAX_LOG_BYTES=102400 (100 KB)
 */
const MAX_LOG_BYTES = Number(process.env.MAX_LOG_BYTES) || 50 * 1024; // 50 KB

/**
 * Serializes arguments to a string and measures byte size.
 * Returns { str, bytes }.
 */
function serialize(args: any[]): { str: string; bytes: number } {
  const str = args
    .map((a) => {
      if (a === null) return 'null';
      if (a === undefined) return 'undefined';
      if (typeof a === 'object') {
        try {
          return JSON.stringify(a);
        } catch {
          return '[Circular or unserializable object]';
        }
      }
      return String(a);
    })
    .join(' ');

  const bytes = Buffer.byteLength(str, 'utf8');
  return { str, bytes };
}

/**
 * Builds a safe summary when a payload is too large to log.
 */
function buildSummary(args: any[], bytes: number): string {
  const sizeKB = (bytes / 1024).toFixed(1);
  const parts = args.map((a) => {
    if (Array.isArray(a)) return `Array(${a.length})`;
    if (a && typeof a === 'object') return `Object(keys: ${Object.keys(a).join(', ').slice(0, 100)})`;
    const s = String(a);
    return s.length > 80 ? s.slice(0, 80) + '...' : s;
  });

  return `[LOG SUPPRESSED — ${sizeKB} KB exceeds ${MAX_LOG_BYTES / 1024} KB limit] ${parts.join(' | ')}`;
}

/**
 * Wraps a console method with a size guard.
 * Logs a summary instead of the full payload when too large.
 */
function createSafeMethod(
  original: (...args: any[]) => void,
  fallback: (msg: string) => void,
): (...args: any[]) => void {
  return (...args: any[]) => {
    const { str, bytes } = serialize(args);

    if (bytes > MAX_LOG_BYTES) {
      const summary = buildSummary(args, bytes);
      // Use the fallback (NestJS Logger or original) to log the summary
      fallback(summary);
      return;
    }

    original(...args);
  };
}

/**
 * Patches global console methods.
 * Call this ONCE at the very top of main.ts, before NestFactory.create().
 *
 * After patching:
 *  - console.log / info  → suppressed if > MAX_LOG_BYTES, else passes through
 *  - console.warn        → suppressed if > MAX_LOG_BYTES, else passes through
 *  - console.error       → always passes through (errors should never be suppressed)
 */
export function patchConsole(): void {
  const _originalLog   = console.log.bind(console);
  const _originalWarn  = console.warn.bind(console);
  const _originalError = console.error.bind(console);

  console.log = createSafeMethod(
    _originalLog,
    (msg) => _originalLog(`[SafeLogger] ${msg}`),
  );

  console.warn = createSafeMethod(
    _originalWarn,
    (msg) => _originalWarn(`[SafeLogger] ${msg}`),
  );

  // console.error: do NOT suppress — always log errors in full.
  // But still warn if they are unusually large.
  console.error = (...args: any[]) => {
    const { bytes } = serialize(args);
    if (bytes > MAX_LOG_BYTES) {
      _originalError(
        `[SafeLogger] ⚠️  Large error payload: ${(bytes / 1024).toFixed(1)} KB — logging anyway.`,
      );
    }
    _originalError(...args);
  };

  _originalLog(
    `[SafeLogger] console patched — max log size: ${MAX_LOG_BYTES / 1024} KB per call`,
  );
}

/**
 * Utility to measure the byte size of any value before logging it manually.
 *
 * Usage:
 *   const { bytes, kb } = measureSize(finalFilteredData);
 *   console.log(`Result set size: ${kb} KB, count: ${finalFilteredData.length}`);
 */
export function measureSize(data: any): { bytes: number; kb: string } {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  const bytes = Buffer.byteLength(str, 'utf8');
  return { bytes, kb: (bytes / 1024).toFixed(2) };
}
