import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMobileSession } from './session';
import { navigationAudit, type AuditMeta } from './audit';
import { writeAuditTrail } from './api';
import { navigationSessionKey, returnDestination } from './navigation';
let lastVisit='';
function visit(activity:string,meta:AuditMeta,key:string) {
  const user=useMobileSession.getState().user;
  if(!user)return;
  const signature=`${navigationSessionKey()}:${user.id_client}:${user.id}:${key}`;
  if(lastVisit===signature)return;
  lastVisit=signature;
  void writeAuditTrail({id_user:user.id,id_client:user.id_client,type:'visit',activity,meta}).catch(()=>undefined);
}
/** Explicit seam for local-state screens: pass only these fixed Native screen names. */
export function auditScreenVisit(screen:'home/staff-todo'|'home/staff-todo-filter'|'home/dynamic-logbook'|'home/dynamic-logbook-filter'|'profile/overview'|'profile/edit-profile'|'profile/change-password'|'milestone/overview'|'milestone/action'|'milestone/filter'|'explore/overview'|'explore/filter',actionId?:number) {
  const labels:Record<typeof screen,string>={'home/dynamic-logbook':'Logbook','home/dynamic-logbook-filter':'Filter Logbook','home/staff-todo':'To Do','home/staff-todo-filter':'Filter To Do','profile/overview':'Profil','profile/edit-profile':'Profil Edit Profil','profile/change-password':'Profil Ubah Password','milestone/overview':'Milestone','milestone/action':'Milestone Form','milestone/filter':'Milestone Filter','explore/overview':'Explore','explore/filter':'Explore Filter'};
  const label=labels[screen];
  const id_action=screen.startsWith('home/dynamic-logbook') && Number.isSafeInteger(actionId) && Number(actionId)>0 ? actionId : undefined;
  if(screen.startsWith('home/dynamic-logbook') && !id_action)return;
  if(label)visit(`Membuka Halaman ${label}`,{screen,...(id_action ? {id_action}: {})},[screen,id_action||'','',''].join(':'));
}
/** One visit per actual screen transition; StrictMode replay and query changes are inert. */
export function useNavigationAudit(enabled=true) {
  const {pathname,search,state}=useLocation();
  const user=useMobileSession(s=>s.user);
  const scope=navigationSessionKey();
  useEffect(()=>{
    if(!user || !enabled){lastVisit='';return;}
    const query=new URLSearchParams(search);
    const milestoneEditor=pathname==='/mobile/milestone' && user.role==='staff' && (query.get('edit')==='1' || /^[1-9][0-9]*$/.test(query.get('record')||''));
    if(milestoneEditor){auditScreenVisit('milestone/action');return;}
    // These mounted components own local views (including restored filters).
    // A shell effect must not replace their signature during StrictMode replay.
    if(['/mobile/profile','/mobile/explore','/mobile/milestone'].includes(pathname) || /^\/mobile\/logbooks\/[1-9][0-9]*$/.test(pathname))return;
    const target=navigationAudit(pathname,user.role);
    const owner=returnDestination(state?.mobileReturn,user,pathname);
    if(target && /^\/mobile\/logbooks\/[1-9][0-9]*\/[1-9][0-9]*$/.test(pathname) && owner?.split('?')[0]==='/mobile/notifications'){
      const screen='notification/logbook-detail';
      visit('Membuka Halaman Notifikasi',{screen},[screen,'','',''].join(':'));
    } else if(target)visit(target.activity,target.meta,target.key);
  },[pathname,search,state?.mobileReturn,user?.id,user?.id_client,user?.role,scope,enabled]);
}
