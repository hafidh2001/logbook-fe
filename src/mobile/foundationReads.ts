// Pure response seams, verified against READONLY Mobile masterApi.ts.
type Row = Record<string, any>;
export type FoundationActor = {id: number; id_client: number; id_semester: number | null};
export function masterActionPayload(user: FoundationActor) {
  // Native's allow-all case is ONLY semester === 0; do not substitute 0 for null.
  return {id_client:user.id_client,id_semester:user.id_semester ?? null};
}
export function requireRows(result: Row, label: string): Row[] {
  if (!Array.isArray(result.data)) throw new Error(`Respons ${label} tidak valid.`);
  return result.data;
}
export function visibleMenuActions(actions: Row[], configured: unknown): Row[] {
  if (!Array.isArray(configured)) throw new Error('Konfigurasi menu tidak valid.');
  const ids = configured.map(Number);
  return actions.filter(action => {
    const name = String(action.action_name ?? '').trim().toLowerCase();
    return name && !['test','testing'].includes(name) && (!ids.length || ids.includes(Number(action.id_action ?? action.id)));
  });
}
export async function readHomeMenus(user: FoundationActor, request: (endpoint:string,payload:Row)=>Promise<Row>, isCurrent:()=>boolean = ()=>true) {
  // Native Home loads preferences only after the catalog succeeds.
  const menu = await request('getMasterAction', masterActionPayload(user));
  if(!isCurrent()) throw new Error('Sesi atau permintaan menu telah berubah.');
  const actions = requireRows(menu, 'menu');
  const config = await request('getMenuConfig', {id_user:String(user.id),id_client:user.id_client});
  if (!Array.isArray(config.data)) throw new Error('Konfigurasi menu tidak valid.');
  return {actions,visible:config.data.map(Number),filtered:visibleMenuActions(actions,config.data)};
}
export function parseDashboardState(result: Row, user: Pick<FoundationActor,'id'|'id_client'>): Row {
  const data = result.data;
  const validId = (value: unknown) => value === null || (typeof value === 'number' && Number.isSafeInteger(value) && value > 0);
  if (result.success !== true || result.status === false || !data || data.id_user !== user.id || data.id_client !== user.id_client
    || !validId(data.id_semester) || !validId(data.id_stase)
    || !(data.semester_name === null || typeof data.semester_name === 'string')
    || !(data.stase_name === null || typeof data.stase_name === 'string')
    || typeof data.total_points !== 'number' || !Number.isFinite(data.total_points)) {
    throw new Error(result.message || 'Data dashboard tidak valid atau tidak sesuai sesi.');
  }
  return data;
}
export function parseNotificationPage(result: Row, requestedPage:number, requestedLimit=30) {
  const rows = requireRows(result, 'notifikasi');
  const number = (value:unknown) => (typeof value==='number' || typeof value==='string') && /^(0|[1-9][0-9]*)$/.test(String(value)) && Number.isSafeInteger(Number(value)) ? Number(value) : null;
  const total = number(result.total);
  const page = number(result.page) || requestedPage;
  const limit = number(result.limit) || requestedLimit;
  const hasMore = typeof result.has_more==='boolean' ? result.has_more : total!==null && total>page*limit;
  return {rows,total,page,limit,hasMore,unreadTotal:number(result.unread_total)};
}
export function mergeNotificationRows(previous:Row[],incoming:Row[]) {
  const rows:Row[]=[]; const indices=new Map<string,number>();
  for(const row of [...previous,...incoming]) {
    if(row.id==null){rows.push(row);continue;}
    const key=String(row.id), index=indices.get(key);
    if(index===undefined){indices.set(key,rows.length);rows.push(row);}else rows[index]=row;
  }
  return rows;
}
