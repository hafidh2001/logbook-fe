import { Fragment } from 'react';
import { AttachmentCard, activeAttachments, attachmentSlots } from './AttachmentFields';
import { attachmentGroup, isImage } from './attachments';
import { buildDetailFields, detailActionKey, examPresentation } from './detailFields';
import { buildScoreItems, buildExploreAverageScoreItems, shouldShowScoreAssessment } from './detailScores';
import { type DynamicLogbookAction, type UserRole } from './dynamicLogbookForm';
import type { Row } from './model';
export function DetailContent({action,record,role,onPreview,fromExplore=false,currentUserId}:{action:DynamicLogbookAction;record:Row;role:UserRole;fromExplore?:boolean;currentUserId?:number;onPreview:(url:string)=>void}) {
  const fields=buildDetailFields(action,record,role),slots=attachmentSlots(action,activeAttachments(record));
  const consumed=new Set<typeof slots[number]>();
  const scoreRecord={...record,m_action:action};const own=buildScoreItems(scoreRecord,role,currentUserId);const scores=role!=='staff'?[]:fromExplore&&shouldShowScoreAssessment(scoreRecord)?buildExploreAverageScoreItems(scoreRecord):own.length?own:buildScoreItems(scoreRecord,role);
  function attachments(key:string) {
    const matches=slots.filter(s=>key==='attachment'||attachmentGroup(s.label)===(key==='attachmentBefore'?'attachment-before':'attachment-after'));
    matches.forEach(s=>consumed.add(s));if(detailActionKey(action)==='morbiditas'&&!matches.some(s=>s.files.length))return <div className="mweb-detail-field mweb-detail-wide" data-detail-key={key}><small>Lampiran (Opsional)</small><p>-</p></div>;return matches.filter(s=>s.files.length).map(slot=><section key={slot.label} className="mweb-detail-attachment mweb-detail-wide" data-detail-key={key}><h3>{detailActionKey(action)==='morbiditas'?'Lampiran (Opsional)':slot.label}{slot.files.filter(isImage).length>0&&<small> · {slot.files.filter(isImage).length} gambar</small>}</h3>{slot.files.map((file,i)=><AttachmentCard key={file.occurrenceKey??`${file.id}:${i}`} file={file} onPreview={onPreview}/>)}</section>);
  }
  return <><div className="mweb-detail-fields">{fields.map(field=>field.attachment?<Fragment key={field.key}>{attachments(field.key)}</Fragment>:<div data-detail-key={field.key} className={`mweb-detail-field${field.wide?' mweb-detail-wide':''}${field.patient?' mweb-patient-field':''}`} key={field.key}><small>{field.label}</small>{field.key==='status'?<p className={`mweb-exam-${examPresentation(record.exam_result).tone}`}>{examPresentation(record.exam_result).icon} {field.value}</p>:<p>{field.value}</p>}</div>)}{slots.filter(s=>!consumed.has(s)&&s.files.length).map(slot=><section key={slot.label} className="mweb-detail-attachment mweb-detail-wide"><h3>{slot.label}{slot.files.filter(isImage).length>0&&<small> · {slot.files.filter(isImage).length} gambar</small>}</h3>{slot.files.map((file,i)=><AttachmentCard key={file.occurrenceKey??`${file.id}:${i}`} file={file} onPreview={onPreview}/>)}</section>)}</div>{scores.length>0&&<section className="mweb-section"><h3>Hasil Penilaian</h3>{scores.map((s,i)=><div className="mweb-row mweb-between mweb-detail-field" key={`${s.label}:${i}`}><span>{s.label}</span><strong>{s.value}</strong></div>)}</section>}</>;
}
