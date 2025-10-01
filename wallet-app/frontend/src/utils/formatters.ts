/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format a date string
 * @param date - The date to format
 * @param format - The format to use (default: 'medium')
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  format: 'short' | 'medium' | 'long' = 'medium',
  locale: string = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: format === 'short' ? 'short' : 'long',
    day: 'numeric',
  });
};

/**
 * Format a percentage
 * @param value - The value to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format a number with specified decimal places
 * @param value - The value to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes - The size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format a duration in milliseconds to a human-readable string
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 */
