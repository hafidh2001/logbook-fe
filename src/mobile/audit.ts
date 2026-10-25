// Native src/api/auditApi.ts contract. No request payload is copied into telemetry.
export type AuditActor = {id: number; id_client: number};
export type AuditVerb = 'Create'|'Update'|'Delete'|'Verify'|'Reject'|'Unverify'|'Verify All'|'Undo';
export type AuditMeta = {screen?:string;id_action?:number;id_logbook?:number;verb?:AuditVerb;count?:number};
export type AuditEvent = {id_user:number;id_client:number;type:'visit'|'action';activity:string;meta:AuditMeta};
export function auditId(value:unknown):number|undefined {
  if(typeof value!=='number' && !(typeof value==='string' && /^[1-9][0-9]*$/.test(value)))return;
  const id=Number(value);return Number.isSafeInteger(id) && id>0 ? id : undefined;
}
export function businessRefused(body:Record<string,unknown>):boolean {
  return ['success','status','ok'].some(key=>body[key]===false || body[key]==='false');
}
export function mutationAudit(endpoint:string,payload:Record<string,unknown>,body:Record<string,unknown>,actor:AuditActor|null):AuditEvent|null {
  if(!actor || businessRefused(body))return null;
  const verbs:Record<string,AuditVerb>={createLogbook:'Create',saveLogbookUpdate:'Update',archiveLogbook:'Delete',createLogbookMilestone:payload.id ? 'Update':'Create',archiveMilestone:'Delete',undoMilestoneMorbiditasSemester:'Undo',verifyAllTodo:'Verify All',updateLogbookStatus:payload.status==='verified'?'Verify':payload.status==='rejected'?'Reject':'Unverify'};
  const verb=Object.prototype.hasOwnProperty.call(verbs,endpoint) ? verbs[endpoint] : undefined;
  if(!verb)return null;
  const count=Number(body.verified);
  if(endpoint==='verifyAllTodo' && (payload.preview || !Number.isSafeInteger(count) || count<=0))return null;
  const id_user=auditId(['updateLogbookStatus','verifyAllTodo'].includes(endpoint)?payload.id_user:payload.created_by);
  const id_client=auditId(payload.id_client);
  if(!id_user || !id_client || id_user!==actor.id || id_client!==actor.id_client)return null;
  const data=body.data && typeof body.data==='object' ? body.data as Record<string,unknown> : {};
  const meta:AuditMeta={verb};
  const id_action=auditId(payload.id_action);
  const id_logbook=auditId(endpoint==='verifyAllTodo'?undefined:['updateLogbookStatus','undoMilestoneMorbiditasSemester'].includes(endpoint)?payload.id_logbook:payload.id ?? data.id);
  if(id_action)meta.id_action=id_action;
  if(id_logbook)meta.id_logbook=id_logbook;
  if(endpoint==='verifyAllTodo')meta.count=count;
  return {id_user,id_client,type:'action',activity:`${verb} Logbook`,meta};
}
/** Native fixed screen taxonomy; URLs and labels never enter activity/meta. */
export function navigationAudit(pathname:string,role:string) {
  let screen='',label='',participant='',id_action:number|undefined,id_logbook:number|undefined;
  const root:Record<string,[string,string]>={'/mobile':['home/overview','Home'],'/mobile/todo':['home/staff-todo','To Do'],'/mobile/notifications':['notification/detail','Notifikasi'],'/mobile/explore':['explore/overview','Explore'],'/mobile/milestone':['milestone/overview','Milestone'],'/mobile/profile':['profile/overview','Profil']};
  const page=root[pathname];
  if(page){[screen,label]=page;if(role!=='staff' && ['/mobile/todo','/mobile/explore'].includes(pathname))return null;}
  else {
    const explore=pathname.match(/^\/mobile\/explore\/([1-9][0-9]*)(?:\/logbooks\/([1-9][0-9]*)(?:\/([1-9][0-9]*))?)?$/);
    const logbook=pathname.match(/^\/mobile\/logbooks\/([1-9][0-9]*)(?:\/(create|[1-9][0-9]*)(?:\/(edit))?)?$/);
    if(explore){if(role!=='staff' || !explore.slice(1).filter(Boolean).every(x=>auditId(x)))return null;screen='explore/detail';label='Explore Detail PPDS';participant=explore[1];}
    else if(logbook){
      id_action=auditId(logbook[1]);if(!id_action)return null;
      const view=logbook[2];
      if(view==='create'){if(logbook[3])return null;screen='home/create-form';label='Tambah Logbook';}
      else if(view){id_logbook=auditId(view);if(!id_logbook)return null;screen=logbook[3]?'home/dynamic-logbook-edit':'home/dynamic-logbook-detail';label=logbook[3]?'Edit Logbook':'Detail Logbook';}
      else {screen='home/dynamic-logbook';label='Logbook';}
    } else return null;
  }
  const meta:AuditMeta={screen};if(id_action)meta.id_action=id_action;if(id_logbook)meta.id_logbook=id_logbook;
  return {key:[screen,id_action||'',id_logbook||'',participant].join(':'),activity:`Membuka Halaman ${label}`,meta};
}
export function sanitizeAuditEvent(input:AuditEvent):AuditEvent|null {
  const id_user=auditId(input.id_user),id_client=auditId(input.id_client);
  const actions=['Create','Update','Delete','Verify','Reject','Unverify','Verify All','Undo'];
  const visits=['Home','Filter Logbook','Filter To Do','To Do','Notifikasi','Logbook','Detail Logbook','Edit Logbook','Tambah Logbook','Explore','Explore Detail PPDS','Explore Filter','Milestone','Milestone Form','Milestone Filter','Profil','Profil Edit Profil','Profil Ubah Password'];
  if(!id_user || !id_client || !(input.type==='action' ? actions.map(verb=>`${verb} Logbook`) : input.type==='visit' ? visits.map(label=>`Membuka Halaman ${label}`) : []).includes(input.activity))return null;
  const meta:AuditMeta={},source=input.meta||{};
  if(typeof source.screen==='string' && /^(?:home\/(?:overview|staff-todo|staff-todo-filter|dynamic-logbook(?:-detail|-edit|-filter)?|create-form)|notification\/(?:detail|logbook-detail)|explore\/(?:overview|detail|filter)|milestone\/(?:overview|action|filter)|profile\/(?:overview|edit-profile|change-password))$/.test(source.screen))meta.screen=source.screen;
  for(const field of ['id_action','id_logbook'] as const){const id=auditId(source[field]);if(id)meta[field]=id;}
  if(source.verb && actions.includes(source.verb))meta.verb=source.verb;
  if(Number.isSafeInteger(source.count) && Number(source.count)>=0)meta.count=source.count;
  return {id_user,id_client,type:input.type,activity:input.activity,meta};
}
