// ============================================================
// sanitizeInput
// ============================================================
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  let result = input;

  // Remove null bytes
  result = result.replace(/\0/g, '');

  // Remove HTML tags
  result = result.replace(/<[^>]*>/g, '');

  // Escape special characters (order matters: & first)
  result = result.replace(/&/g, '&amp;');
  result = result.replace(/</g, '&lt;');
  result = result.replace(/>/g, '&gt;');
  result = result.replace(/"/g, '&quot;');
  result = result.replace(/'/g, '&#x27;');

  // Trim whitespace
  result = result.trim();

  // Limit length
  if (result.length > 10000) {
    result = result.substring(0, 10000);
  }

  return result;
}

// ============================================================
// sanitizeHTML
// ============================================================
export function sanitizeHTML(
  input: string,
  allowedTags: string[] = ['b', 'i', 'u', 'strong', 'em']
): string {
  if (typeof input !== 'string') return '';

  const allowedPattern = new RegExp(
    `<\\/?(${allowedTags.join('|')})(\\s[^>]*)?>`,
    'gi'
  );

  // Replace each tag: keep if allowed, remove if not
  const result = input.replace(/<\/?[a-z][a-z0-9]*(\s[^>]*)?>/gi, (match) => {
    if (allowedPattern.test(match)) {
      return match;
    }
    return '';
  });

  return result;
}

// ============================================================
// sanitizeEmail
// ============================================================
export function sanitizeEmail(input: string): string | null {
  if (typeof input !== 'string') return null;

  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  // Basic email validation: must have @, domain with TLD, no spaces
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return null;

  return trimmed;
}

// ============================================================
// sanitizeURL
// ============================================================
export function sanitizeURL(input: string): string | null {
  if (typeof input !== 'string') return null;
  if (!input) return null;

  try {
    const url = new URL(input);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

// ============================================================
// sanitizeFileName
// ============================================================
export function sanitizeFileName(input: string): string {
  if (!input) return '';

  // Replace any character that is not alphanumeric, dot, hyphen, or underscore
  let result = input.replace(/[^a-zA-Z0-9.\-_]/g, '_');

  // Collapse consecutive dots to single dot
  result = result.replace(/\.{2,}/g, '.');

  // Truncate to 255 characters
  if (result.length > 255) {
    result = result.substring(0, 255);
  }

  return result;
}

// ============================================================
// validateInput
// ============================================================
interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  custom?: (value: string) => boolean;
  message?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateInput(
  value: string,
  rules: ValidationRules
): ValidationResult {
  const errors: string[] = [];

  // Required check
  if (rules.required && (!value || !value.trim())) {
    errors.push(rules.message || 'This field is required');
    return { valid: false, errors };
  }

  // If not required and empty, skip other checks
  if (!value || !value.trim()) {
    return { valid: true, errors: [] };
  }

  if (rules.minLength !== undefined && value.length < rules.minLength) {
    errors.push(
      rules.message || `Must be at least ${rules.minLength} characters`
    );
  }

  if (rules.maxLength !== undefined && value.length > rules.maxLength) {
    errors.push(
      rules.message || `Must be at most ${rules.maxLength} characters`
    );
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push(rules.message || 'Invalid format');
  }

  if (rules.email) {
    const emailResult = sanitizeEmail(value);
    if (!emailResult) {
      errors.push(rules.message || 'Invalid email address');
    }
  }

  if (rules.url) {
    const urlResult = sanitizeURL(value);
    if (!urlResult) {
      errors.push(rules.message || 'Invalid URL');
    }
  }

  if (rules.custom && !rules.custom(value)) {
    errors.push(rules.message || 'Custom validation failed');
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================
// detectMaliciousContent
// ============================================================
export function detectMaliciousContent(input: string): boolean {
  if (!input) return false;

  const lower = input.toLowerCase();

  const patterns = [
    /<script/i,
    /javascript\s*:/i,
    /on(click|error|mouseover|load|mouseout|focus|blur)\s*=/i,
    /eval\s*\(/i,
    /innerHTML\s*=/i,
    /document\s*\.\s*cookie/i,
    /document\s*\.\s*write/i,
    /window\s*\.\s*location/i,
    /data:\s*text\/html/i,
  ];

  return patterns.some((pattern) => pattern.test(input));
}

// ============================================================
// isRateLimited / resetRateLimit
// ============================================================
const rateLimitStore: Map<
  string,
  { count: number; windowStart: number }
> = new Map();

export function isRateLimited(
  action: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(action);

  if (!record || now - record.windowStart > windowMs) {
    // Start a new window
    rateLimitStore.set(action, { count: 1, windowStart: now });
    return false;
  }

  record.count++;

  if (record.count > maxRequests) {
    return true;
  }

  return false;
}

export function resetRateLimit(action: string): void {
  rateLimitStore.delete(action);
}

// ============================================================
// validateFileType
// ============================================================
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return allowedTypes.some((allowed) => {
    const lower = allowed.toLowerCase();

    if (lower.startsWith('.')) {
      // Extension check
      return fileName.endsWith(lower);
    }

    if (lower.endsWith('/*')) {
      // Wildcard MIME type check
      const prefix = lower.replace('/*', '/');
      return fileType.startsWith(prefix);
    }

    // Exact MIME type check
    return fileType === lower;
  });
}
