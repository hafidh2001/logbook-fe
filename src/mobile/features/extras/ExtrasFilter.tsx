import { useId, type ReactNode } from 'react';
import ReactSelect from 'react-select';
import { SlidersHorizontal } from 'lucide-react';
import type { Row } from './contracts';
import './extrasFilter.css';

/** Presentation only: callers retain their original draft/apply/reset contracts. */
export function ExtrasFilter({children, actions}: {children:ReactNode;actions:ReactNode}) {
  return <section className="extras-filter" aria-label="Filter"><h2><SlidersHorizontal size={18} aria-hidden="true"/>Filter</h2><div className="extras-filter-grid">{children}</div><div className="extras-filter-actions">{actions}</div></section>;
}

/** Search is menu-local, just like shared.Select's former PPDS search input. */
export function ExtrasFilterSelect({label,value,onChange,rows,multiple=false,searchRows=rows}: {label:string;value:string|string[];onChange:(value:string|string[])=>void;rows:Row[];multiple?:boolean;searchRows?:Row[]}) {
  const id=useId();
  const options=rows.map(row=>{const source=searchRows.find(item=>String(item.id ?? item.id_user)===String(row.id)) || row;return {value:String(row.id),label:String(row.name || row.display_name || row.username || row.stase || `#${row.id}`),search:[row.name,row.display_name,row.username,row.nim,row.code,row.stase,source.name,source.display_name,source.username,source.nim,source.code].filter(Boolean).join(' ') || `#${row.id}`};});
  const selected=multiple ? (Array.isArray(value)?value:[]).map(id=>options.find(row=>row.value===id) || {value:id,label:`#${id}`,search:id}) : options.find(row=>row.value===value) || null;
  return <div className="mweb-extras-field extras-filter-select"><label htmlFor={id}>{label}</label><ReactSelect inputId={id} aria-label={label} classNamePrefix="extras-choice" isMulti={multiple} isClearable isSearchable options={options} value={selected} placeholder={multiple?'Cari peserta PPDS…':`Semua / Pilih ${label}`} filterOption={(option,query)=>option.data.search.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())} closeMenuOnSelect blurInputOnSelect menuPortalTarget={typeof document!=='undefined'?document.body:undefined} menuPosition="fixed" maxMenuHeight={220} styles={{menuPortal:base=>({...base,zIndex:1000}),option:(base,state)=>({...base,backgroundColor:state.isSelected?'#087f5b':state.isFocused?'#eaf6ef':'white',color:state.isSelected?'white':'#153c2b'})}} onChange={next=>onChange(multiple?(Array.isArray(next)?next.map(row=>row.value):[]):(next as {value:string}|null)?.value || '')} noOptionsMessage={()=>'Tidak ada pilihan yang cocok.'}/></div>;
}
