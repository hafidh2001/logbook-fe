/**
 * Converts a number to a formatted string with thousand separators using Indonesian locale.
 * Prevents Excel from treating long numbers as scientific notation.
 * @param value - The number to convert to a string.
 * @returns Formatted string (e.g., "1.000.000")
 */
export const convertNumberToString = (value: number | string | null | undefined): string => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};
