import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { mobileRequest, MobileApiBusinessError } from '../../api';
import { useMobileSession } from '../../session';
import { installDirtyNavigationGuard } from '../logbook/dirtyNavigation';
import { actorKey, captureReturn, canPopReturn, readListMemory, forgetListMemory } from '../../navigation';
import { useListPosition } from '../../useListPosition';
import { useInfiniteScroll } from '../../useInfiniteScroll';
import { InfiniteScrollFooter } from '../../InfiniteScrollFooter';
import { filterMilestones, milestonePayload, mobileRole, positiveId, undoPayload, type Actor, type Masters, type Row } from './contracts';
import { orderSemesters } from './readContracts';
import { Frame as SharedFrame, Info, State, messageOf, requestData, requestRows, useResource } from './shared';
import { MilestoneSelect as Select } from './MilestoneSelect';
import { ExtrasFilter, ExtrasFilterSelect } from './ExtrasFilter';
import { milestoneCard, milestoneClock, milestoneInitial, milestoneStages, milestoneMasterOptions, milestoneOptionRows, milestoneFilterOptions } from './milestoneView';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, ChevronRight } from 'lucide-react';
import type { ComponentProps } from 'react';
import './milestone.css';
import './extrasStage.css';
import { auditScreenVisit } from '../../useNavigationAudit';
const Frame=(props:ComponentProps<typeof SharedFrame>)=><div className="milestone-scope"><SharedFrame {...props}/></div>;

export function Milestone({user}: {user:Actor}) {
  const staff=mobileRole(user)==='staff';
  const location=useLocation(),navigate=useNavigate();
  const [search]=useSearchParams();
  const recordId=search.get('record');
  const editor=staff && (search.get('edit')==='1' || !!recordId);
  const memoryKey=actorKey(user)+':milestone';
  const memory=readListMemory<{ppds:string[];stase:string;query:string;repeat:string;page:number;start:string;end:string;filter:boolean;expanded:Record<string,boolean>}>('milestone',memoryKey)?.value;
  const [expanded,setExpanded]=useState<Record<string,boolean>>(memory?.expanded ?? {});
  const [filter,setFilter]=useState(memory?.filter ?? false);
  useEffect(()=>{if(!editor && !recordId)auditScreenVisit(staff && filter?'milestone/filter':'milestone/overview');},[staff,filter,editor,recordId,user.id,user.id_client]);
  const [ppds,setPpds]=useState<string[]>(memory?.ppds ?? []),[stase,setStase]=useState(memory?.stase ?? ''),[query,setQuery]=useState(memory?.query ?? ''),[repeat,setRepeat]=useState(memory?.repeat ?? ''),[page,setPage]=useState(memory?.page ?? 1),[start,setStart]=useState(memory?.start ?? ''),[end,setEnd]=useState(memory?.end ?? '');
  const [draft,setDraft]=useState({ppds,stase,query,repeat,start,end});
  const identity=`${user.id}:${user.id_client}:${staff}`;
  const staffResource=useResource(()=>staff ? requestRows('getMilestoneStaff',{id_client:user.id_client}) : Promise.resolve([] as Row[]),identity);
  const semesterResource=useResource(()=>!staff ? requestRows('getMasterSemester',{id_client:user.id_client}) : Promise.resolve([] as Row[]),identity);
  const takenResource=useResource(()=>!staff ? requestRows('getMilestoneTaken',{id_client:user.id_client,user_id:user.id}) : Promise.resolve([] as Row[]),identity);
  const notTakenResource=useResource(()=>!staff ? requestRows('getMilestoneNotTaken',{id_client:user.id_client,user_id:user.id}) : Promise.resolve([] as Row[]),identity);
  const resource={data:{staff:staffResource.data || [],semesters:semesterResource.data || [],taken:takenResource.data || [],notTaken:notTakenResource.data || []},loading:staff ? staffResource.loading : semesterResource.loading || takenResource.loading || notTakenResource.loading,error:staff ? staffResource.error : semesterResource.error || takenResource.error || notTakenResource.error,refresh:async()=>{await Promise.all([staffResource.refresh(),semesterResource.refresh(),takenResource.refresh(),notTakenResource.refresh()]);}};
  const filterMasters=useResource(async()=>{
    if(!staff || !filter)return {ppds:[] as Row[],stases:[] as Row[],ppdsSearch:[] as Row[]};
    const [ppds,stases]=await Promise.all([requestRows('getMasterPpds',{id_client:user.id_client}),requestRows('getMasterStase',{id_client:user.id_client})]);
    return {...milestoneFilterOptions(ppds,stases),ppdsSearch:ppds};
  },`${identity}:${filter}`);
  const baseSelected=recordId ? (resource.data?.staff.find(row=>String(row.id)===recordId) ?? resource.data?.taken.flatMap(action=>(action.t_logbook || []).map((log:Row)=>({...log,m_action:action}))).find((row:Row)=>String(row.id)===recordId)) : null;
  const selectedResource=useResource(async()=>{
    if(!recordId)return null;
    const id=positiveId(recordId);
    const row=await requestData('getLogbookById',{id,id_client:user.id_client,user_id:user.id});
    if(Number(row?.id)!==id || row.id_client!=null && Number(row.id_client)!==user.id_client)throw new Error('Detail milestone tidak sesuai permintaan.');
    return row;
  },`${identity}:${recordId}`);
  const selected=recordId && selectedResource.data && String(selectedResource.data.id)===recordId ? {...baseSelected,...selectedResource.data} : null;
  const remember=useListPosition('milestone',memoryKey,actorKey(user),{ppds,stase,query,repeat,page,start,end,filter,expanded},!recordId && !editor,!resource.loading);
  const open=(row:Row|null,edit=false)=>{remember();const query=new URLSearchParams();if(row)query.set('record',String(row.id));if(edit)query.set('edit','1');navigate(`/mobile/milestone?${query}`,{state:{mobileReturn:captureReturn(user,location)}});};
  const back=()=>{const c=location.state?.mobileReturn;if(canPopReturn(c,user,location.pathname,Number(window.history.state?.idx)))navigate(-1);else navigate('/mobile/milestone',{replace:true});};
  const queryMounted=useRef(false);
  useEffect(()=>{if(queryMounted.current){forgetListMemory('milestone');window.scrollTo(0,0);}else queryMounted.current=true;},[JSON.stringify(ppds),stase,query,repeat,start,end]);
  const all=resource.data?.staff || [];
  const rows=filterMilestones(all,{ppds_ids:ppds,id_stase:stase,start,end,query,repeat});
  const infinite=useInfiniteScroll({restored:!!memory,enabled:staff && !filter && !recordId && !editor && !resource.loading && !resource.error && page*12<rows.length,loading:false,scopeKey:JSON.stringify([identity,ppds,stase,query,repeat,start,end]),progressKey:page,onLoadMore:()=>setPage(n=>n+1)});
  if(recordId && !selected)return <Frame title={editor?'Edit Stase':'Detail Milestone'} actions={<button onClick={back}>‹ Kembali</button>}><State loading={selectedResource.loading} error={selectedResource.error} retry={()=>void selectedResource.refresh()}/></Frame>;
  if (editor) return <MilestoneEditor key={`${actorKey(user)}:${recordId ?? 'new'}`} user={user} initial={selected} back={back} saved={async()=>{const current=()=>{const actor=useMobileSession.getState().user;return actor?.id===user.id && actor.id_client===user.id_client && window.location.pathname+window.location.search===location.pathname+location.search;};if(!current())return;await resource.refresh();if(current())back();}}/>;
  if (selected) return <MilestoneDetail user={user} initial={selected} back={back} edit={row=>open(row,true)}/>;
  const ppdsRows=filterMasters.data?.ppds || [];
  const staseRows=filterMasters.data?.stases || [];
  return <Frame title={staff?'Milestone Staff':'Milestone'} subtitle={staff?undefined:'Semester dan progres akademik Anda'} actions={<><button onClick={()=>void resource.refresh()} disabled={resource.loading}>Refresh</button>{staff && <button onClick={()=>setFilter(!filter)} aria-expanded={filter}>Filter</button>}</>}>
    {staff && filter && <State loading={filterMasters.loading} error={filterMasters.error} retry={()=>void filterMasters.refresh()}/>}
    {staff && filter && <ExtrasFilter actions={<><button onClick={()=>{setPpds(draft.ppds);setStase(draft.stase);setRepeat(draft.repeat);setQuery(draft.query);setStart(draft.start);setEnd(draft.end);setPage(1);}}>Terapkan filter</button><button onClick={()=>{setDraft({ppds:[],stase:'',repeat:'',query:'',start:'',end:''});setPpds([]);setStase('');setRepeat('');setQuery('');setStart('');setEnd('');setPage(1);}}>Reset filter</button></>}>
      <ExtrasFilterSelect label="PPDS" multiple rows={ppdsRows} searchRows={filterMasters.data?.ppdsSearch} value={draft.ppds} onChange={v=>setDraft(current=>({...current,ppds:Array.isArray(v)?v:[]}))}/><ExtrasFilterSelect label="Stase" rows={staseRows} value={draft.stase} onChange={v=>setDraft(current=>({...current,stase:String(v)}))}/><ExtrasFilterSelect label="Mengulang Stase" rows={[{id:'yes',name:'Yes'},{id:'no',name:'No'}]} value={draft.repeat} onChange={v=>setDraft(current=>({...current,repeat:String(v)}))}/><label className="mweb-extras-field">Start Date<input type="date" value={draft.start} max={draft.end || undefined} onChange={e=>setDraft(current=>({...current,start:e.target.value}))}/></label><label className="mweb-extras-field">End Date<input type="date" value={draft.end} min={draft.start || undefined} onChange={e=>setDraft(current=>({...current,end:e.target.value}))}/></label><label className="mweb-extras-field">Cari<input value={draft.query} onChange={e=>setDraft(current=>({...current,query:e.target.value}))}/></label>
    </ExtrasFilter>}
    <State loading={resource.loading} error={resource.error} retry={()=>void resource.refresh()} empty={staff && !rows.length}/>
    {staff ? <><div className="milestone-staff-grid">{rows.slice(0,page*12).map(row=>{
      const item=milestoneCard(row),clock=milestoneClock(row.date);
      return <button className="milestone-staff-card" data-record-id={row.id} key={row.id} aria-label={`${item.stase}, ${item.ppds}${item.repeatStage?', Mengulang Stase':''}`} onClick={()=>open(row,true)}>
        <span className="milestone-date-rail"><strong>{clock.day}</strong><span>{clock.month}</span><small>{clock.year}</small></span>
        <span className="milestone-card-body"><span className="milestone-card-title"><span><h2>{item.stase}</h2><span className="milestone-card-user">{item.ppds}</span>{item.repeatStage && <span className="milestone-repeat">↻ Mengulang Stase</span>}</span><ChevronRight size={18} aria-hidden="true"/></span><span className="milestone-card-meta"><span>Pukul {clock.time}</span><span>Status · {item.statusLabel}</span></span></span>
      </button>;
    })}</div>{page*12<rows.length && <InfiniteScrollFooter sentinelRef={infinite.sentinelRef} loading={false} onLoadMore={()=>setPage(n=>n+1)}/>}<button className="milestone-add" aria-label="+ Tambah Stase" title="Tambah Stase" onClick={()=>open(null,true)}><Plus size={26} aria-hidden="true"/></button></> : <div className="mweb-extras-grid">{orderSemesters(resource.data?.semesters || []).map(semester=>{
      const taken=resource.data!.taken.map((action): Row=>({...action,logs:(action.t_logbook || []).filter((log:Row)=>Number(log.m_semester?.id)===Number(semester.id))})).filter(action=>action.logs.length);
      return <details key={semester.id} className="mweb-extras-card" open={expanded[String(semester.id)] ?? taken.length>0} onToggle={e=>{const open=e.currentTarget.open;setExpanded(old=>old[String(semester.id)]===open ? old : {...old,[String(semester.id)]:open});}}><summary><span className="mweb-milestone-semester"><span className="mweb-milestone-stage-accent" aria-hidden="true" style={{backgroundColor:semester.m_stage?.label_color?.trim() || '#F2F2F2'}}/><span><strong>{semester.name}</strong>{semester.m_stage?.name && <small className="mweb-milestone-stage-name">{semester.m_stage.name}</small>}</span></span><span className="mweb-extras-pill">{takenResource.data ? taken.reduce((n,a)=>n+a.logs.length,0) : '—'} aktivitas</span></summary>{taken.map(action=><div key={action.id} className="mweb-extras-milestone-group"><h3>{action.name}</h3>{action.identifier==='stase' || String(action.name).toLowerCase()==='stase' ? action.logs.map((log:Row)=><button key={log.id} className="mweb-extras-row" onClick={()=>open({...log,m_action:action})}><span className="mweb-milestone-stage-dot" aria-hidden="true" style={{backgroundColor:log.m_stase?.m_stage?.label_color?.trim() || '#FF3737'}}/><span>{log.m_stase?.name || 'Stase'}</span>{log.is_retake && <span className="mweb-extras-pill">Mengulang</span>}<span>›</span></button>) : <Link className="mweb-extras-row" onClick={()=>{remember();captureReturn(user,location);}} state={{mobileReturn:captureReturn(user,location)}} to={`/mobile/logbooks/${action.id}`}><span>{action.logs.length} Logbook</span><span>›</span></Link>}</div>)}</details>;
    })}<details className="mweb-extras-card" open={expanded.notTaken ?? false} onToggle={e=>{const open=e.currentTarget.open;setExpanded(old=>old.notTaken===open ? old : {...old,notTaken:open});}}><summary><strong>Belum diambil</strong><span className="mweb-extras-pill">{notTakenResource.data?.length ?? '—'} milestone</span></summary>{resource.data?.notTaken.map(row=><p key={row.id}>{row.name}</p>)}{notTakenResource.data?.length===0 && <p>Semua sudah diambil.</p>}</details></div>}
  </Frame>;
}
function MilestoneDetail({user,initial,back,edit}: {user:Actor;initial:Row;back:()=>void;edit:(row:Row)=>void}) {
  const detail=useResource(async()=>{
    const row=await requestData('getLogbookById',{id:initial.id,id_client:user.id_client,user_id:user.id});
    if(!row || Number(row.id)!==Number(initial.id))throw new Error('Detail milestone tidak sesuai permintaan.');
    return row;
  },`${actorKey(user)}:${initial.id}`);
  const row:Row=detail.data || initial;
  return <Frame title="Detail Milestone" actions={<><button onClick={back}>‹ Kembali</button>{mobileRole(user)==='staff' && (row.m_action?.identifier==='stase' || initial.m_action?.identifier==='stase' || String(initial.m_action?.name).toLowerCase()==='stase') && <button onClick={()=>edit(row)} disabled={detail.loading || !!detail.error}>Edit Stase</button>}</>}><State loading={detail.loading} error={detail.error} retry={()=>void detail.refresh()}/><article className="mweb-extras-card"><h2>{row.m_stase?.name || row.title || initial.m_stase?.name || 'Milestone'}</h2><Info items={[
    ['PPDS',row.m_user?.display_name || initial.m_user?.display_name || user.display_name],['Stase',row.m_stase?.name],['Semester',row.m_semester?.name],['Tanggal',row.date?`${milestoneClock(row.date).day} ${milestoneClock(row.date).month} ${milestoneClock(row.date).year} · ${milestoneClock(row.date).time}`:null],['Dibuat',row.created_date?`${milestoneClock(row.created_date).day} ${milestoneClock(row.created_date).month} ${milestoneClock(row.created_date).year} · ${milestoneClock(row.created_date).time}`:null],['Mengulang Stase',row.is_retake ? 'Yes':'No'],['Catatan',row.notes],['Status',row.verified_status || row.exam_result],
  ]}/></article></Frame>;
}
function MilestoneEditor({user,initial,back,saved}: {user:Actor;initial:Row|null;back:()=>void;saved:()=>Promise<void>}) {
  const [form,setForm]=useState<Row>(()=>milestoneInitial(initial));
  const [confirmation,setConfirmation]=useState<'archive'|'undo'|null>(null);
  const [error,setError]=useState(''),[busy,setBusy]=useState(false),[notice,setNotice]=useState(''),[previewReload,setPreviewReload]=useState(0);
  const lock=useRef(false),dirty=useRef(false);
  useEffect(()=>installDirtyNavigationGuard(dirty),[]);
  // Keep the acknowledged (or uncertain) write separate from editable form state.
  // A failed read/refresh must never replay a semester/history transition.
  const pendingSave=useRef<{id:number|null;id_user:number;id_client:number;actor:number}|null>(null);
  const pendingLifecycle=useRef<{kind:'archive'|'undo';id:number;id_user:number;restore:number;acknowledged:boolean}|null>(null);
  const mounted=useRef(true);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  const assertIdentity=()=>{const active=useMobileSession.getState().user;if(!mounted.current || active?.id!==user.id || active.id_client!==user.id_client || mobileRole(active)!=='staff')throw new Error('Sesi atau pemilik form berubah. Muat ulang dengan akun yang sesuai.');};
  const resource=useResource<Masters>(async()=>{
    const [ppds,stases,semesters]=await Promise.all([requestRows('getMasterPpds',{id_client:user.id_client}),requestRows('getMasterStase',{id_client:user.id_client}),requestRows('getMasterSemester',{id_client:user.id_client})]);
    const chosen=stases.find(row=>Number(row.id)===Number(initial?.m_stase?.id ?? initial?.id_stase));
    if(chosen && !lock.current && !pendingSave.current && !pendingLifecycle.current && mounted.current) setForm(current=>({...current,id_stage:chosen.id_stage || current.id_stage}));
    return {ppds,stases,semesters};
  },actorKey(user));
  const preview=useResource(async()=>{
    if(!form.id_user)return null;
    try{return await requestData('getMilestoneMorbiditasUndoInfo',{created_by:user.id,id_client:user.id_client,id_user:Number(form.id_user)});}
    catch(error){
      // HTTP-200 business refusals are Native's contextual reason, NOT a failed list.
      if((error as {status?:number}).status===200 && !messageOf(error).startsWith('Respons API bukan JSON'))return {id_user:Number(form.id_user),can_undo:false,reason:messageOf(error)};
      throw error;
    }
  },`${user.id}:${user.id_client}:${form.id_user}:${previewReload}`);
  const masters=resource.data, stages=milestoneStages(masters || {semesters:[],stases:[]});
  const options=milestoneMasterOptions(masters || {ppds:[],stases:[],semesters:[]});
  const targetLabel=options.ppds.find(row=>row.id===Number(form.id_user))?.label || initial?.m_user?.display_name || 'PPDS';
  const update=(key:string,value:unknown)=>{if(lock.current || pendingSave.current || pendingLifecycle.current)return;setError('');setForm(current=>({...current,[key]:value}));};
  const run=async(operation:()=>Promise<void>)=>{if(lock.current)return;lock.current=true;setBusy(true);setError('');setNotice('');try{await operation();}catch(e){if(pendingSave.current || pendingLifecycle.current)dirty.current=true;setError(messageOf(e));}finally{lock.current=false;setBusy(false);}};
  const submit=()=>void run(async()=>{
    assertIdentity();
    if(pendingLifecycle.current)throw new Error('Verifikasi hasil perubahan terlebih dahulu.');
    if (!pendingSave.current) {
      if (!masters) throw new Error('Tunggu pilihan server dimuat.');
      const payload=milestonePayload(user,form,masters);
      // Mark uncertain before dispatch: a transport failure cannot prove rollback.
      pendingSave.current={id:null,id_user:Number(payload.id_user),id_client:user.id_client,actor:user.id};
      try {
        const result=await mobileRequest('createLogbookMilestone',payload);
        const id=result.data?.id ?? form.id;
        try { pendingSave.current.id=positiveId(id); } catch { /* Reconcile from the list if no exact ID was acknowledged. */ }
      } catch (e) {
        // Parsed refusal only; HTTP errors/auth expiry and lost acknowledgements
        // never prove rollback and must not authorize another mutation.
        if (e instanceof MobileApiBusinessError && e.status === 200) {
          assertIdentity();
          pendingSave.current=null;
          throw e;
        }
        throw new Error(`${messageOf(e)} Status simpan belum pasti. Pengiriman ulang diblokir; periksa daftar sebelum membuat perubahan baru.`);
      }
    }
    const pending=pendingSave.current;
    if(pending.actor!==user.id || pending.id_client!==user.id_client)throw new Error('Sesi berubah. Periksa daftar dengan sesi yang sesuai.');
    if (!pending.id) throw new Error('Server tidak mengonfirmasi ID hasil. Pengiriman ulang diblokir; periksa dan rekonsiliasi daftar sebelum membuat perubahan baru.');
    const readback=await requestData('getLogbookById',{id:pending.id,id_client:pending.id_client,user_id:pending.actor});
    if (!readback || Number(readback.id)!==pending.id || (readback.id_user!=null && Number(readback.id_user)!==pending.id_user) || (readback.m_user?.id!=null && Number(readback.m_user.id)!==pending.id_user) || (readback.id_client!=null && Number(readback.id_client)!==pending.id_client)) throw new Error('Simpan diterima tetapi verifikasi hasil gagal. Coba verifikasi lagi atau periksa daftar; jangan membuat ulang.');
    assertIdentity();dirty.current=false;await saved();
    setForm(current=>({...current,id:pending.id}));
    pendingSave.current=null;
  });
  const verifyLifecycle=async()=>{
    const pending=pendingLifecycle.current;
    if(!pending)return;
    assertIdentity();
    if(!pending.acknowledged)throw new Error('Server belum mengonfirmasi perubahan. Pengiriman ulang diblokir; periksa daftar dan status sesi sebelum tindakan lain.');
    if(pending.kind==='undo'){
      const after=await requestData('getMilestoneMorbiditasUndoInfo',{created_by:user.id,id_client:user.id_client,id_user:pending.id_user});
      assertIdentity();
      if(!after || Number(after.id_user)!==pending.id_user || Number(after.current_session_id)!==pending.restore)throw new Error('Undo diterima tetapi pemulihan sesi belum terkonfirmasi. Refresh daftar; jangan ulangi Undo.');
    }
    const active=await requestRows('getMilestoneStaff',{id_client:user.id_client});
    assertIdentity();
    if(active.some(row=>Number(row.id)===pending.id))throw new Error('Arsip belum terkonfirmasi. Verifikasi ulang hasil tanpa mengirim perubahan lagi.');
    dirty.current=false;await saved();
    pendingLifecycle.current=null;
  };
  const archive=()=>{if(pendingSave.current || pendingLifecycle.current || !initial)return;void run(async()=>{
    assertIdentity();dirty.current=true;
    pendingLifecycle.current={kind:'archive',id:Number(initial.id),id_user:Number(form.id_user),restore:0,acknowledged:false};
    await mobileRequest('archiveMilestone',{id:positiveId(initial.id),created_by:user.id,id_client:user.id_client});
    pendingLifecycle.current.acknowledged=true;
    await verifyLifecycle();
  });};
  let canUndo=false;
  try { if(!preview.loading && !preview.error && preview.data) {undoPayload(user,Number(form.id_user),preview.data);canUndo=!initial || Number(initial.id)===Number(preview.data.archive_logbook_id);} } catch { /* No immutable server link: never infer sessions or make legacy repairs. */ }
  const undo=()=>void run(async()=>{
    if(pendingSave.current || pendingLifecycle.current)throw new Error('Rekonsiliasi perubahan terlebih dahulu sebelum Undo.');
    const info=preview.data;
    if(!info || preview.loading || preview.error)throw new Error('Refresh status Undo terlebih dahulu.');
    const payload=undoPayload(user,Number(form.id_user),info);
    if(initial && Number(initial.id)!==Number(info.archive_logbook_id))throw new Error('Kartu ini bukan transisi aktif yang dikonfirmasi server. Refresh status.');
    assertIdentity();dirty.current=true;
    pendingLifecycle.current={kind:'undo',id:Number(info.archive_logbook_id),id_user:Number(form.id_user),restore:Number(info.restore_session_id),acknowledged:false};
    const result=await mobileRequest('undoMilestoneMorbiditasSemester',payload);
    if(Number(result.data?.archived_logbook_id)!==Number(info.archive_logbook_id))throw new Error('Server belum mengonfirmasi arsip milestone transisi. Jangan ulangi Undo otomatis; Refresh daftar.');
    pendingLifecycle.current.acknowledged=true;
    await verifyLifecycle();
  });
  const leave=()=>{if((pendingSave.current || pendingLifecycle.current || dirty.current) && !window.confirm(pendingSave.current ? 'Status simpan belum direkonsiliasi. Periksa daftar dan jangan buat ulang sebelum memastikan hasil simpan. Kembali ke daftar?' : 'Perubahan belum disimpan. Keluar dari form?'))return;dirty.current=false;back();};
  const selectStage=(value:string|string[])=>{
    if(lock.current || pendingSave.current || pendingLifecycle.current)return;
    const stage=String(value);
    setForm(current=>({...current,id_stage:stage,
      id_stase:masters?.stases.some(row=>Number(row.id)===Number(current.id_stase)&&Number(row.id_stage)===Number(stage))?current.id_stase:'',
      id_semester:masters?.semesters.some(row=>Number(row.id)===Number(current.id_semester)&&Number(row.id_stage)===Number(stage))?current.id_semester:''}));
    dirty.current=true;
  };
  return <Frame title={initial?'Edit Stase':'Tambah Stase'} actions={<button onClick={leave} disabled={busy}>‹ Kembali</button>}>
    <State loading={resource.loading} error={resource.error} retry={()=>void resource.refresh()}/>
    {error && <p className="mweb-extras-notice" role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
    {pendingSave.current && <p className="mweb-extras-notice" role="status">{pendingSave.current.id ? 'Simpan sudah diterima. Verifikasi ulang hanya memuat hasil, tidak mengirim simpan lagi.' : 'Status simpan belum pasti. Pengiriman ulang diblokir; kembali dan periksa daftar sebelum membuat perubahan baru.'}</p>}
    {pendingLifecycle.current && <div className="mweb-extras-notice" role="status"><p>Perubahan sudah dikirim. Form dikunci; verifikasi hanya memuat hasil, tidak mengirim perubahan lagi.</p><button disabled={busy} onClick={()=>void run(verifyLifecycle)}>Verifikasi hasil perubahan</button></div>}
    <div className="milestone-editor-layout">
      <aside className="milestone-undo" aria-label="Status Undo semester">
        <h2>{form.id_user?`Undo Ganti Semester — ${targetLabel}`:'Undo Ganti Semester (Morbiditas)'}</h2>
        {!form.id_user ? <p>Pilih User PPDS di form Stase untuk cek opsi undo.</p> : <>
          {preview.loading ? <p role="status">Memuat status Undo…</p> : preview.error ? <div role="alert"><strong>Status Undo tidak dapat dimuat</strong><p>{preview.error}</p></div> : canUndo && preview.data ? <>
            <p>Sekarang: {preview.data.current_semester_name || '-'}{preview.data.current_stase_name ? ` / ${preview.data.current_stase_name}`:''} · Poin aktif {preview.data.current_active_points ?? 0}</p>
            <p>Undo ke: {preview.data.restore_semester_name || '-'}{preview.data.restore_stase_name ? ` / ${preview.data.restore_stase_name}`:''} · Poin tersimpan {preview.data.restore_points ?? 0}</p>
            <p>Milestone transisi #{preview.data.archive_logbook_id} akan diarsipkan. Kartu sebelumnya tetap utuh.</p>
          </> : <p role="status">{preview.data?.reason || (initial && preview.data?.can_undo && Number(initial.id)!==Number(preview.data.archive_logbook_id) ? 'Kartu ini bukan transisi aktif yang dikonfirmasi server. Buka milestone transisi terbaru untuk Undo.' : preview.data?.can_undo ? 'Status Undo belum lengkap. Refresh status; jangan menebak riwayat sesi.' : 'Status Undo belum tersedia.')}</p>}
          <div className="mweb-extras-actions"><button disabled={busy || !!pendingSave.current || !!pendingLifecycle.current || preview.loading} onClick={()=>setPreviewReload(value=>value+1)}>Refresh status</button>{canUndo && <button disabled={busy || !!pendingSave.current || !!pendingLifecycle.current} className="mweb-extras-danger" onClick={()=>setConfirmation('undo')}>Undo semester, stase &amp; poin</button>}</div>
        </>}
      </aside>
      <form id="milestone-form" className="mweb-extras-card milestone-editor" onChangeCapture={()=>{dirty.current=true;}} onSubmit={e=>{e.preventDefault();submit();}}>
        <fieldset disabled={busy || !masters || !!pendingSave.current || !!pendingLifecycle.current || !!confirmation}>
          <div className="milestone-form-fields">
            <Select label="User PPDS *" rows={milestoneOptionRows(options.ppds)} fallbackLabel={initial?.m_user?.display_name || initial?.m_user?.username} value={String(form.id_user)} onChange={value=>{update('id_user',value);dirty.current=true;}}/>
            <Select label="Stase *" rows={milestoneOptionRows(options.stases.filter(row=>!form.id_stage || Number(row.stageId)===Number(form.id_stage)))} fallbackLabel={initial?.m_stase?.name} value={String(form.id_stase)} onChange={value=>{if(lock.current || pendingSave.current || pendingLifecycle.current)return;const selected=masters?.stases.find(row=>Number(row.id)===Number(value));setForm(current=>({...current,id_stase:value,id_stage:selected?.id_stage || '',id_semester:Number(current.id_stage)===Number(selected?.id_stage)?current.id_semester:''}));dirty.current=true;}}/>
            <Select label="Stage *" rows={stages} value={String(form.id_stage)} onChange={selectStage}/>
            <Select label="Semester *" rows={milestoneOptionRows(options.semesters.filter(row=>!form.id_stage || Number(row.stageId)===Number(form.id_stage)))} value={String(form.id_semester)} onChange={value=>{if(lock.current || pendingSave.current || pendingLifecycle.current)return;const selected=masters?.semesters.find(row=>Number(row.id)===Number(value));setForm(current=>({...current,id_semester:value,id_stage:selected?.id_stage || ''}));dirty.current=true;}}/>
            <label className="mweb-extras-field">Date *<input type="date" required value={String(form.date).slice(0,10)} onChange={e=>update('date',e.target.value+'T'+String(form.date).slice(11,16))}/></label>
            <label className="mweb-extras-field">Jam (24 jam)<input type="text" inputMode="numeric" required placeholder="HH:mm" pattern="([01][0-9]|2[0-3]):[0-5][0-9]" maxLength={5} value={String(form.date).slice(11,16)} onChange={e=>update('date',String(form.date).slice(0,10)+'T'+e.target.value)}/></label>
            <label className="mweb-extras-field milestone-notes">Notes<textarea aria-label="Notes" value={form.notes} placeholder="Tambahkan catatan" onChange={e=>update('notes',e.target.value)}/></label>
            <div className="mweb-extras-field milestone-notes"><span>Mengulang Stase</span><div className="milestone-switch-row"><span>No</span><button type="button" role="switch" aria-label="Mengulang Stase" aria-checked={form.is_retake===true} className="milestone-switch" onClick={()=>{update('is_retake',!form.is_retake);dirty.current=true;}}><span/></button><span>Yes</span></div></div>
          </div>
        </fieldset>
        <div className="milestone-form-actions"><button className="mweb-extras-primary" disabled={busy || !masters || !!pendingLifecycle.current || !!pendingSave.current && !pendingSave.current.id} type="submit">{busy?'Menyimpan…':pendingSave.current?.id?'Verifikasi hasil simpan':'Simpan'}</button><button type="button" disabled={busy || !!pendingSave.current || !!pendingLifecycle.current} onClick={()=>{if(initial)leave();else {setForm(milestoneInitial(null));dirty.current=false;}}}>{initial?'Batal':'Reset'}</button>{initial && <button className="mweb-extras-danger" type="button" disabled={busy || !!pendingSave.current || !!pendingLifecycle.current} onClick={()=>setConfirmation('archive')}>Hapus milestone</button>}</div>
      </form>
    </div>
    <Dialog.Root open={!!confirmation} onOpenChange={open=>{if(!open)setConfirmation(null);}}><Dialog.Portal><Dialog.Overlay className="milestone-dialog-overlay"/><Dialog.Content className="milestone-dialog"><Dialog.Title>{confirmation==='archive'?'Hapus milestone?':`Undo perubahan ${targetLabel}?`}</Dialog.Title><Dialog.Description>{confirmation==='archive'?'Milestone Stase akan diarsipkan dan tidak lagi tampil di daftar.':`Kembalikan ke ${preview.data?.restore_semester_name || 'semester sebelumnya'} / ${preview.data?.restore_stase_name || 'stase sebelumnya'} dengan poin aktif ${preview.data?.restore_points ?? 0}. Milestone transisi #${preview.data?.archive_logbook_id} akan diarsipkan, bukan diubah menjadi kartu lama. Kartu sebelumnya dan aktivitas lain tetap tersimpan.`}</Dialog.Description><div><Dialog.Close asChild><button type="button">Batal</button></Dialog.Close><button type="button" className="milestone-confirm-danger" onClick={()=>{const intent=confirmation;setConfirmation(null);if(intent==='archive')archive();else if(canUndo)undo();}}>{confirmation==='archive'?'Hapus':'Undo'}</button></div></Dialog.Content></Dialog.Portal></Dialog.Root>
  </Frame>;
}
