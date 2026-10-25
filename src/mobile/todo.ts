// READONLY reference: api-backend.txt actionGetTodo (1572-1587).
// The list returns id_action at the root; m_action contains name/identifier only.
// Unlike Detail, it does NOT promise m_action.id. Do not locally re-filter rows:
// assignment, pending/revised eligibility and the total belong to the server.
type Row = Record<string, any>;
function positiveId(value: unknown): number | null {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (!/^[1-9][0-9]*$/.test(String(value))) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}
function nonnegative(value: unknown): number | null {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (!/^(0|[1-9][0-9]*)$/.test(String(value))) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) ? number : null;
}
export function mergeTodoRows(previous: Row[], incoming: Row[]): Row[] {
  return Array.from(new Map([...previous, ...incoming].map(row => [String(row.id), row])).values());
}
export function parseTodoPage(result: Row, requestedPage: number, requestedLimit: number) {
  if (!Array.isArray(result.data)) throw new Error('Respons daftar To Do tidak valid.');
  const rows = result.data.map((row: Row) => {
    const id = positiveId(row?.id);
    const actionId = positiveId(row?.id_action) ?? positiveId(row?.m_action?.id);
    if (!id || !actionId) throw new Error('ID logbook atau aktivitas To Do tidak tersedia. Muat ulang daftar.');
    return {...row, id, id_action: actionId};
  });
  const paginated = result.page != null || result.limit != null || typeof result.has_more === 'boolean';
  const page = positiveId(result.page) ?? requestedPage;
  const limit = positiveId(result.limit) ?? requestedLimit;
  // An unpaginated legacy response is the complete array, not another 30-row page.
  const total = nonnegative(result.total) ?? (paginated ? null : rows.length);
  const hasMore = paginated
    ? typeof result.has_more === 'boolean' ? result.has_more : total !== null && page * limit < total
    : false;
  return {rows: mergeTodoRows([], rows), total, page, limit, paginated, hasMore};
}

export const TODO_PAGE_SIZE = 10;
const filterIds = ['id_stage', 'id_action', 'id_hospital'] as const;
function validDate(value: string | null): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
}
// URL is navigation context only. Actor and tenant always come from the login owner.
export function todoFilters(search: URLSearchParams): Row {
  const filters: Row = {};
  const ids = [...new Set((search.get('ppds_ids') || '').split(',').map(positiveId).filter((id): id is number => id !== null))];
  if(ids.length) filters.ppds_ids = ids;
  for(const key of filterIds) {const id=positiveId(search.get(key));if(id)filters[key]=id;}
  for(const key of ['start_date','end_date']) {const date=search.get(key);if(validDate(date))filters[key]=date;}
  return filters;
}
export function todoQuery(filters: Row, page = 1): URLSearchParams {
  const query = new URLSearchParams();
  if(Array.isArray(filters.ppds_ids) && filters.ppds_ids.length)query.set('ppds_ids',filters.ppds_ids.join(','));
  for(const key of [...filterIds,'start_date','end_date'])if(filters[key]!=null && filters[key]!=='')query.set(key,String(filters[key]));
  const clean=todoFilters(query);
  const result=new URLSearchParams();
  for(const [key,value] of Object.entries(clean))result.set(key,Array.isArray(value) ? value.join(',') : String(value));
  if(Number.isSafeInteger(page) && page>1)result.set('page',String(page));
  return result;
}
export function safeTodoReturn(value: string | null): string | null {
  if(!value || !value.startsWith('/') || value.startsWith('//'))return null;
  try {
    const url=new URL(value,'https://todo.invalid');
    if(url.origin!=='https://todo.invalid' || !['/mobile','/mobile/todo'].includes(url.pathname))return null;
    const query=todoQuery(todoFilters(url.searchParams),Number(url.searchParams.get('page')) || 1).toString();
    return url.pathname+(query ? `?${query}` : '');
  } catch {return null;}
}
