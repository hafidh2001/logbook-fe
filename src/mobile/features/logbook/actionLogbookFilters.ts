import type { Row as GetLogbookItem } from './model';
import type { UserRole } from './dynamicLogbookForm';
const isStaffRole = (role: UserRole) => role === 'staff';
import type { DynamicChoice, DynamicLogbookAction } from './dynamicLogbookForm';
import { enabled } from './dynamicLogbookForm';

export type ActionLogbookFilterField =
  | 'start_date'
  | 'end_date'
  | 'title'
  | 'ppds'
  | 'staff'
  | 'staff_jejaring'
  | 'another_role'
  | 'hospital'
  | 'category'
  | 'presentation'
  | 'stase'
  | 'exam_result';

export type ActionLogbookFilters = {
  startDate?: Date;
  endDate?: Date;
  title?: string;
  ppdsId?: number;
  staffId?: number;
  staffJejaringId?: number;
  isPresentation?: boolean;
  anotherRoleId?: number;
  hospitalId?: number;
  categoryId?: number;
  staseId?: number;
  examResult?: string;
};

const actionSource = (action: DynamicLogbookAction) =>
  `${action.identifier ?? ''} ${action.name ?? ''} ${
    action.action_type_name ?? ''
  }`
    .toLowerCase()
    .replace(/[_\s/]+/g, '-');

/** Mirrors Prasi's per-action FilterDefinition, using stable relation IDs. */
export function getActionLogbookFilterFields(
  action: DynamicLogbookAction,
  userRole: UserRole = 'ppds',
): ActionLogbookFilterField[] {
  const source = actionSource(action);
  const dateRange: ActionLogbookFilterField[] = ['start_date', 'end_date'];
  // Auth normalizes Staff Jejaring to Staff. Filters only narrow the server's
  // existing ownership/assignment scope; they never choose the viewer identity.
  const withParticipant = (fields: ActionLogbookFilterField[], hasVerifier = true): ActionLogbookFilterField[] => [
    ...fields,
    ...(isStaffRole(userRole) ? ['ppds' as const] : userRole === 'ppds' && hasVerifier ? ['staff' as const, 'staff_jejaring' as const] : []),
  ];
  if (enabled(action.is_exam)) return withParticipant([...dateRange, 'exam_result', 'category'], false);
  if (enabled(action.is_milestone)) return withParticipant(['stase', ...dateRange], false);
  if (/bimbingan-operasi/.test(source))
    return withParticipant([...dateRange, 'category', 'presentation']);
  if (/kamar-operasi|poli|jaga|igd|emergency/.test(source))
    return withParticipant([...dateRange, 'another_role', 'hospital']);
  if (/bangsal/.test(source))
    return withParticipant([...dateRange, 'another_role', 'category', 'hospital']);
  if (/exam/.test(source)) return withParticipant([...dateRange, 'exam_result', 'category'], false);
  if (/course/.test(source)) return withParticipant([...dateRange, 'title']);
  if (/review-artikel/.test(source))
    return withParticipant([...dateRange, 'category']);
  if (/morbiditas/.test(source)) return withParticipant(dateRange);
  if (/pengabdian|ekstra/.test(source))
    return withParticipant(['title', ...dateRange]);
  if (/ilmiah/.test(source)) return withParticipant([...dateRange, 'category']);
  if (/publikasi/.test(source)) return withParticipant(dateRange);
  if (/thesis|tesis|seminar/.test(source))
    return withParticipant(['title', ...dateRange]);
  if (/stase/.test(source)) return withParticipant(['stase', ...dateRange], false);
  return dateRange;
}

/** Drop stale values from fields hidden by the current action/login role. */
export function sanitizeActionLogbookFilters(
  filters: ActionLogbookFilters,
  action: DynamicLogbookAction,
  userRole: UserRole = 'ppds',
): ActionLogbookFilters {
  const fields = getActionLogbookFilterFields(action, userRole);
  const keys: Record<ActionLogbookFilterField, keyof ActionLogbookFilters> = {
    start_date: 'startDate', end_date: 'endDate', title: 'title',
    ppds: 'ppdsId', staff: 'staffId', staff_jejaring: 'staffJejaringId', another_role: 'anotherRoleId',
    hospital: 'hospitalId', category: 'categoryId', presentation: 'isPresentation',
    stase: 'staseId', exam_result: 'examResult',
  };
  return Object.fromEntries(fields.flatMap(field => {
    const key = keys[field];
    return filters[key] !== undefined ? [[key, filters[key]]] : [];
  })) as ActionLogbookFilters;
}

const dateOnly = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

const recordDate = (value: unknown) => {
  const parsed = new Date(String(value ?? '').replace(' ', 'T'));
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.getTime();
};

const numericId = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

/** Client filtering is exact over all rows returned by the current endpoint. */
export function applyActionLogbookFilters(
  records: GetLogbookItem[],
  filters: ActionLogbookFilters,
): GetLogbookItem[] {
  const title = filters.title?.trim().toLowerCase();
  const examResult = filters.examResult?.trim().toLowerCase();
  const start = filters.startDate ? dateOnly(filters.startDate) : undefined;
  const end = filters.endDate
    ? dateOnly(filters.endDate) + 24 * 60 * 60 * 1000 - 1
    : undefined;

  return records.filter(record => {
    // Each selected verifier is an independent AND constraint over child rows.
    // Server-paginated feeds use the server predicate, not this local projection.
    for (const staffId of [filters.staffId, filters.staffJejaringId]) {
      if (staffId !== undefined && !record.t_logbook_status?.some((status: GetLogbookItem) =>
        !status.deleted_at && numericId(status.id_user ?? status.m_user?.id) === staffId,
      )) return false;
    }
    const date = recordDate(record.date);
    if (start !== undefined && (date === undefined || date < start))
      return false;
    if (end !== undefined && (date === undefined || date > end)) return false;
    if (
      title &&
      !String(record.title ?? '')
        .toLowerCase()
        .includes(title)
    )
      return false;
    if (
      filters.ppdsId !== undefined &&
      numericId(record.id_user ?? record.m_user?.id) !== filters.ppdsId
    )
      return false;
    if (
      examResult &&
      String(record.exam_result ?? '')
        .trim()
        .toLowerCase() !== examResult
    )
      return false;
    if (
      filters.hospitalId !== undefined &&
      numericId(record.id_hospital ?? record.m_hospital?.id) !==
        filters.hospitalId
    )
      return false;
    if (
      filters.categoryId !== undefined &&
      numericId(record.id_category ?? record.m_action_category?.id) !==
        filters.categoryId
    )
      return false;
    if (
      filters.anotherRoleId !== undefined &&
      numericId(record.id_another_role ?? record.m_another_role?.id) !==
        filters.anotherRoleId
    )
      return false;
    if (
      filters.staseId !== undefined &&
      numericId(record.id_stase ?? record.m_stase?.id) !== filters.staseId
    )
      return false;
    return true;
  });
}

export function toActionLogbookFilterPayload(filters: ActionLogbookFilters) {
  const format = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;
  return {
    ...(filters.startDate ? { start_date: format(filters.startDate) } : {}),
    ...(filters.endDate ? { end_date: format(filters.endDate) } : {}),
    ...(filters.title?.trim() ? { title: filters.title.trim() } : {}),
    ...(filters.ppdsId !== undefined ? { id_ppds: filters.ppdsId } : {}),
    ...(filters.staffId !== undefined ? { id_staff: filters.staffId } : {}),
    ...(filters.staffJejaringId !== undefined ? { id_staff_jejaring: filters.staffJejaringId } : {}),
    ...(filters.isPresentation !== undefined
      ? { is_presentation: filters.isPresentation }
      : {}),
    ...(filters.hospitalId !== undefined
      ? { id_hospital: filters.hospitalId }
      : {}),
    ...(filters.categoryId !== undefined
      ? { id_category: filters.categoryId }
      : {}),
    ...(filters.anotherRoleId !== undefined
      ? { id_another_role: filters.anotherRoleId }
      : {}),
    ...(filters.staseId !== undefined ? { id_stase: filters.staseId } : {}),
    ...(filters.examResult?.trim()
      ? { exam_result: filters.examResult.trim() }
      : {}),
  };
}

export function hasActionLogbookFilters(filters: ActionLogbookFilters) {
  return Object.values(filters).some(
    value => value !== undefined && value !== '',
  );
}

export function distinctFilterChoices(
  choices: DynamicChoice[],
  records: GetLogbookItem[],
  field: 'hospital' | 'category' | 'another_role' | 'stase',
): DynamicChoice[] {
  if (choices.length) return choices;
  const values = records.flatMap(record => {
    const nested =
      field === 'hospital'
        ? record.m_hospital
        : field === 'category'
        ? record.m_action_category
        : field === 'another_role'
        ? record.m_another_role
        : record.m_stase;
    const nestedRecord = nested as
      | { id?: unknown; name?: unknown; role_name?: unknown }
      | null
      | undefined;
    const id = numericId(
      (record as Record<string, unknown>)[`id_${field}`] ?? nestedRecord?.id,
    );
    const label =
      field === 'another_role' ? nestedRecord?.role_name : nestedRecord?.name;
    return id !== undefined && typeof label === 'string' && label.trim()
      ? [{ id, label: label.trim() }]
      : [];
  });
  return values.filter(
    (choice, index) =>
      values.findIndex(item => item.id === choice.id) === index,
  );
}