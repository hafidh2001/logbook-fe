import type { Row } from './model';

function actorId(value: unknown): number | undefined {
  if (typeof value !== 'number' && (typeof value !== 'string' || !/^[1-9]\d*$/.test(value.trim()))) return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
}

/** ASM alone proves authorship; verifier status and parent scalar scores do not.
 * Current rows use created_by; legacy rows inverted created_by/date. Conflicting
 * numeric authorship fails closed rather than guessing which writer produced it. */
export function assessmentOwner(row: Row): number | undefined {
  const canonical = actorId(row.created_by), legacy = actorId(row.created_date);
  if (canonical !== undefined) return legacy !== undefined && canonical !== legacy ? undefined : canonical;
  const creator = row.created_by;
  const legacyCreator = creator == null || creator === '' ||
    (typeof creator === 'string' && /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/.test(creator.trim()));
  return legacyCreator ? legacy : undefined;
}

export function ownAssessmentRows(record: Row, currentUserId?: number): Row[] {
  const id = actorId(currentUserId);
  if (id === undefined || !Array.isArray(record.t_logbook_asm)) return [];
  return record.t_logbook_asm.filter((row: Row) => row != null && row.deleted_at == null && assessmentOwner(row) === id);
}
