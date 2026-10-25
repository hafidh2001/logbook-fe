type StatusRow = {
  id_user?: number | string | null;
  status?: string | null;
  notes?: string | null;
  m_action_role?: { role?: string | null; identifier?: string | null } | null;
};

type LogbookAction =
  | {
      name?: string | null;
      identifier?: string | null;
    }
  | null
  | undefined;

const pending = (status: StatusRow['status']) => {
  const value = String(status ?? '')
    .trim()
    .toLowerCase();
  return (
    !value || value === 'pending' || value === 'revised' || value === 'revision'
  );
};

export function isJejaringStatusRow(row: StatusRow): boolean {
  const notes = String(row.notes ?? '').toLowerCase();
  const role = String(row.m_action_role?.role ?? '').toLowerCase();
  const identifier = String(row.m_action_role?.identifier ?? '').toLowerCase();

  return (
    notes.includes('__staff_jejaring__') ||
    notes.includes('staff_jejaring') ||
    /jejar/.test(role) ||
    /jejar/.test(identifier)
  );
}

// These workflows have their own sequential rules in Prasi-Bun and must not
// inherit the ordinary Staff Jejaring -> Staff Pengajar sequence.
export function usesOrdinaryJejaringSequence(action: LogbookAction): boolean {
  const source = `${action?.identifier ?? ''} ${
    action?.name ?? ''
  }`.toLowerCase();
  return !/morbiditas|proposal[-_\s]*thesis|proposal[-_\s]*tesis|seminar[-_\s]*hasil/.test(
    source,
  );
}

export function getJejaringSequentialBlockReason(
  statuses: StatusRow[] | null | undefined,
  currentUserId?: number,
  action?: LogbookAction,
): string | null {
  if (!currentUserId || !usesOrdinaryJejaringSequence(action)) return null;
  const rows = Array.isArray(statuses) ? statuses : [];
  const jejaringRows = rows.filter(
    row => isJejaringStatusRow(row) && Number(row.id_user) > 0,
  );
  if (!jejaringRows.length) return null;

  const userRows = rows.filter(row => Number(row.id_user) === currentUserId);
  const userHasPendingJejaring = userRows.some(
    row => isJejaringStatusRow(row) && pending(row.status),
  );
  if (userHasPendingJejaring) return null;

  const userHasPendingMainStaff = userRows.some(
    row => !isJejaringStatusRow(row) && pending(row.status),
  );
  const allJejaringVerified = jejaringRows.every(
    row => String(row.status ?? '').toLowerCase() === 'verified',
  );
  return userHasPendingMainStaff && !allJejaringVerified
    ? 'Menunggu verifikasi Staff Pengajar Jejaring terlebih dahulu.'
    : null;
}
