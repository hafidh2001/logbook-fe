type StatusRow = {
  id_user?: number | null;
  status?: string | null;
  m_action_role?: { identifier?: string | null; role?: string | null } | null;
  m_user?: { id?: number | null } | null;
  identifier?: string | null;
  role?: string | null;
};

const isActive = (status: unknown) =>
  ['pending', 'revised', 'revision', ''].includes(String(status ?? '').trim().toLowerCase());

const isReporterOrAssessor = (row: StatusRow) => {
  const role = `${row.m_action_role?.identifier ?? row.identifier ?? ''} ${row.m_action_role?.role ?? row.role ?? ''}`.toLowerCase();
  return /pelapor|penilai|gkm|reporter|assessor/.test(role);
};

/** Mirrors Prasi: only an active Morbiditas Pelapor/Penilai may edit category. */
export function canEditMorbiditasCategory(
  statuses: StatusRow[] | null | undefined,
  currentUserId: number | undefined,
): boolean {
  if (!Number.isFinite(currentUserId)) return false;
  return (Array.isArray(statuses) ? statuses : []).some(
    row =>
      Number(row.id_user ?? row.m_user?.id) === currentUserId &&
      isActive(row.status) &&
      isReporterOrAssessor(row),
  );
}
