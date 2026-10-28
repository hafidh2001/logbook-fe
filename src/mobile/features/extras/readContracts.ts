import type { Row } from './contracts';

/** Numeric order is the current Native ExploreScreen/MilestoneScreen policy. */
export function orderSemesters(rows: Row[]): Row[] {
  const order = (row: Row) => Number(String(row.name || '').match(/\d+/)?.[0] ?? row.id);
  return [...rows].sort((a,b) => order(b)-order(a));
}
// Keep the directory badge policy aligned with Native mapExplorePpdsItemToDetail.
export function exploreBadgeColor(row: Row): string {
  return row.m_semester?.stage_color?.trim() || row.m_stase?.m_stage?.label_color?.trim() || row.label_color?.toString().trim() || '#087F5B';
}
function count(value: unknown): number | null {
  return (typeof value === 'number' || typeof value === 'string' && /^\d+$/.test(value)) && Number.isSafeInteger(Number(value)) && Number(value)>=0 ? Number(value) : null;
}
export type ExploreDirectory = {total:number|null;complete:boolean;sections:{semester:Row;rows:Row[];total:number|null}[]};
/** getListExplorePpds: api-backend.txt actionGetListExplorePpds returns user rows, not semesters.
 * Do not discard the envelope's total, or claim that a truncated page is the directory.
 * No undocumented lazy routes/parameters are invented when a deployment diverges.
 */
export function parseExploreDirectory(body: Row, semesters: Row[]): ExploreDirectory {
  if (body.success === false || body.status === false) throw new Error(body.message || 'Gagal memuat Explore.');
  if (!Array.isArray(body.data)) throw new Error('Format daftar Explore tidak valid.');
  const rows:Row[]=body.data;
  const total=count(body.total);
  const complete=body.has_more !== true && body.hasMore !== true && (total===null || total===rows.length);
  return {total,complete,sections:orderSemesters(semesters).map(semester=>{
    const members=rows.filter(row=>String(row.m_semester?.id ?? row.id_semester ?? row.semester_id ?? '')===String(semester.id));
    return {semester,rows:members,total:complete ? members.length : null};
  })};
}
export function exploreFiltersPayload(id_client:number, filters:{ppds_ids:string[];id_semester:string;id_stage:string;id_stase:string}):Record<string,unknown>{
  return {id_client,...(filters.ppds_ids.length?{ppds_ids:filters.ppds_ids.map(Number)}:{}),...Object.fromEntries(['id_semester','id_stage','id_stase'].filter(key=>filters[key as keyof typeof filters]).map(key=>[key,Number(filters[key as keyof typeof filters])]))};
}
