import { z } from "zod";

/**
 * SQL Injection pattern detection heuristics.
 * Detects common SQL injection tautologies, comment sequences,
 * and malicious command injection vectors.
 */
const SQL_INJECTION_REGEX =
  /('|\b)(OR|AND)\b.+(=|<|>|\bLIKE\b)|\bUNION\b.+(SELECT|ALL)|\b(DROP|ALTER|EXEC|EXECUTE|INSERT|DELETE|UPDATE)\b\s+(TABLE|DATABASE|SCHEMA|FROM|INTO)|(--|\/\*|\*\/|;)/i;

/**
 * Detects if a string contains SQL injection signatures or dangerous null bytes.
 */
export function isPotentialSqlInjection(input: string): boolean {
  if (typeof input !== "string") return true;
  // Detect null bytes and non-printable control characters
  if (/[\0\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(input)) return true;
  return SQL_INJECTION_REGEX.test(input);
}

/**
 * Strict schema validation for admin login credentials.
 * Ensures inputs are strictly typed strings without SQL injection characters or excessive lengths.
 */
export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .trim()
    .toLowerCase()
    .email("Invalid email address format.")
    .max(120, "Email exceeds maximum length.")
    .refine((val) => !isPotentialSqlInjection(val), {
      message: "Security violation: Invalid or potentially malicious SQL characters detected.",
    }),
  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Password exceeds maximum allowed length.")
    .refine((val) => !/[\0\x00]/.test(val), {
      message: "Null bytes are not allowed in credentials.",
    }),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

/**
 * In-memory sliding window rate limiter to protect against
 * automated SQL injection fuzzing and password brute-forcing.
 */
interface RateLimitRecord {
  attempts: number;
  lockoutUntil: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    return { allowed: true };
  }

  if (record.lockoutUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  // If lockout has expired, reset
  if (record.lockoutUntil > 0 && record.lockoutUntil <= now) {
    rateLimitMap.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { attempts: 0, lockoutUntil: 0 };
  record.attempts += 1;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockoutUntil = now + LOCKOUT_DURATION_MS;
    console.warn(
      `[SECURITY LOCKOUT] IP ${ip} has been locked out for 10 minutes due to repeated failed login attempts.`
    );
  }

  rateLimitMap.set(ip, record);
}

export function resetRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}

/**
 * Pre-computed dummy bcrypt hash used when an email is not found in the DB.
 * Guarantees uniform response time (timing-attack defense against user enumeration).
 */
export const DUMMY_BCRYPT_HASH =
  "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
