type StatusRow = {
  id_user?: unknown;
  id_action_role?: unknown;
  status?: unknown;
  notes?: unknown;
  role?: unknown;
  identifier?: unknown;
  m_action_role?: {
    role?: unknown;
    identifier?: unknown;
  } | null;
};

const finiteId = (value: unknown) => {
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : undefined;
};

const isJejaringRow = (row: StatusRow) => {
  const notes = String(row.notes ?? '');
  const role = String(row.m_action_role?.role ?? row.role ?? '');
  const identifier = String(row.m_action_role?.identifier ?? row.identifier ?? '');
  return notes.startsWith('__staff_jejaring__') || /jejaring/i.test(role) || /jejaring/i.test(identifier);
};

type RelationOptionIds = {
  mainUserIds?: number[];
  jejaringUserIds?: number[];
};

/** Keeps Prasi main-staff and Staff Jejaring assignments in distinct slots. */
export function getInitialRelationIds(record: {
  t_logbook_status?: StatusRow[] | null;
}, optionIds: RelationOptionIds = {}) {
  const statuses = Array.isArray(record.t_logbook_status)
    ? record.t_logbook_status
    : [];
  const hasMarker = statuses.some(row => String(row.notes ?? '').startsWith('__staff_jejaring__'));
  const jejaringUsers = new Set(optionIds.jejaringUserIds ?? []);
  const mainUsers = new Set(optionIds.mainUserIds ?? []);
  const isJejaringAssignment = (row: StatusRow) => {
    if (String(row.notes ?? '').startsWith('__staff_jejaring__')) return true;
    const userId = finiteId(row.id_user);
    // Legacy detail responses can omit the marker and expose misleading action-role
    // labels. A known Jejaring user is stronger evidence than that display label.
    if (!hasMarker && userId) {
      if (jejaringUsers.has(userId) && !mainUsers.has(userId)) return true;
      if (mainUsers.has(userId) && !jejaringUsers.has(userId)) return false;
    }
    return !hasMarker && isJejaringRow(row);
  };
  const mainRows = statuses.filter(row => !isJejaringAssignment(row));
  const jejaring = statuses.find(isJejaringAssignment);

  return {
    roleUsers: mainRows.reduce<Record<string, number>>((values, row) => {
      const roleId = finiteId(row.id_action_role);
      const userId = finiteId(row.id_user);
      if (roleId && userId) values[String(roleId)] = userId;
      return values;
    }, {}),
    statusByRole: mainRows.reduce<Record<string, string>>((values, row) => {
      const roleId = finiteId(row.id_action_role);
      if (roleId && typeof row.status === 'string') values[String(roleId)] = row.status;
      return values;
    }, {}),
    staffJejaringUserId: finiteId(jejaring?.id_user),
  };
}