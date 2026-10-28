import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { actorKey, captureReturn, canPopReturn, readListMemory, writeListMemory, forgetListMemory } from '../../navigation';
import { useListPosition } from '../../useListPosition';
import { useInfiniteScroll } from '../../useInfiniteScroll';
import { InfiniteScrollFooter } from '../../InfiniteScrollFooter';
import type { Actor, Row } from './contracts';
import { exploreActions, exploreHref, exploreUserId } from './contracts';
import { exploreBirthDate } from './extrasPresentation';
import { exploreBadgeColor, exploreFiltersPayload, parseExploreDirectory } from './readContracts';
import { mobileRequest } from '../../api';
import { auditScreenVisit } from '../../useNavigationAudit';
import { ExtrasFilter, ExtrasFilterSelect } from './ExtrasFilter';
import { Frame, Info, State, requestData, requestRows, useResource } from './shared';
import './exploreColors.css';

export function Explore({user}: {user:Actor}) {
  const location=useLocation(),navigate=useNavigate(),{userId}=useParams();
  type Directory = {page:number;filter:boolean;expanded:Record<string,boolean>;filters:{ppds_ids:string[];id_semester:string;id_stage:string;id_stase:string}};
  const directoryKey=actorKey(user)+':directory';
  const memory=readListMemory<Directory>('explore-directory',directoryKey)?.value;
  const [filter,setFilter]=useState(memory?.filter ?? false),[page,setPage]=useState(memory?.page ?? 1);
  useEffect(()=>{if(!userId)auditScreenVisit(filter?'explore/filter':'explore/overview');},[filter,userId,user.id,user.id_client]);
  const [expanded,setExpanded]=useState<Record<string,boolean>>(memory?.expanded ?? {});
  const [filters,setFilters]=useState(memory?.filters ?? {ppds_ids:[] as string[],id_semester:'',id_stage:'',id_stase:''});
  const [draft,setDraft]=useState(filters);
  const payload={id_client:user.id_client};
  const masters=useResource(async()=>{
    const semesterBody=await mobileRequest('getMasterSemester',payload);
    if(!Array.isArray(semesterBody.data))throw new Error('Format semester server tidak valid.');
    const semesters:Row[]=semesterBody.data;
    const semesterTotal=semesterBody.total!=null && /^\d+$/.test(String(semesterBody.total)) ? Number(semesterBody.total) : null;
    return {semesters,semesterTotal};
  },actorKey(user));
  const filterOptions=useResource(async()=>{
    if(!filter)return {ppds:[] as Row[],stases:[] as Row[]};
    const [ppds,stases]=await Promise.all([requestRows('getMasterPpds',payload),requestRows('getMasterStase',payload)]);return {ppds,stases};
  },`${actorKey(user)}:${filter}`);
  const list=useResource(async()=>{const body=await mobileRequest('getListExplorePpds',exploreFiltersPayload(user.id_client,filters));parseExploreDirectory(body,[]);return body;},JSON.stringify([actorKey(user),filters]));
  const update=(key:keyof typeof filters,value:string|string[])=>{setDraft(current=>({...current,[key]:value}));};
  const queryMounted=useRef(false);
  useEffect(()=>{if(queryMounted.current){forgetListMemory('explore-directory');window.scrollTo(0,0);}else queryMounted.current=true;},[JSON.stringify(filters)]);
  const stages=Array.from(new Map((masters.data?.semesters || []).filter(row=>row.m_stage?.id ?? row.id_stage).map(row=>{const id=row.m_stage?.id ?? row.id_stage;return [id,{id,name:row.m_stage?.name || row.stage_name || String(id)}];})).values());
  const remember=useListPosition('explore-directory',directoryKey,actorKey(user),{page,filter,filters,expanded},!userId,!list.loading && !masters.loading);
  const select=(row:Row)=>{remember();writeListMemory('explore-directory',directoryKey,actorKey(user),{page,filter,filters,expanded},window.scrollY);captureReturn(user,location);navigate(`/mobile/explore/${exploreUserId(row)}`,{state:{mobileReturn:captureReturn(user,location)}});};
  const directory=list.data && masters.data ? parseExploreDirectory(list.data,masters.data.semesters) : null;
  const largest=Math.max(0,...(directory?.sections.filter(section=>expanded[String(section.semester.id)] ?? section.rows.length>0).map(section=>section.rows.length) || []));
  const infinite=useInfiniteScroll({restored:!!memory,enabled:!filter && !userId && !list.loading && !masters.loading && !list.error && !masters.error && page*12<largest,loading:false,scopeKey:JSON.stringify([actorKey(user),filters]),progressKey:page,onLoadMore:()=>setPage(n=>n+1)});
  if(userId && /^[1-9]\d*$/.test(userId)){
    const selected=(list.data?.data as Row[] | undefined)?.find(row=>exploreUserId(row)===Number(userId)) ?? {id_user:Number(userId)};
    return <ExploreDetail key={userId} user={user} selected={selected} back={()=>{const c=location.state?.mobileReturn;if(canPopReturn(c,user,location.pathname,Number(window.history.state?.idx)))navigate(-1);else navigate('/mobile/explore',{replace:true});}}/>;
  }
  const rows:Row[]=list.data?.data || [];
  return <div className="mweb-explore-colors"><Frame title="Explore PPDS" subtitle="Temukan peserta berdasarkan semester" actions={<><button onClick={()=>setFilter(!filter)} aria-expanded={filter}>Filter</button><button onClick={()=>{void list.refresh();void masters.refresh();}} disabled={list.loading}>Refresh</button></>}>
    <div className="mweb-extras-hero"><span className="mweb-extras-eyebrow">Explore Directory</span><h2>Temukan peserta berdasarkan semester</h2><p>Telusuri data PPDS aktif dan buka detail progres mereka dari setiap tahap semester.</p><div className="mweb-extras-stats"><span><strong>{masters.data?.semesterTotal ?? '—'}</strong> Semester</span><span><strong>{directory?.total ?? '—'}</strong> Peserta</span></div></div>
    {filter && <State loading={filterOptions.loading} error={filterOptions.error} retry={()=>void filterOptions.refresh()}/>}
    {filter && <ExtrasFilter actions={<><button onClick={()=>{setFilters(draft);setPage(1);setExpanded({});}}>Terapkan filter</button><button onClick={()=>{const empty={ppds_ids:[],id_semester:'',id_stage:'',id_stase:''};setDraft(empty);setFilters(empty);setPage(1);setExpanded({});}}>Reset filter</button></>}>
      <ExtrasFilterSelect label="PPDS" multiple value={draft.ppds_ids} onChange={value=>update('ppds_ids',value)} rows={filterOptions.data?.ppds || []}/><ExtrasFilterSelect label="Semester" value={draft.id_semester} onChange={value=>update('id_semester',value)} rows={masters.data?.semesters || []}/><ExtrasFilterSelect label="Stage" value={draft.id_stage} onChange={value=>update('id_stage',value)} rows={stages}/><ExtrasFilterSelect label="Stase" value={draft.id_stase} onChange={value=>update('id_stase',value)} rows={filterOptions.data?.stases || []}/>
    </ExtrasFilter>}
    {directory && !directory.complete && <p role="status">Daftar server belum lengkap. Jumlah per semester belum tersedia; kontrak pagination deployment perlu dikonfirmasi.</p>}
    <State loading={list.loading || masters.loading} error={list.error || masters.error} empty={!rows.length} retry={()=>{void list.refresh();void masters.refresh();}}/>
    {!list.loading && <div className="mweb-extras-grid">{directory?.sections.map(({semester,rows:members,total})=>{
      const participants=members.slice(0,page*12);
      return <details className="mweb-extras-card" key={semester.id} open={expanded[String(semester.id)] ?? participants.length>0} onToggle={e=>{const open=e.currentTarget.open;setExpanded(old=>old[String(semester.id)]===open ? old : {...old,[String(semester.id)]:open});}}><summary><strong>{semester.name}</strong><span className="mweb-extras-pill">{total ?? '—'} peserta</span></summary><div className="mweb-extras-list">{participants.map((row,index)=><button className="mweb-extras-row" key={exploreUserId(row) ?? index} disabled={!exploreUserId(row)} onClick={()=>select(row)}><span className="mweb-extras-avatar">{String(row.name || row.display_name || row.m_user?.display_name || '?').slice(0,1)}</span><span><strong>{row.name || row.display_name || row.m_user?.display_name || '—'}</strong><small>{row.nim || row.code || row.m_user?.code || '—'}</small></span><span className="mweb-extras-pill mweb-explore-stase-badge" style={{backgroundColor:exploreBadgeColor(row)}}>{row.stase_name || row.m_stase?.name || 'Belum ada stase'}</span><span aria-hidden="true">›</span></button>)}</div></details>;
    })}</div>}
    {page*12<largest && <InfiniteScrollFooter sentinelRef={infinite.sentinelRef} loading={false} onLoadMore={()=>setPage(n=>n+1)}/>}
  </Frame></div>;
}
function ExploreDetail({user,selected,back}: {user:Actor;selected:Row;back:()=>void}) {
  const id=exploreUserId(selected)!;
  const location=useLocation();
  const detail=useResource(async()=>{
    const [row,masterActions]=await Promise.all([requestData('exploreDetailPpds',{id_client:user.id_client,id_user:id}),requestRows('getMasterAction',{id_client:user.id_client,id_semester:null}).catch(()=>[] as Row[])]);
    if(Number(row?.id)!==id)throw new Error('Identitas PPDS tidak sesuai permintaan.');
    return {...row,m_actions:[...(row.m_actions || []),...masterActions]};
  },`${actorKey(user)}:${id}`);
  const data:Row=detail.data || {}, actions=exploreActions(data);
  const remember=useListPosition('explore-detail',`${actorKey(user)}:${id}`,actorKey(user),{},true,!detail.loading && !!detail.data);
  return <Frame title="Detail PPDS" actions={<><button onClick={back}>‹ Kembali</button><button onClick={()=>void detail.refresh()} disabled={detail.loading}>Refresh</button></>}><State loading={detail.loading} error={detail.error} retry={()=>void detail.refresh()}/>{detail.data && <div className="mweb-extras-columns"><article className="mweb-extras-card"><span className="mweb-extras-eyebrow">Profil Peserta</span><h2>{data.display_name || selected.display_name || selected.m_user?.display_name}</h2><Info items={[
    ['NIM',data.code],['Semester',data.m_semester?.name],['Poin Morbiditas',data.morbiditas_points],['Alamat',data.address],['Jenis Kelamin',data.gender],['Tanggal Lahir',exploreBirthDate(data.date_of_birth)],
  ]}/></article><article><h2>Aktivitas akademik</h2><p>Pilih aktivitas untuk melihat detail · Hanya baca</p><div className="mweb-extras-grid">{actions.map(action=>action.id ? <Link key={action.identifier} className="mweb-extras-card mweb-extras-metric" onClick={()=>{remember();captureReturn(user,location);}} state={{mobileReturn:captureReturn(user,location)}} to={exploreHref(action.id,id)}><strong>{action.name || action.identifier}</strong><span><b>{action.count}</b> Logbook ›</span></Link> : <div key={action.identifier} className="mweb-extras-card mweb-extras-metric"><strong>{action.name}</strong><span><b>{action.count}</b> Logbook · ID aktivitas belum tersedia</span></div>)}</div><State empty={!actions.length}/></article></div>}</Frame>;
}
