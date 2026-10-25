import type { Row } from './contracts';

/** MilestoneScreen.tsx parseApiDate: preserve timestamp offsets, never reserialize as UTC. */
export function milestoneDate(value: unknown): Date {
  const raw = String(value || '').trim()
    .replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}(?:\.\d+)?)/, '$1T$2')
    .replace(/([+-]\d{2})(\d{2})$/, '$1:$2').replace(/([+-]\d{2})$/, '$1:00');
  const parsed = new Date(/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d+)?)?$/.test(raw) ? raw+'+07:00' : raw);
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}
/** Native is device-local; this Indonesia application deliberately pins browser display to WIB. */
export function milestoneClock(value: unknown) {
  const date = milestoneDate(value);
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23' }).formatToParts(date);
  const part = (name: string) => parts.find(p => p.type === name)?.value || '';
  return {day:part('day'),month:new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Jakarta',month:'short'}).format(date),year:part('year'),time:`${part('hour')}:${part('minute')}`,input:`${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`};
}
export function milestoneCard(row: Row) {
  return {key:String(row.id),ppdsId:row.m_user?.id ?? row.id_user,ppds:row.m_user?.display_name?.trim() || '-',staseId:row.m_stase?.id ?? row.id_stase,stase:row.m_stase?.name?.trim() || row.m_action?.name?.trim() || 'Milestone',semesterId:row.m_semester?.id ?? row.id_semester,repeatStage:row.is_retake === true,date:milestoneDate(row.date),createdAt:milestoneDate(row.created_date ?? row.date),note:row.notes || '',statusLabel:row.exam_result?.trim() || '-',highlighted:row.verified === true || String(row.verified_status || '').toLowerCase() === 'verified'};
}
export function milestoneInitial(initial: Row | null): Row {
  return {id:initial?.id,id_user:initial?.m_user?.id ?? initial?.id_user ?? '',id_stase:initial?.m_stase?.id ?? initial?.id_stase ?? '',id_semester:initial?.m_semester?.id ?? initial?.id_semester ?? '',id_stage:initial?.id_stage ?? initial?.m_stase?.id_stage ?? initial?.m_semester?.id_stage ?? '',date:milestoneClock(initial?.date || new Date()).input,notes:initial?.notes || '',is_retake:initial?.is_retake === true};
}
export type MilestoneOption = {id:number;label:string;stageId?:number;stageLabel?:string};
/** Exact MilestoneActionScreen.tsx loader normalizations (no invented catalogue IDs). */
export function milestoneMasterOptions(masters:{ppds:Row[];stases:Row[];semesters:Row[]}) {
  const labelOf=(value:unknown)=>typeof value==='string'?value.trim():'';
  const ppds=masters.ppds.map(item=>({id:Number(item.id),label:labelOf(item.display_name || item.name || item.username)})).filter(item=>item.id && item.label);
  const stases=masters.stases.map(item=>({id:Number(item.id),label:labelOf(item.name || item.stase),stageId:Number(item.id_stage)||undefined})).filter(item=>item.id && item.label);
  const semesters=masters.semesters.map(item=>({id:Number(item.id),label:item.name,stageId:Number(item.id_stage)||undefined,stageLabel:item.m_stage?.name})).filter(item=>item.id && item.label);
  return {ppds,stases,semesters};
}
export const milestoneOptionRows=(options:MilestoneOption[]):Row[]=>options.map(item=>({id:item.id,name:item.label,id_stage:item.stageId}));
/** MilestoneFilterScreen has its own legacy ID/code normalization; do not replace it with the editor mapper. */
export function milestoneFilterOptions(ppdsRows:Row[],staseRows:Row[]) {
  const choices=ppdsRows.flatMap(raw=>{
    const id=Number(raw.id ?? raw.id_user),name=String(raw.display_name ?? raw.name ?? raw.code ?? '').trim();
    return Number.isFinite(id)&&id>0&&name?[{id,name}]:[];
  });
  const ppds=choices.filter((choice,index)=>choices.findIndex(item=>item.id===choice.id)===index);
  const stases=staseRows.flatMap(raw=>{
    const id=Number(raw.id),name=String(raw.name ?? '').trim();
    return Number.isFinite(id)&&id>0&&name?[{id,name}]:[];
  });
  return {ppds,stases};
}
export function milestoneStages(masters: {semesters:Row[];stases:Row[]}) {
  const stages=new Map<number,Row>();
  for(const row of [...masters.semesters,...masters.stases]) {
    const id=Number(row.id_stage);
    if(id && !stages.has(id))stages.set(id,{id,name:row.m_stage?.name || `Stage ${id}`});
  }
  return [...stages.values()];
}
