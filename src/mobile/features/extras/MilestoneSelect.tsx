import { useId } from 'react';
import ReactSelect from 'react-select';
import type { Row } from './contracts';

/** ID-backed searchable menu, matching Native MilestoneActionScreen's Select. */
export function MilestoneSelect({label,value,onChange,rows,multiple=false,fallbackLabel}:{label:string;value:string|string[];onChange:(value:string|string[])=>void;rows:Row[];multiple?:boolean;fallbackLabel?:string}) {
  const id=useId();
  const options=rows.map(row=>({value:String(row.id),label:String(row.display_name || row.name || row.username || row.stase || `#${row.id}`).trim()})).filter(row=>row.value && row.label);
  const selected=multiple ? options.filter(row=>Array.isArray(value)&&value.includes(row.value)) : options.find(row=>row.value===String(value)) || (value && fallbackLabel?{value:String(value),label:fallbackLabel}:null);
  return <div className="mweb-extras-field milestone-select"><label htmlFor={id}>{label}</label><ReactSelect name={label.replace(' *','')} required={label.endsWith(' *')} inputId={id} aria-label={label} classNamePrefix="milestone-choice" options={options} value={selected} isMulti={multiple} isClearable isSearchable placeholder={`Pilih ${label.replace(' *','')}`} noOptionsMessage={()=>options.length?'Tidak ada hasil':'Pilihan tidak tersedia'} onChange={next=>onChange(multiple ? (Array.isArray(next)?next.map(row=>row.value):[]) : (next as {value:string}|null)?.value || '')}/></div>;
}
