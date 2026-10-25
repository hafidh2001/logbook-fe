type Row=Record<string,any>;
const text=(value:unknown)=>typeof value==='string' ? value.trim() : '';
/** Native mapTodoApiItemToView: preferred array even when empty, count fallback pending. */
export function todoTriage(row:Row) {
  const statuses=[row.verification_statuses,row.t_verification,row.verifications].find(Array.isArray) as Row[]|undefined;
  const fallback=Number(row.total_verifier ?? row.verifier_count ?? 0);
  const verifiers=statuses?.length || (Number.isFinite(fallback) && fallback>0 ? Math.floor(fallback) : 0);
  const pending=statuses?.length ? statuses.filter(entry=>!['verified','approve','approved','done','rejected','reject','revision'].includes(String(entry?.status ?? entry?.verified_status ?? '').trim().toLowerCase())).length : verifiers;
  return {semester:text(row.m_semester?.name)||'Belum ada semester',verifiers,pending};
}
/** Safe input for the native text mapper; malformed legacy scalar fields cannot crash cards. */
export function safeNotificationInput(row:Row):Row {
  const safe={...row};
  for(const key of ['message','description','body','notes','title','type','ppds_name','action_name'])safe[key]=text(row[key]);
  return safe;
}
export function notificationTone(row:Row):'rejected'|'revised'|null {
  const type=text(row.type).toLowerCase();
  if(['rejected','reject'].includes(type))return 'rejected';
  if(['revised','revision','unverify'].includes(type))return 'revised';
  // Historical backend template: Data <action> <timestamp> <event> oleh <staff>.
  // Never infer urgency from an incidental word in free-text messages/notes.
  const message=text(row.message)||text(row.description)||text(row.body)||text(row.notes);
  const match=message.match(/^Data .+? (?:\d{4}-\d{2}-\d{2}[ T]\S+|\d{2}\/\d{2}\/\d{4}\s+\S+) (ditolak|dibatalkan verifikasinya) oleh .+$/i);
  return match ? match[1].toLowerCase()==='ditolak' ? 'rejected':'revised' : null;
}
