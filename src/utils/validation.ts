import { z } from 'zod';

export const postcodeSchema = z
  .string()
  .min(3, 'Postcode must be at least 3 characters')
  .max(8, 'Postcode must be at most 8 characters')
  .regex(/^[A-Z0-9\s]+$/i, 'Invalid postcode format');

export const emailSchema = z.string().email('Invalid email address').min(1, 'Email is required');

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^[\d\s\-+()]+$/, 'Invalid phone number format');

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be at most 100 characters')
  .regex(
    /^[a-zA-Z\s\-'.]+$/,
    'Name can only contain letters, spaces, hyphens, apostrophes, and periods'
  );

export const validatePostcode = (
  postcode: string
): { isValid: boolean; error?: string | undefined } => {
  try {
    postcodeSchema.parse(postcode);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Invalid postcode' };
  }
};

export const validateEmail = (email: string): { isValid: boolean; error?: string | undefined } => {
  try {
    emailSchema.parse(email);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Invalid email' };
  }
};

export const validatePhone = (phone: string): { isValid: boolean; error?: string | undefined } => {
  try {
    phoneSchema.parse(phone);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Invalid phone number' };
  }
};

export const validateName = (name: string): { isValid: boolean; error?: string | undefined } => {
  try {
    nameSchema.parse(name);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Invalid name' };
  }
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

export const sanitizePostcode = (postcode: string): string => {
  return postcode
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .trim();
};

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/[^\d\s\-+()]/g, '').trim();
};

export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    const validAttempts = attempts.filter(time => now - time < this.windowMs);

    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }

    validAttempts.push(now);
    this.attempts.set(key, validAttempts);

    return true;
  }

  getRemainingTime(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;

    const oldestAttempt = Math.min(...attempts);
    const timeUntilReset = this.windowMs - (Date.now() - oldestAttempt);

    return Math.max(0, timeUntilReset);
  }
}
