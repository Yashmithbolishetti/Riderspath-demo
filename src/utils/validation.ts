/**
 * ICFAI University Enrollment Number format validation utilities.
 * Consistent across student login, booking, profile, and admin screens.
 */

export const ICFAI_ENROLLMENT_EXAMPLE = '26FMUCHH01XXXX';
export const ICFAI_ENROLLMENT_PLACEHOLDER = 'Example: 26FMUCHH01XXXX';

export interface EnrollmentValidationResult {
  valid: boolean;
  normalized: string;
  error?: string;
}

/**
 * Validates ICFAI enrollment number according to strict platform guidelines:
 * - Minimum 10 characters
 * - Only letters and numbers (alphanumeric)
 * - No spaces
 * - No special characters
 * - Example: 26FMUCHH01XXXX (accepts the format example without treating XXXX as a fake barrier)
 */
export function validateIcfaiEnrollment(enrollment: string): EnrollmentValidationResult {
  if (!enrollment || typeof enrollment !== 'string') {
    return {
      valid: false,
      normalized: '',
      error: 'ICFAI enrollment number is required.',
    };
  }

  const clean = enrollment.trim().toUpperCase();

  if (clean.length < 10) {
    return {
      valid: false,
      normalized: clean,
      error: `Enrollment number must contain at least 10 characters (${ICFAI_ENROLLMENT_PLACEHOLDER}).`,
    };
  }

  if (/\s/.test(clean)) {
    return {
      valid: false,
      normalized: clean,
      error: 'Enrollment number cannot contain spaces.',
    };
  }

  if (!/^[A-Z0-9]+$/.test(clean)) {
    return {
      valid: false,
      normalized: clean,
      error: 'Enrollment number can only contain letters and numbers (no special characters).',
    };
  }

  return {
    valid: true,
    normalized: clean,
  };
}
