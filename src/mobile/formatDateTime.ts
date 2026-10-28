// Display-only parity with Native utils/formatDateTime; not an API serializer.
export function formatDateTime(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const year = date.getFullYear();
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  const period = hours24 >= 12 ? 'PM' : 'AM';
  return `${month}/${day}/${year} ${hours12}:${minutes} ${period}`;
}
export function parseDateTime(value: unknown) {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value !== 'string' || !value.trim()) return null;
  let normalized = value.trim();
  normalized = normalized.replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}(?:\.\d+)?)/, '$1T$2');
  normalized = normalized.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
  normalized = normalized.replace(/([+-]\d{2})$/, '$1:00');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
export function formatDateTimeValue(value: unknown, fallback = '-') {
  const parsed = parseDateTime(value);
  if (!parsed) return typeof value === 'string' && value.trim() ? value.trim() : fallback;
  return formatDateTime(parsed);
}
