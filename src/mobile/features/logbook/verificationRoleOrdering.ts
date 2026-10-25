type RecordValue = Record<string, unknown>;

const asRecord = (value: unknown): RecordValue | undefined =>
  value !== null && typeof value === 'object' ? value as RecordValue : undefined;

const text = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

/** Resolves the role label emitted by both nested and legacy status fixtures. */
export function getVerifierRoleLabel(entry: unknown): string | undefined {
  const row = asRecord(entry);
  const actionRole = asRecord(row?.m_action_role);
  return text(actionRole?.role) ?? text(row?.role) ?? text(actionRole?.identifier);
}

function normalizedRole(value: string) {
  return value.trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
}

type OrderedRole = { group: 0 | 1; number: number };

function orderedRole(value: string): OrderedRole | undefined {
  const label = normalizedRole(value);
  const match = label.match(/^(pembimbing|penguji)(?:\s+(\d+))?$/);
  if (!match) return undefined;
  return {
    group: match[1] === 'pembimbing' ? 0 : 1,
    // An unnumbered role is slot one only when it is exactly Pembimbing/Penguji.
    number: Number(match[2] ?? 1),
  };
}

function isOrderedThesisOrSeminarWorkflow(action: unknown) {
  const value = asRecord(action);
  const source = `${text(value?.identifier) ?? ''} ${text(value?.name) ?? ''}`.toLowerCase();
  return /proposal[-_\s]*thesis|proposal[-_\s]*tesis|\bthesis\b|\btesis\b|seminar[-_\s]*hasil/.test(source);
}

function isMorbiditasWorkflow(action: unknown) {
  const value = asRecord(action);
  return /morbiditas/i.test(`${text(value?.identifier) ?? ''} ${text(value?.name) ?? ''}`);
}

function morbiditasRole(value: string): OrderedRole | undefined {
  const label = normalizedRole(value);
  // Keep the aliases already recognised by the Morbiditas presentation path.
  if (/pelapor|reporter/.test(label)) return { group: 0, number: 0 };
  if (/penilai|gkm|assessor/.test(label)) return { group: 0, number: 1 };
  if (/\bkps\b/.test(label)) return { group: 0, number: 2 };
  return undefined;
}

/** Pure, stable action-scoped presentation ordering. Never merges actor rows.
 * Morbiditas: Pelapor → Penilai/GKM → KPS; Thesis/Seminar: Pembimbing → Penguji.
 * Unknown roles follow recognised roles in source order; other actions are untouched.
 */
export function sortOrderedVerifierRoles<T>(
  entries: readonly T[],
  action: unknown,
  getRole: (entry: T) => string | undefined,
): T[] {
  const classifyRole = isMorbiditasWorkflow(action) ? morbiditasRole
    : isOrderedThesisOrSeminarWorkflow(action) ? orderedRole : undefined;
  if (!classifyRole) return [...entries];

  const indexed = entries.map((entry, index) => ({
    entry,
    index,
    role: classifyRole(getRole(entry) ?? ''),
  }));
  if (!indexed.some(item => item.role)) return [...entries];

  return indexed.sort((left, right) => {
    if (!left.role || !right.role) {
      if (!left.role && !right.role) return left.index - right.index;
      return left.role ? -1 : 1;
    }
    return left.role.group - right.role.group ||
      left.role.number - right.role.number ||
      left.index - right.index;
  }).map(item => item.entry);
}