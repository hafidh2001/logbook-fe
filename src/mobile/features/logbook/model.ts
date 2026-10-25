import { enabled, getDynamicLogbookFields, getDynamicAsmParams, getDynamicCategories, getDynamicHospitals, getDynamicAnotherRoles, getDynamicStases, getDynamicRoleMaps, getRequiredDynamicVerifierRoleIds, shouldShowDynamicScoreFields, buildDynamicCreateLogbookPayload, type DynamicLogbookFormValues, type DynamicLogbookAction, type UserRole } from './dynamicLogbookForm';
import { getMorbiditasStaffActionRow, getMorbiditasAllowedTransitions, getMorbiditasSequentialBlockReason, hasMorbiditasVerificationSlots, isMorbiditasRecord } from './morbiditasVerificationBatch';
import { getJejaringSequentialBlockReason, isJejaringStatusRow } from './jejaringVerification';
import { getInitialExamParticipant } from './ActionLogbookEditParticipant';
import { getInitialRelationIds } from './ActionLogbookEditRelations';
import { getEligibleStaffJejaringConfig } from './dynamicLogbookForm';
export type Row = Record<string, any>;
export const arr = (v: unknown): Row[] => Array.isArray(v) ? v : [];
export function normalizeRole(role: unknown): UserRole { return /staff/i.test(String(role)) ? 'staff' : /ppds/i.test(String(role)) ? 'ppds' : 'institution-admin'; }
export function fieldsFor(action: DynamicLogbookAction, role: UserRole) {
  const scientific = /ilmiah[-_\s]*(non[-_\s]*)?stase|proposal[-_\s]*(thesis|tesis)|publikasi|review[-_\s]*artikel|seminar[-_\s]*hasil|course|ekstrakurikuler|pengabdian[-_\s]*masyarakat/i.test(`${action.identifier} ${action.name}`);
  return getDynamicLogbookFields(action, role).filter(f => !(f.key === 'hospital' && role === 'ppds' && scientific));
}
/** Server timestamps without a zone are wall times, not UTC. Keep seconds. */
export function dateInput(value: unknown): string {
  if (typeof value !== 'string' || !value) return localNow();
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(value)) return value.replace(' ', 'T');
  const d = new Date(value); if (!Number.isFinite(d.getTime())) return '';
  return localNow(d);
}
export function localNow(d = new Date()) { const pad = (v:number) => String(v).padStart(2,'0'); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; }
export function payloadDate(value: string, original?: string) {
  if (original && dateInput(original) === value) return original;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value) || !Number.isFinite(new Date(value).getTime())) throw new Error('Tanggal tidak valid.');
  return `${value.replace('T',' ')}${value.length===16?':00':''}`;
}
export function valuesFromRecord(record: Row, action?: DynamicLogbookAction): DynamicLogbookFormValues {
  const emr = arr(record.t_logbook_emr)[0] ?? {};
  const recordStaseId=Number(record.id_stase ?? record.m_user?.id_stase);
  const relations=getInitialRelationIds(record,action ? {
    mainUserIds:getDynamicRoleMaps(action).flatMap(role=>role.users.map(user=>user.id)),
    jejaringUserIds:getEligibleStaffJejaringConfig(action,recordStaseId)?.users.map(user=>user.id),
  } : {});
  return {date: new Date(dateInput(record.date)),title:record.title??'',notes:record.notes??'',location:record.location??'',is_presentation:enabled(record.is_presentation),categoryId:Number(record.id_category??record.m_action_category?.id)||undefined,hospitalId:Number(record.id_hospital??record.m_hospital?.id)||undefined,anotherRoleId:Number(record.id_another_role??record.m_another_role?.id)||undefined,staseId:Number(record.id_stase??record.m_stase?.id)||undefined,is_retake:enabled(record.is_retake),exam_result:record.exam_result??'',participantId:getInitialExamParticipant(record).id,roleUsers:relations.roleUsers,staffJejaringUserId:relations.staffJejaringUserId,emr:Object.fromEntries(Object.entries(emr).map(([k,v])=>[k,v==null?'':String(v)])),asm:Object.fromEntries(arr(record.t_logbook_asm).map(s=>[s.id_asm_param,s.score]))};
}
function invalidEmrMonth(action: DynamicLogbookAction, values: DynamicLogbookFormValues, role: UserRole) {
  if (!fieldsFor(action,role).some(f=>f.key==='emr') || /morbiditas/i.test(`${action.identifier} ${action.name}`)) return false;
  const raw=values.emr?.month, month=Number(raw);
  return raw==null || String(raw).trim()==='' || !Number.isInteger(month) || month<0 || month>11;
}
export function validateValues(action: DynamicLogbookAction, values: DynamicLogbookFormValues, role: UserRole, editing = false): string[] {
  const fields = fieldsFor(action,role).map(f=>f.key); const errors:string[]=[];
  for(const key of ['title','notes','location'] as const) if(fields.includes(key)&&!values[key]?.trim()) errors.push(`${String(action[`${key}_name`]??({title:'Judul',notes:'Catatan',location:'Lokasi'}[key]))} wajib diisi.`);
  for(const [key,value,choices] of [['category',values.categoryId,getDynamicCategories(action)],['hospital',values.hospitalId,getDynamicHospitals(action)],['another_role',values.anotherRoleId,getDynamicAnotherRoles(action)],['stase',values.staseId,getDynamicStases(action)]] as const) if(fields.includes(key)&&!choices.some(c=>c.id===value)) errors.push(`Pilih ${key.replace('_',' ')} yang valid.`);
  if(!editing && fields.includes('action_roles')) for(const id of getRequiredDynamicVerifierRoleIds(action)) { const r=getDynamicRoleMaps(action).find(r=>r.idActionRole===id); if(!r?.users.some(u=>u.id===values.roleUsers?.[String(id)]))errors.push(`${r?.label??'Staff'} wajib dipilih.`); }
  if(fields.includes('exam_result')&&!['Lolos','Remidi','Tidak Lolos'].includes(values.exam_result??''))errors.push('Pilih hasil ujian.');
  if(enabled(action.is_exam)&&(!values.participantId||role!=='staff'))errors.push('Ujian hanya dapat diisi Staff untuk peserta PPDS yang dipilih.');
  if(fields.includes('emr')) { const morbid = /morbiditas/i.test(`${action.identifier} ${action.name}`); for(const key of morbid?['patient_name','age','diagnosis']:['patient_name','age','month','gender','diagnosis','treatment']) if(!String(values.emr?.[key as keyof NonNullable<typeof values.emr>]??'').trim()) errors.push(`${key.replace('_',' ')} wajib diisi.`); }
  if(invalidEmrMonth(action,values,role)) errors.push('Usia (bulan) harus bilangan bulat antara 0 dan 11.');
  if(shouldShowDynamicScoreFields(action,role,values))for(const p of getDynamicAsmParams(action)){const raw=values.asm?.[p.id];const n=Number(raw);if(raw===undefined||raw===''||!Number.isFinite(n)||(p.minScore!==undefined&&n<p.minScore)||(p.maxScore!==undefined&&n>p.maxScore))errors.push(`Nilai ${p.label} tidak valid.`);}
  return errors;
}
export function formPayload(action: DynamicLogbookAction, values: DynamicLogbookFormValues, role: UserRole, date: string, original?: string): Row {
  if(invalidEmrMonth(action,values,role)) throw new Error('Usia (bulan) harus bilangan bulat antara 0 dan 11.');
  const payload=buildDynamicCreateLogbookPayload(action,values); payload.date=payloadDate(date,original);
  if(!fieldsFor(action,role).some(f=>f.key==='hospital'))delete payload.id_hospital;
  if(!shouldShowDynamicScoreFields(action,role,values))delete payload.t_logbook_asm;
  if(enabled(action.is_exam))delete payload.t_logbook_status;
  delete payload._uploadedAttachments;
  if(Array.isArray(payload.t_logbook_emr)) payload.t_logbook_emr=payload.t_logbook_emr.map((r:Row)=>({...r,...('emr_number'in r?{emr_number:r.emr_number||null}:{})}));
  return payload;
}
export function verificationFor(record:Row, actorId:number) {
  const rows=arr(record.t_logbook_status).filter(s=>s.deleted_at==null);
  const morbid=isMorbiditasRecord(record.m_action)||hasMorbiditasVerificationSlots(rows);
  if(morbid){const row=getMorbiditasStaffActionRow(rows,actorId);return {row,allowed:row?getMorbiditasAllowedTransitions(rows,row):[],block:getMorbiditasSequentialBlockReason(rows,actorId)};}
  const mine=rows.filter(s=>Number(s.id_user??s.m_user?.id)===actorId);const row=mine.find(s=>isJejaringStatusRow(s)&&['pending','revised','revision',''].includes(String(s.status??'').toLowerCase()))??mine.find(s=>['pending','revised','revision',''].includes(String(s.status??'').toLowerCase()))??mine[0];
  const block=getJejaringSequentialBlockReason(rows,actorId,record.m_action);
  return {row,allowed:!row?[]:['verified','rejected'].includes(String(row.status))?['revised']:block?[]:['verified','rejected'],block};
}
export function resultBody(response: any): Row {
  if(!response || response.ok===false || response.success===false || response.status===false)throw new Error(response?.message||'Permintaan gagal.');
  return response;
}
export function listPage(response:Row,page:number,limit:number) {
  const data=arr(response.data);const total=Number(response.total);const explicit=response.has_more??response.hasMore;
  const serverPage=Number(response.page), serverLimit=Number(response.limit);
  const normalizedPage=Number.isFinite(serverPage)&&serverPage>0?serverPage:page;
  const normalizedLimit=Number.isFinite(serverLimit)&&serverLimit>0?serverLimit:data.length;
  void limit;
  return {data,total:Number.isFinite(total)&&total>=0?total:undefined,page:normalizedPage,limit:normalizedLimit,hasMore:typeof explicit==='boolean'?explicit:Number.isFinite(total)&&total>=0?normalizedPage*normalizedLimit<total:false};
}
