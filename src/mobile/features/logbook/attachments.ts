import { isServerAttachmentPath } from './attachmentPath';
import { MOBILE_API_URL } from '../../api';
export const ACCEPT_FILES = '.jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
export type Attachment = { occurrenceKey?:string; id?: number|string; name: string; url_file: string; file_name?:string; file_type?:string; file_size?:number; original_name?:string; filename?:string; deleted_at?:unknown };
export function attachmentGroup(label: string) { const l=label.trim().toLowerCase(); return ['before','attachment before','attachment-before'].includes(l)?'attachment-before':['after','attachment after','attachment-after'].includes(l)?'attachment-after':'attachment'; }
export function attachmentUrl(value: unknown):string|undefined {
  if(typeof value!=='string'||!value.trim())return;
  const raw=value.trim(); if(/[\\\u0000-\u001f\u007f]/.test(raw))return;
  const path=raw.split(/[?#]/)[0];
  try { if(path.split('/').some(p=>{const v=decodeURIComponent(p);return v==='..'||v==='.'||/[\\\u0000-\u001f\u007f]/.test(v)||/%[0-9a-f]{2}/i.test(v)||/%(?:2f|5c)/i.test(p);}))return; const u=new URL(raw,'https://hachi.kelava.id/');return ['https:','http:'].includes(u.protocol)?u.href:undefined;}catch{return;}
}
export function attachmentName(a:Attachment) { const explicit=[a.original_name,a.file_name,a.filename].find(x=>typeof x==='string'&&x.trim());if(explicit)return explicit; try{return decodeURIComponent(new URL(attachmentUrl(a.url_file)??'https://hachi.kelava.id/').pathname.split('/').pop()??'')||'Nama file tidak tersedia';}catch{return 'Nama file tidak tersedia';} }
export function isImage(a:Attachment) { return /^image\/(jpeg|png|webp)$/i.test(a.file_type??'')||/\.(jpe?g|png|webp)(?:[?#]|$)/i.test(a.url_file); }
export function validateFile(file:File) {if(!Number.isFinite(file.size)||file.size<=0)throw new Error('File kosong atau tidak dapat dibaca.');if(!/\.(jpe?g|png|webp|pdf|docx?|xlsx?|pptx?)$/i.test(file.name))throw new Error('Jenis file tidak didukung. Gunakan gambar, PDF, DOC/DOCX, XLS/XLSX, atau PPT/PPTX.');}
/** Read-only, bounded capability negotiation; no multipart bytes are sent here. */
export async function getUploadCapability(identity:{id:number;id_client:number},signal:AbortSignal):Promise<{grouped:boolean}> {
  if(![identity.id,identity.id_client].every(id=>Number.isInteger(id)&&id>0&&id<=2147483647))throw new Error('Sesi login tidak valid.');
  const controller=new AbortController();
  const abort=()=>controller.abort();signal.addEventListener('abort',abort,{once:true});
  const timer=setTimeout(abort,30000);
  try {
    if(signal.aborted)controller.abort();
    const capability=await fetch(`${MOBILE_API_URL}prasiUpload&id_user=${identity.id}&id_client=${identity.id_client}`,{method:'GET',signal:controller.signal,credentials:'omit',redirect:'error'});
    if(!capability.ok||capability.headers.get('X-Prasi-Upload-Contract')!=='prasi-file-v1')throw new Error('Handler upload belum tersedia atau header kapabilitas tidak diizinkan oleh CORS. Tidak ada file dikirim.');
    return {grouped:capability.headers.get('X-Prasi-Upload-Groups')==='label-v1'};
  } finally {clearTimeout(timer);signal.removeEventListener('abort',abort);}
}
export async function uploadAttachment(file:File,label:string,identity:{id:number;id_client:number},onProgress:(v:number|null)=>void,signal:AbortSignal):Promise<Attachment> {
  validateFile(file);
  if(!Number.isSafeInteger(identity.id)||identity.id<=0||!Number.isSafeInteger(identity.id_client)||identity.id_client<=0)throw new Error('Sesi login tidak valid.');
  const endpoint=`${MOBILE_API_URL}prasiUpload`;const group=attachmentGroup(label);
  const {grouped}=await getUploadCapability(identity,signal);
  if(group!=='attachment'&&!grouped)throw new Error('Server belum mendukung upload Before/After (label-v1). Tidak ada file dikirim.');
  const form=new FormData();form.append('id_user',String(identity.id));form.append('id_client',String(identity.id_client));if(grouped)form.append('attachment_group',group);form.append(['id_user','id_client','attachment_group'].includes(file.name)?'file':file.name,file,file.name);
  const text=await new Promise<string>((resolve,reject)=>{const xhr=new XMLHttpRequest();const abort=()=>xhr.abort();signal.addEventListener('abort',abort,{once:true});xhr.open('POST',endpoint);xhr.timeout=180000;xhr.upload.onprogress=e=>onProgress(e.lengthComputable?Math.round(e.loaded/e.total*100):null);xhr.upload.onload=()=>onProgress(null);xhr.onload=()=>{signal.removeEventListener('abort',abort);xhr.status>=200&&xhr.status<300?resolve(xhr.responseText):reject(new Error(`Gagal upload (HTTP ${xhr.status}). ${xhr.status===413?'Server menolak ukuran request.':xhr.status===415?'Jenis/isi file tidak dikenali server.':xhr.status===502?'Layanan upstream tidak tersedia.':'Silakan coba lagi.'}`));};xhr.onerror=()=>{signal.removeEventListener('abort',abort);reject(new Error('Koneksi upload gagal. Periksa CORS server.'));};xhr.onabort=()=>reject(new Error('Upload dibatalkan.'));xhr.ontimeout=()=>{signal.removeEventListener('abort',abort);reject(new Error('Upload melewati batas waktu.'));};if(signal.aborted){reject(new Error('Sesi berubah.'));return;}xhr.send(form);});
  let value:any=text;try{value=JSON.parse(text);}catch{/* Contract also supports plain paths. */}if(Array.isArray(value))value=value.length===1?value[0]:null;else if(value&&typeof value==='object')value=value.path;
  if(typeof value!=='string')throw new Error('Respons upload tidak valid.');const relative=value.replace(/^\//,'');const path=relative.startsWith('_file/')?relative:`_file/${relative}`;
  if(!/^_file\/\d{4}-\d{1,2}\/\d{1,2}\//.test(path)||!isServerAttachmentPath(path)||/\/undefined(?:-\d+)?$/.test(path)||(grouped&&(path.split('/')[3]!==group||path.split('/').length!==5)))throw new Error('Referensi upload server tidak valid atau folder tidak sesuai.');
  // The path is server-issued; original filename/MIME are display-only, not ownership proof.
  return {name:label,url_file:path,file_name:file.name,file_type:file.type,file_size:file.size};
}
