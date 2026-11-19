const isExamAction = (action?: Record<string, unknown> | null) => [true, 1, '1', 'true', 't'].includes(action?.is_exam as boolean)
  || String(action?.identifier ?? '').trim().toLowerCase() === 'exam';

type SavedStaffRecord = {
  created_by_name?: unknown;
  m_action?: Record<string, unknown> | null;
  t_logbook_status?: Array<{
    id_user?: unknown;
    staff_name?: unknown;
    deleted_at?: unknown;
    m_user?: { id?: unknown; display_name?: unknown; deleted_at?: unknown } | null;
  }> | null;
};
const displayName = (value: unknown) => typeof value === 'string' ? value.trim() : '';

/** Saved assignments, not the viewer, participant or active filter directory. */
export function resolvePpdsStaffIdentity(record: SavedStaffRecord, action?: Record<string, unknown>): string {
  const creatorOwned = (metadata?: Record<string, unknown> | null) => isExamAction(metadata)
    || [true, 1, '1', 'true', 't'].includes(metadata?.is_milestone as boolean)
    || [metadata?.identifier, metadata?.name].some(value => /^(stase|milestone)$/i.test(String(value ?? '').trim()));
  if (creatorOwned(action) || creatorOwned(record.m_action)) return displayName(record.created_by_name) || '-';
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const names: string[] = [];
  for (const row of record.t_logbook_status ?? []) {
    if (row.deleted_at != null || row.m_user?.deleted_at != null) continue;
    const name = displayName(row.staff_name) || displayName(row.m_user?.display_name);
    const rawId = row.id_user ?? row.m_user?.id;
    const id = /^(?:[0-9]+)$/.test(String(rawId ?? '')) && Number.isSafeInteger(Number(rawId)) && Number(rawId) > 0 ? String(Number(rawId)) : '';
    if (!name || (id && seenIds.has(id)) || seenNames.has(name)) continue;
    if (id) seenIds.add(id);
    seenNames.add(name);
    names.push(name);
  }
  return names.join('\n') || '-';
}
