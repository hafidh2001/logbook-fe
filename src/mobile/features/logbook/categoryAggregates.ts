// READONLY Mobile src/api/masterApi.ts parseBimbinganCategoryAggregates contract.
export type CategoryAggregate = {
  id: number;
  label: string;
  count: number;
  presentation: number;
  presented: number;
};
export function categoryAggregates(value: unknown): CategoryAggregate[] | undefined {
  if (!Array.isArray(value)) return;
  const seen = new Set<number>();
  const result: CategoryAggregate[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') return;
    const id = Number(item.id),
      count = Number(item.count),
      presentation = Number(item.presentationCount),
      presented = Number(item.presentedCount);
    const label = typeof item.label === 'string' ? item.label.trim() : '';
    if (
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      seen.has(id) ||
      !label ||
      ![count, presentation, presented].every((n) => Number.isSafeInteger(n) && n >= 0)
    )
      return;
    seen.add(id);
    result.push({ id, label, count, presentation, presented });
  }
  return result;
}
