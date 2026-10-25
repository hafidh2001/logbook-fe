type StatusRow = {
  id_user?: number | null;
  m_user?: { id?: number | null } | null;
  deleted_at?: unknown;
  status?: string | null;
  id_action_role?: number | null;
  m_action_role?: { id?: number | null; role?: string | null; identifier?: string | null } | null;
  role?: string | null;
  identifier?: string | null;
};

type MorbiditasSlot = 0 | 1 | 2 | 99;

const pending = (value: unknown) => ['pending', 'revised', 'revision', ''].includes(
  String(value ?? '').trim().toLowerCase(),
);

const slot = (row: StatusRow): MorbiditasSlot => {
  const source = `${row.m_action_role?.identifier ?? row.identifier ?? ''} ${row.m_action_role?.role ?? row.role ?? ''}`.toLowerCase();
  if (/\bkps\b/.test(source)) return 2;
  if (/pelapor|reporter/.test(source)) return 0;
  if (/penilai|gkm|assessor/.test(source)) return 1;
  return 99;
};

const slotLabel = (value: MorbiditasSlot) =>
  value === 0 ? 'Pelapor' : value === 1 ? 'Penilai/GKM' : value === 2 ? 'KPS' : 'pejabat Morbiditas';

const orderedRows = (statuses: StatusRow[] | null | undefined) =>
  (Array.isArray(statuses) ? statuses : [])
    .filter(row => row.deleted_at == null && Number(row.id_user ?? row.m_user?.id) > 0 && slot(row) !== 99)
    .sort((a, b) => slot(a) - slot(b));

/** Latest policy is scoped to authoritative Pelapor === KPS user IDs only. */
export function hasSameMorbiditasPelaporKps(statuses: StatusRow[] | null | undefined) {
  const rows = orderedRows(statuses);
  const pelapor = rows.filter(row => slot(row) === 0);
  const kps = rows.filter(row => slot(row) === 2);
  return pelapor.length === 1 && kps.length === 1 &&
    Number(pelapor[0].id_user ?? pelapor[0].m_user?.id) === Number(kps[0].id_user ?? kps[0].m_user?.id);
}

function predecessorBlock(rows: StatusRow[], row: StatusRow): string | null {
  for (let previous = 0; previous < slot(row); previous += 1) {
    const predecessors = rows.filter(item => slot(item) === previous);
    if (!predecessors.length || !predecessors.every(item => String(item.status).toLowerCase() === 'verified')) {
      return `Menunggu verifikasi ${slotLabel(previous as MorbiditasSlot)} terlebih dahulu.`;
    }
  }
  return null;
}

export function isMorbiditasKpsVerifyOnly(statuses: StatusRow[] | null | undefined, roleId: number) {
  return hasSameMorbiditasPelaporKps(statuses) && orderedRows(statuses).some(row =>
    Number(row.id_action_role ?? row.m_action_role?.id) === roleId && slot(row) === 2);
}

/** Shared selector, batch, footer and press-time transition policy. */
export function getMorbiditasAllowedTransitions(statuses: StatusRow[] | null | undefined, row: StatusRow) {
  const rows = orderedRows(statuses);
  const state = String(row.status ?? '').trim().toLowerCase();
  if (rows.length && rows.every(item => String(item.status).toLowerCase() === 'verified')) return [];
  const scoped = hasSameMorbiditasPelaporKps(rows);
  if (scoped && slot(row) === 2) {
    return (pending(state) || state === 'rejected') && !predecessorBlock(rows, row) ? ['verified'] : [];
  }
  if (scoped && slot(row) === 0) {
    const penilai = rows.find(item => slot(item) === 1);
    const atomicPair = penilai && Number(penilai.id_user ?? penilai.m_user?.id) === Number(row.id_user ?? row.m_user?.id);
    if (!atomicPair && (!penilai || !pending(penilai.status))) return [];
  }
  if (['verified', 'rejected'].includes(state)) {
    return ['revised'];
  }
  return pending(state) && !predecessorBlock(rows, row) ? ['verified', 'rejected'] : [];
}

/** Prefer an eligible forward slot (including legacy rejected KPS recovery),
 * then a permitted terminal rollback. Never fall back to a locked Pelapor. */
export function getMorbiditasStaffActionRow<T extends StatusRow>(
  statuses: T[] | null | undefined, currentUserId: number,
): T | undefined {
  const rows = orderedRows(statuses) as T[];
  const mine = rows.filter(row => Number(row.id_user ?? row.m_user?.id) === currentUserId);
  return mine.find(row => getMorbiditasAllowedTransitions(rows, row).includes('verified')) ??
    mine.find(row => getMorbiditasAllowedTransitions(rows, row).includes('revised'));
}

/** Prasi-Bun gate: Pelapor -> Penilai/GKM -> KPS, including legacy KPS recovery. */
export function getMorbiditasSequentialBlockReason(
  statuses: StatusRow[] | null | undefined, currentUserId: number,
): string | null {
  const rows = orderedRows(statuses);
  const current = getMorbiditasStaffActionRow(rows, currentUserId);
  const blocked = rows.find(row => Number(row.id_user ?? row.m_user?.id) === currentUserId && pending(row.status));
  return current ? predecessorBlock(rows, current) : blocked ? predecessorBlock(rows, blocked) : 'Tidak ada role Morbiditas yang dapat diproses untuk Anda.';
}

/** Preview only: the server derives this pair inside its locked transaction.
 * KPS and unrelated roles never join Pelapor/Penilai, even for the same actor.
 */
export function getMorbiditasVerificationBatchRoleIds(
  statuses: StatusRow[] | null | undefined,
  currentUserId: number,
  transition: 'verified' | 'rejected' | 'revised' = 'verified',
): number[] {
  const rows = orderedRows(statuses);
  const mine = rows.filter(row => Number(row.id_user ?? row.m_user?.id) === currentUserId);
  const current = transition === 'revised'
    ? mine.find(row => getMorbiditasAllowedTransitions(rows, row).includes('revised'))
    : getMorbiditasStaffActionRow(rows, currentUserId);
  if (!current || !getMorbiditasAllowedTransitions(rows, current).includes(transition)) return [];
  const targets = slot(current) === 2 ? [current] : mine.filter(row => slot(row) < 2);
  return [...new Set(targets.map(row => Number(row.id_action_role ?? row.m_action_role?.id))
    .filter(id => Number.isInteger(id) && id > 0))];
}

export function hasMorbiditasVerificationSlots(statuses: StatusRow[] | null | undefined): boolean {
  const slots = new Set(orderedRows(statuses).map(slot));
  return slots.has(0) && slots.has(1) && slots.has(2);
}

export function isMorbiditasRecord(action: { identifier?: string | null; name?: string | null } | null | undefined) {
  return /morbiditas/.test(`${action?.identifier ?? ''} ${action?.name ?? ''}`.toLowerCase());
}
