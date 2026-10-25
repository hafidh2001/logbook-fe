import type { Row as GetLogbookItem } from './model';

export type ExamParticipant = {
  id?: number;
  label: string;
};

function displayText(value: unknown): string {
  return value === null || value === undefined ? '' : String(value).trim();
}

/** Resolves the assigned PPDS across current and legacy logbook payload shapes. */
export function getInitialExamParticipant(record: GetLogbookItem): ExamParticipant {
  const raw = record as Record<string, any>;
  const user = (record.m_user ?? raw.user) as Record<string, unknown> | undefined;
  const id = Number(raw.id_user ?? raw.ppds_id ?? user?.id ?? user?.id_user);
  const label = displayText(
    user?.display_name ?? user?.name ?? raw.ppds_name ?? raw.user_name,
  );
  return {
    id: Number.isFinite(id) && id > 0 ? id : undefined,
    label,
  };
}

/** Keeps the persisted PPDS visible while asynchronously loaded choices catch up. */
export function mergeCurrentExamParticipant<T extends { id: number; label: string }>(
  options: T[],
  current: ExamParticipant,
): T[] {
  if (!current.id || !current.label || options.some(option => option.id === current.id)) {
    return options;
  }
  return [{ id: current.id, label: current.label } as T, ...options];
}