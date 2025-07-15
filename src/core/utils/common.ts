import { DATE_FORMAT } from '@/core/constants';
import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a random timeout value between 1000 and 3000 in steps of 500 milliseconds.
 * @returns a random timeout.
 */
export function getTimeout(min = 1000, max = 3000, step = 500): number {
  const steps = (max - min) / step + 1;
  const randomStep = Math.floor(Math.random() * steps);
  return min + randomStep * step;
}

/**
 * Generates a random referral code of a specified length using alphanumeric characters.
 * @param [length=10] - The referral code length. Default is 10 characters.
 * @returns A randomly generated referral code.
 */
export function generateReferralCode(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Waits for a specified number of milliseconds.
 * @param delay - The number of milliseconds to wait.
 * @returns A Promise that resolves after the specified delay.
 */
export async function wait(delay: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Returns a formatted date string based on the input date and format.
 * @param date - a Date object representing the date for which you want to
 * generate a key. If no date is provided, it defaults to the current date.
 * @param dateFormat - a format string that specifies how the date should be formatted.
 * @returns the formatted date using the `format` function with the specified `dateFormat`.
 */
export const getDateKey = (date = new Date(), dateFormat = DATE_FORMAT) => {
  return format(date, dateFormat);
};

/**
 * Allows you to debounce a given function with a specified delay.
 * @param {T} func - the function that you want to debounce.
 * @param {number} delay - specifies the time in milliseconds for which the
 * execution of the function `func` will be delayed after the last invocation before it is actually
 * called.
 * @returns a debounced version of the input function `func`, with the specified delay.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout;

  const debouncedFn = ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T & { cancel: () => void };

  debouncedFn.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debouncedFn;
}
