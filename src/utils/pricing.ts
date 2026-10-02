/**
 * Centralized pricing configuration and bidirectional calculation helpers
 * for Riders Path campus mobility.
 */

export const DAILY_HOUR_EQUIVALENT = 24;

/**
 * Calculates daily price from hourly price based on configured multiplier.
 */
export function hourlyToDaily(hourly: number): number {
  if (isNaN(hourly) || !isFinite(hourly) || hourly <= 0) return 0;
  return Math.round(hourly * DAILY_HOUR_EQUIVALENT);
}

/**
 * Calculates hourly price from daily price based on configured multiplier.
 * Formats to standard 2-decimal rounded float for precision.
 */
export function dailyToHourly(daily: number): number {
  if (isNaN(daily) || !isFinite(daily) || daily <= 0) return 0;
  return Math.round((daily / DAILY_HOUR_EQUIVALENT) * 100) / 100;
}

export const PRICING_HELPER_TEXT =
  'Pricing is automatically converted using the configured hourly/daily rate (1 day = 24 hours).';
