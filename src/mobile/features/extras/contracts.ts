export type Actor = { id: number; id_client: number; id_role?: number; role_name?: string; display_name?: string; username?: string; code?: string; [key: string]: unknown };
export function mobileRole(user: Pick<Actor, 'id_role' | 'role_name'>): 'ppds' | 'staff' | 'excluded' {
  const role = String(user.role_name || '').trim().toLowerCase();
  if (role === 'ppds' || Number(user.id_role) === 5) return 'ppds';
  return role === 'staff' || role === 'staff jejaring' ? 'staff' : 'excluded';
}
export type Row = Record<string, any>;
export type Masters = {ppds: Row[]; stases: Row[]; semesters: Row[]};
export function positiveId(value: unknown): number {
  if ((typeof value !== 'number' && (typeof value !== 'string' || !/^[1-9]\d*$/.test(value))) || !Number.isSafeInteger(Number(value)) || Number(value) < 1) throw new Error('ID tidak valid.');
  return Number(value);
}
export function milestonePayload(actor: Actor, form: Row, masters: Masters): Record<string, unknown> {
  if (mobileRole(actor) !== 'staff') throw new Error('Hanya Staff dapat mengelola milestone.');
  const id_user = positiveId(form.id_user), id_stase = positiveId(form.id_stase), id_semester = positiveId(form.id_semester), id_stage = positiveId(form.id_stage);
  if (!masters.ppds.some(row => Number(row.id) === id_user)) throw new Error('Pilih PPDS dari daftar server.');
  if (!masters.stases.some(row => Number(row.id) === id_stase && Number(row.id_stage) === id_stage) || !masters.semesters.some(row => Number(row.id) === id_semester && Number(row.id_stage) === id_stage)) throw new Error('Stase dan Semester harus berada pada Stage yang sama.');
  if (typeof form.date !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d)?$/.test(form.date) || !Number.isFinite(new Date(form.date).getTime())) throw new Error('Tanggal wajib diisi.');
  return {...(form.id ? {id: positiveId(form.id)} : {}), created_by:positiveId(actor.id),id_client:positiveId(actor.id_client), id_user,id_stase,id_semester,id_stage,date:form.date.replace('T',' ').slice(0,16)+':00',notes:String(form.notes || '').trim(),is_retake:form.is_retake === true};
}
export function undoPayload(actor: Actor, target: number, preview: Row): Record<string, unknown> {
  if (mobileRole(actor) !== 'staff' || preview.id_user !== target || preview.can_undo !== true || preview.will_archive_transition !== true || !['archive_logbook_id','current_session_id','restore_session_id'].every(key=>Number.isSafeInteger(preview[key]) && preview[key]>0)) throw new Error('Preview Undo tidak sesuai. Refresh status terlebih dahulu.');
  return {created_by:positiveId(actor.id),id_client:positiveId(actor.id_client),id_user:positiveId(target),id_logbook:positiveId(preview.archive_logbook_id),expected_current_session_id:positiveId(preview.current_session_id),expected_restore_session_id:positiveId(preview.restore_session_id)};
}
export function exploreUserId(row: Row): number | null {
  try { return positiveId(row.id_user ?? row.user_id ?? row.m_user?.id ?? row.id); } catch { return null; }
}
export function exploreActions(detail: Row): Row[] {
  // Current Native ExploreScreen.tsx EXPLORE_METRIC_ORDER + mapExplorePpdsDetailToView.
  // Match by identifiers, not relation ID guesses or catalogue ordering.
  const metrics: Array<[string,string[]]> = [
    ['Exam',['exam']],['Morbiditas',['morbiditas']],['Course',['course']],
    ['Review Artikel',['review-artikel']],['Bimbingan Operasi',['bimbingan-operasi','bimbingan']],
    ['Pengabdian Masyarakat',['pengabdian-masyarakat','pengabdian','masyarakat']],
    ['Ekstrakulikuler',['ekstrakulikuler','ekstrakurikuler','extra','ekstra']],
    ['Ilmiah Stase',['ilmiah-stase','ilmiah']],['Proposal Thesis',['proposal-thesis','thesis']],
    ['Seminar Hasil',['seminar-hasil','seminar']],['Ilmiah Non Stase',['ilmiah-non-stase','ilmiah-non']],
    ['Publikasi',['publikasi']],['Kegiatan Poli Klinik',['poli']],
    ['Kegiatan Jaga / IGD / Emergency',['jaga']],['Kegiatan Bangsal',['bangsal']],['Kegiatan Kamar Operasi',['kamar-operasi']],
  ];
  const ids=new Map<string,number>(), counts=new Map<string,number>();
  for(const action of detail.m_actions || []) {
    const key=String(action.identifier || '').trim().toLowerCase(),id=Number(action.id ?? action.id_action);
    if(key && Number.isSafeInteger(id) && id>0 && !ids.has(key))ids.set(key,id);
  }
  for(const log of detail.t_logbook || []) {
    const key=String(log.m_action?.identifier || '').trim().toLowerCase(),id=Number(log.m_action?.id);
    if(!key)continue;
    counts.set(key,(counts.get(key) || 0)+1);
    if(!ids.has(key) && Number.isSafeInteger(id) && id>0)ids.set(key,id);
  }
  return metrics.map(([name,identifiers])=>({name,identifier:identifiers[0],id:identifiers.map(key=>ids.get(key)).find(id=>Number.isFinite(id)),count:identifiers.reduce((total,key)=>total+(counts.get(key) || 0),0)}));
}
export function exploreHref(actionId: unknown, userId: unknown): string {
  return `/mobile/explore/${positiveId(userId)}/logbooks/${positiveId(actionId)}`;
}
export type MilestoneFilters = {ppds_ids:string[];id_stase:string;start:string;end:string;query:string;repeat:string};
export function filterMilestones(rows:Row[], filters:MilestoneFilters):Row[] {
  // Native's Indonesia-local activity-day semantics, pinned to WIB in the browser; creation tie-break unchanged.
  const timestamp=(value:unknown)=>{
    if(!value)return 0;
    const raw=String(value).trim().replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}(?:\.\d+)?)/,'$1T$2').replace(/([+-]\d{2})(\d{2})$/,'$1:$2').replace(/([+-]\d{2})$/,'$1:00');
    const parsed=new Date(/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d+)?)?$/.test(raw)?raw+'+07:00':raw).getTime();return Number.isNaN(parsed)?0:parsed;
  };
  const bound=(day:string,next=false)=>{const [year,month,date]=day.split('-').map(Number);return Date.UTC(year,month-1,date+(next?1:0))-7*60*60*1000;};
  return rows.filter(row=>{
    const day=timestamp(row.date);
    return (!filters.ppds_ids.length || filters.ppds_ids.some(id=>Number(id)===Number(row.m_user?.id ?? row.id_user)))
      && (!filters.id_stase || Number(row.m_stase?.id ?? row.id_stase)===Number(filters.id_stase))
      && (!filters.start || day>=bound(filters.start)) && (!filters.end || day<bound(filters.end,true))
      && (!filters.repeat || (row.is_retake===true)===(filters.repeat==='yes'))
      && [row.m_user?.display_name,row.m_stase?.name,row.notes,row.m_action?.name].join(' ').toLowerCase().includes(filters.query.trim().toLowerCase());
  }).sort((a,b)=>timestamp(b.created_date ?? b.date)-timestamp(a.created_date ?? a.date) || Number(b.id)-Number(a.id));
}
/** getProfile deliberately refreshes only the non-sensitive Mobile overview fields. */
export function profileOverview(actor: Pick<Actor,'id'|'id_client'>, row: Row): Row {
  if(!row || Number(row.id)!==actor.id || Number(row.id_client)!==actor.id_client) throw new Error('Identitas profil tidak sesuai sesi.');
  const data:Row={};
  for(const key of ['display_name','username','client_name','semester_name','stase_name']) {
    if(typeof row[key]==='string')data[key]=row[key];
    else if(row[key]===null && (key==='semester_name'||key==='stase_name'))data[key]='';
  }
  for(const key of ['id_semester','id_stase']) {
    if(row[key]===null)data[key]=null;
    else if((typeof row[key]==='number'||typeof row[key]==='string' && /^\d+$/.test(row[key])) && Number.isSafeInteger(Number(row[key])) && Number(row[key])>=0)data[key]=Number(row[key]);
  }
  return data;
}
