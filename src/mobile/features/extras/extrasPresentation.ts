// Native Explore applies formatBirthDate, then formatDateTimeValue. The latter
// reparses the calendar label at midnight; retain its actual final display, not
// just the intermediate "03 Feb 1995". Pin the clinical locale to Jakarta so a
// browser's timezone cannot silently move the participant's birth calendar day.
export function exploreBirthDate(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) return '-';
  const raw=value.trim();
  // Unzoned API datetimes are local clinical time, not the browser's timezone.
  const normalized=raw.replace(/^(\d{4}-\d{2}-\d{2}) /,'$1T');
  const zoned=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(normalized) ? normalized+'+07:00' : normalized;
  const parsed=new Date(zoned);
  if (Number.isNaN(parsed.getTime())) return raw;
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Jakarta',day:'2-digit',month:'2-digit',year:'numeric'}).formatToParts(parsed);
  const part=(type:string)=>parts.find(p=>p.type===type)?.value || '';
  return `${part('month')}/${part('day')}/${part('year')} 12:00 AM`;
}
