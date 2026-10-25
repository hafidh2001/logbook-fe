import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { mobileRequest } from '../../api';
import type { Row } from './contracts';

export async function requestData(endpoint: string, payload: Record<string, unknown>) {
  const body = await mobileRequest(endpoint, payload);
  if (!('data' in body)) throw new Error('Data server tidak tersedia.');
  return body.data;
}
export async function requestRows(endpoint: string, payload: Record<string, unknown>): Promise<Row[]> {
  const data = await requestData(endpoint, payload);
  if (!Array.isArray(data)) throw new Error('Format daftar server tidak valid.');
  return data;
}
export const messageOf = (error: unknown) => error instanceof Error ? error.message : 'Permintaan gagal. Silakan coba lagi.';
export function useResource<T>(load: () => Promise<T>, identity: string) {
  const [state,setState]=useState<{identity:string;data:T|null;error:string;loading:boolean}>({identity,data:null,error:'',loading:true});
  const generation=useRef(0),loader=useRef(load),currentIdentity=useRef(identity);
  loader.current=load;currentIdentity.current=identity;
  const refresh=useCallback(async()=>{
    const request=++generation.current,started=currentIdentity.current;
    const current=()=>request===generation.current && started===currentIdentity.current;
    setState(old=>({identity:started,data:old.identity===started?old.data:null,error:'',loading:true}));
    try{const value=await loader.current();if(current())setState({identity:started,data:value,error:'',loading:false});}
    catch(e){if(current())setState(old=>({...old,error:messageOf(e),loading:false}));}
  },[]);
  useEffect(()=>{void refresh();return()=>{generation.current++;};},[identity,refresh]);
  // Hide a previous account/filter synchronously, before passive effect cleanup.
  return {data:state.identity===identity?state.data:null,error:state.identity===identity?state.error:'',loading:state.identity!==identity || state.loading,refresh};
}
export function Frame({title, subtitle, children, actions}: {title:string;subtitle?:string;children:ReactNode;actions?:ReactNode}) {
  return <section className="mweb-extras"><header className="mweb-extras-header"><div><span className="mweb-extras-eyebrow">MedicLink • Logbook</span><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div><div className="mweb-extras-actions">{actions}</div></header>{children}</section>;
}
export function State({loading,error,empty,retry}: {loading?:boolean;error?:string;empty?:boolean;retry?:()=>void}) {
  if (error) return <div className="mweb-extras-notice" role="alert"><strong>Gagal memuat data</strong><p>{error}</p>{retry && <button type="button" onClick={retry}>Coba lagi</button>}</div>;
  if (loading) return <p role="status" className="mweb-extras-notice">Memuat data…</p>;
  return empty ? <div className="mweb-extras-card mweb-extras-empty"><strong>Belum ada data</strong><p>Tidak ada hasil untuk pilihan saat ini.</p></div> : null;
}
export function Select({label,value,onChange,rows,multiple=false}: {label:string;value:string|string[];onChange:(value:string|string[])=>void;rows:Row[];multiple?:boolean}) {
  const [query,setQuery]=useState('');
  const labelOf=(row:Row)=>String(row.name || row.display_name || row.username || row.stase || `#${row.id}`);
  const selected=Array.isArray(value)?value:[];
  const visible=multiple?rows.filter(row=>selected.includes(String(row.id)) || labelOf(row).toLowerCase().includes(query.trim().toLowerCase())):rows;
  return <label className="mweb-extras-field"><span>{label}</span>{multiple && <><input aria-label={`Cari ${label}`} placeholder={`Cari ${label}`} value={query} onChange={e=>setQuery(e.target.value)}/><span>{selected.map(id=><button type="button" key={id} aria-label={`Hapus ${labelOf(rows.find(row=>String(row.id)===id) || {id})}`} onClick={e=>{e.preventDefault();onChange(selected.filter(value=>value!==id));}}>{labelOf(rows.find(row=>String(row.id)===id) || {id})} ×</button>)}</span></>}<select aria-label={label} multiple={multiple} value={value} onChange={e => onChange(multiple ? Array.from(e.target.selectedOptions, option=>option.value) : e.target.value)}>{!multiple && <option value="">Semua / Pilih {label}</option>}{visible.map(row=><option key={row.id} value={row.id}>{labelOf(row)}</option>)}</select></label>;
}
export function Info({items}: {items:Array<[string,unknown]>}) {
  return <dl className="mweb-extras-info">{items.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value == null || value === '' ? '—' : String(value)}</dd></div>)}</dl>;
}
export function Pagination({page,setPage,total,size=12}: {page:number;setPage:(page:number)=>void;total:number;size?:number}) {
  const count = Math.max(1,Math.ceil(total/size));
  if (count < 2) return null;
  return <nav className="mweb-extras-pagination" aria-label="Halaman daftar"><button disabled={page<=1} onClick={()=>setPage(page-1)}>Sebelumnya</button><span>{page} / {count} · {total} hasil</span><button disabled={page>=count} onClick={()=>setPage(page+1)}>Berikutnya</button></nav>;
}
export const slicePage = <T,>(rows:T[],page:number,size=12) => rows.slice((page-1)*size,page*size);
