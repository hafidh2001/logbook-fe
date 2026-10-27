import { useEffect, useRef, useState } from 'react';
import {
  attachmentGroup,
  attachmentName,
  attachmentUrl,
  isImage,
  uploadAttachment,
  validateFile,
  type Attachment,
} from './attachments';
import { getDynamicAttachmentLabels, type DynamicLogbookAction } from './dynamicLogbookForm';
import { arr } from './model';
import { ImageReview, type ReviewImage } from './ImageReview';
import { AttachmentControl } from './AttachmentControl';
import type { CropRect } from './imageGeometry';
export { AttachmentPreview } from './ImagePreview';
export type UploadDraft = {
  key: string;
  file: File;
  original?: File;
  edit?: { crop: CropRect; rotation: number };
  label: string;
  state: 'ready' | 'uploading' | 'done' | 'error';
  progress: number | null;
  phase?: 'uploading' | 'processing';
  error?: string;
  uploaded?: Attachment;
};
export function attachmentSlots(action: DynamicLogbookAction, files: Attachment[]) {
  const seenLabels = new Set<string>();
  const labels = getDynamicAttachmentLabels(action).filter((label) => {
    const group = attachmentGroup(label);
    const key = group === 'attachment' ? label.trim().toLowerCase() : group;
    if (seenLabels.has(key)) return false;
    seenLabels.add(key);
    return true;
  });
  if (!labels.length && files.length) labels.push('Attachment');
  const used = new Set<number>();
  const slots = labels.map((label) => ({
    label,
    files: files.filter((f, i) => {
      const match =
        attachmentGroup(label) !== 'attachment'
          ? attachmentGroup(f.name ?? '') === attachmentGroup(label)
          : String(f.name ?? '')
              .trim()
              .toLowerCase() === label.trim().toLowerCase() ||
            (labels.length === 1 && attachmentGroup(f.name ?? '') === 'attachment');
      if (match) used.add(i);
      return match;
    }),
  }));
  const unknown = files.filter((_, i) => !used.has(i));
  if (unknown.length) slots.push({ label: 'Lampiran lainnya', files: unknown });
  return slots;
}
export function activeAttachments(record: Record<string, any>): Attachment[] {
  return arr(record.t_logbook_attachment)
    .filter((a) => a.deleted_at == null)
    .map(
      (a, index) =>
        ({
          ...a,
          occurrenceKey: `${a.id ?? a.url_file ?? 'file'}:${index}`,
          url_file: a.url_file ?? a.file_path ?? a.path ?? a.url ?? '',
          name: a.name ?? '',
        }) as Attachment,
    );
}
function DraftImage({ file, onPreview }: { file: File; onPreview: (url: string) => void }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (!/\.(jpe?g|png|webp)$/i.test(file.name)) return;
    const value = URL.createObjectURL(file);
    setUrl(value);
    return () => URL.revokeObjectURL(value);
  }, [file]);
  return url ? (
    <button
      type="button"
      className="mweb-file-preview"
      aria-label={`Lihat ${file.name}`}
      onClick={() => onPreview(url)}
    >
      <img src={url} alt={file.name} />
    </button>
  ) : null;
}
export function AttachmentCard({
  file,
  onRemove,
  onPreview,
}: {
  file: Attachment;
  onRemove?: () => void;
  onPreview: (url: string) => void;
}) {
  const url = attachmentUrl(file.url_file);
  return (
    <article className="mweb-file">
      {url && isImage(file) ? (
        <button
          type="button"
          className="mweb-file-preview"
          onClick={() => onPreview(url)}
          aria-label={`Lihat ${attachmentName(file)}`}
        >
          <img src={url} alt={attachmentName(file)} loading="lazy" />
        </button>
      ) : (
        <span className="mweb-file-icon" aria-hidden="true">
          ▤
        </span>
      )}
      <div>
        <strong>{attachmentName(file)}</strong>
        <small>
          {file.file_size
            ? `${(file.file_size / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} MB`
            : 'Ukuran tidak tersedia'}
        </small>
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Buka / unduh
          </a>
        ) : (
          <small>Referensi file tidak valid</small>
        )}
      </div>
      {onRemove && (
        <button type="button" className="mweb-btn mweb-danger" onClick={onRemove}>
          Hapus
        </button>
      )}
    </article>
  );
}

export function AttachmentFields({
  action,
  retained,
  onRetained,
  drafts,
  onDrafts,
  identity,
  disabled = false,
  readOnly = false,
  onPreview,
  onPendingChange,
}: {
  action: DynamicLogbookAction;
  retained: Attachment[];
  onRetained?: (a: Attachment[]) => void;
  drafts: UploadDraft[];
  onDrafts?: (a: UploadDraft[]) => void;
  identity: { id: number; id_client: number };
  disabled?: boolean;
  readOnly?: boolean;
  onPreview: (url: string) => void;
  onPendingChange?: (pending: boolean) => void;
}) {
  const [review, setReview] = useState<UploadDraft[] | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [working, setWorking] = useState(false);
  const locked = useRef(false);
  const reviewRef = useRef<UploadDraft[] | null>(null);
  const errorRef = useRef<Record<string, string>>({});
  const controller = useRef(new AbortController());
  const operations = useRef(new Map<string, AbortController>());
  const current = useRef(drafts);
  const callbacks = useRef({ onDrafts, onPendingChange });
  callbacks.current = { onDrafts, onPendingChange };
  current.current = drafts;
  const inputBlocked = disabled || readOnly || working || drafts.some(d => d.state === 'uploading');
  function reportPending() {
    callbacks.current.onPendingChange?.(locked.current || !!reviewRef.current ||
      Object.values(errorRef.current).some(Boolean) || current.current.some(d => d.state !== 'done' || !d.uploaded));
  }
  function publish(next: UploadDraft[]) {
    current.current = next;
    callbacks.current.onDrafts?.(next);
    reportPending();
  }
  function change(key: string, patch: Partial<UploadDraft>) {
    publish(current.current.map(d => d.key === key ? { ...d, ...patch } : d));
  }
  function showReview(next: UploadDraft[] | null) {
    reviewRef.current = next;
    setReview(next);
    reportPending();
  }
  function setLock(next: boolean) {
    locked.current = next;
    setWorking(next);
    reportPending();
  }
  useEffect(() => {
    const c = new AbortController();
    controller.current = c;
    locked.current = false;
    reviewRef.current = null;
    errorRef.current = {};
    setWorking(false); setReview(null); setErrors({});
    const cancel = () => {
      c.abort();
      operations.current.forEach(op => op.abort());
      reviewRef.current = null;
      setReview(null);
      callbacks.current.onPendingChange?.(true);
    };
    window.addEventListener('mobile:session-cleared', cancel);
    return () => {
      c.abort();
      operations.current.forEach(op => op.abort());
      operations.current.clear();
      window.removeEventListener('mobile:session-cleared', cancel);
    };
  }, [identity.id, identity.id_client]);
  function alive(owner: AbortController) {
    return controller.current === owner && !owner.signal.aborted;
  }
  async function uploadOne(candidate: UploadDraft, owner: AbortController) {
    const original = current.current.find(d => d.key === candidate.key);
    if (!alive(owner) || !original || operations.current.has(candidate.key)) return;
    const op = new AbortController();
    operations.current.set(candidate.key, op);
    const abort = () => op.abort();
    owner.signal.addEventListener('abort', abort, { once: true });
    const valid = () => alive(owner) && !op.signal.aborted &&
      operations.current.get(candidate.key) === op && current.current.some(d => d.key === candidate.key);
    change(candidate.key, { state: 'uploading', error: undefined, progress: 0, phase: 'uploading' });
    try {
      const uploaded = await uploadAttachment(candidate.file, candidate.label, identity,
        (progress, phase) => { if (valid()) change(candidate.key, { progress, phase }); }, op.signal);
      if (valid()) change(candidate.key, { ...candidate, state: 'done', uploaded, error: undefined });
    } catch (e) {
      if (valid()) {
        const message = e instanceof Error ? e.message : 'Upload gagal.';
        change(candidate.key, original.uploaded
          ? { ...original, state: 'done', error: `Gambar asli dipertahankan. ${message}` }
          : { state: 'error', error: message });
      }
    } finally {
      owner.signal.removeEventListener('abort', abort);
      if (operations.current.get(candidate.key) === op) operations.current.delete(candidate.key);
    }
  }
  function append(valid: UploadDraft[]) {
    const existing = new Set(current.current.map(d => d.key));
    publish([...current.current, ...valid.filter(d => !existing.has(d.key))]);
  }
  async function runBatch(batch: UploadDraft[], owner: AbortController) {
    for (const draft of batch) {
      if (!alive(owner)) return;
      await uploadOne(draft, owner);
    }
  }
  async function retry(key: string) {
    const draft = current.current.find(d => d.key === key);
    if (disabled || readOnly || locked.current || reviewRef.current || draft?.state !== 'error' || !alive(controller.current)) return;
    const owner = controller.current;
    setLock(true);
    try { await uploadOne(draft, owner); }
    finally { if (alive(owner)) setLock(false); }
  }
  async function commitReview(files: ReviewImage[]) {
    const session = reviewRef.current;
    if (!session || disabled || readOnly || locked.current || !alive(controller.current)) return;
    const outputs = new Map(files.map(file => [file.key, file]));
    if (session.some(d => !outputs.has(d.key))) return;
    const owner = controller.current;
    setLock(true);
    const next: UploadDraft[] = session.map(d => {
      const output = outputs.get(d.key)!;
      return { ...d, file: output.file,
        edit: output.crop && output.rotation !== undefined ? { crop: output.crop, rotation: output.rotation } : d.edit,
        state: 'ready', uploaded: undefined, progress: 0 };
    });
    append(next);
    showReview(null);
    try { await runBatch(next, owner); }
    finally { if (alive(owner)) setLock(false); }
  }
  async function pick(files: readonly File[], label: string, sourceErrors: string[] = []) {
    if (inputBlocked || locked.current || reviewRef.current || !alive(controller.current)) return;
    const owner = controller.current;
    setLock(true);
    const valid: UploadDraft[] = [];
    const messages = [...sourceErrors];
    for (const file of files) {
      try {
        validateFile(file);
        valid.push({ key: crypto.randomUUID(), file, original: file, label, state: 'ready', progress: 0 });
      } catch (e) { messages.push(`${file.name}: ${e instanceof Error ? e.message : 'File tidak valid.'}`); }
    }
    errorRef.current = { ...errorRef.current, [label]: messages.join('\n') };
    setErrors(errorRef.current);
    const images = valid.filter(d => /\.(jpe?g|png|webp)$/i.test(d.file.name));
    const documents = valid.filter(d => !images.includes(d));
    append(documents);
    try {
      // Documents finish first; canceling the later image review keeps them.
      await runBatch(documents, owner);
      if (alive(owner) && images.length) showReview(images);
    } finally { if (alive(owner)) setLock(false); }
  }
  function remove(key: string) {
    if (disabled || readOnly) return;
    operations.current.get(key)?.abort();
    operations.current.delete(key);
    publish(current.current.filter(d => d.key !== key));
  }

  const slots = attachmentSlots(action, retained);
  if (!slots.length && !readOnly) slots.push({ label: 'Attachment', files: [] });
  return (
    <div className="mweb-attachments">
      {review && (
        <ImageReview
          images={review
            .filter((d) => /\.(jpe?g|png|webp)$/i.test(d.file.name))
            .map((d) => ({
              key: d.key,
              file: d.original ?? d.file,
              crop: d.edit?.crop,
              rotation: d.edit?.rotation,
            }))}
          onCancel={() => showReview(null)}
          onConfirm={commitReview}
        />
      )}
      {slots.map((slot) => (
        <section key={slot.label} className="mweb-field">
          <h3>
            {slot.label}
            {slot.files.filter(isImage).length > 0 && (
              <small> · {slot.files.filter(isImage).length} gambar</small>
            )}
          </h3>
          {slot.files.map((file, i) => (
            <AttachmentCard
              key={file.occurrenceKey ?? `${file.id ?? file.url_file}:${i}`}
              file={file}
              onPreview={onPreview}
              onRemove={
                inputBlocked
                  ? undefined
                  : () =>
                      onRetained?.(
                        retained.filter(
                          (_, index) =>
                            index !==
                            retained.map((f, j) => (f === file ? j : -1)).filter((j) => j >= 0)[
                              slot.files.slice(0, i).filter((f) => f === file).length
                            ],
                        ),
                      )
              }
            />
          ))}
          {drafts
            .filter((d) =>
              attachmentGroup(slot.label) !== 'attachment'
                ? attachmentGroup(d.label) === attachmentGroup(slot.label)
                : d.label === slot.label,
            )
            .map((d) => (
              <article key={d.key} className="mweb-file">
                <DraftImage file={d.file} onPreview={onPreview} />
                <div>
                  <strong>{d.file.name}</strong>
                  <small>
                    {d.state === 'done'
                      ? 'Terunggah; akan dilampirkan saat Simpan'
                      : d.state === 'uploading'
                        ? d.phase === 'processing'
                          ? 'Memproses di server…'
                          : d.progress === null ? 'Mengunggah…' : `Mengunggah ${d.progress}%`
                        : 'Belum diunggah'}
                  </small>
                  {d.state === 'uploading' && (
                    <progress max={100} value={d.progress ?? undefined} />
                  )}{' '}
                  {d.error && <span className="mweb-error">{d.error}</span>}
                </div>
                {!disabled && !readOnly && <>
                  {d.state === 'done' && !inputBlocked && !review && /\.(jpe?g|png|webp)$/i.test(d.file.name) && (
                    <button type="button" className="mweb-btn" onClick={() => {
                      if (!locked.current && !reviewRef.current) showReview([d]);
                    }}>Tinjau ulang</button>
                  )}
                  {d.state === 'error' && !inputBlocked && !review && (
                    <button type="button" className="mweb-btn" onClick={() => retry(d.key)}>Coba lagi</button>
                  )}
                  <button type="button" className="mweb-btn mweb-danger" onClick={() => remove(d.key)}>Hapus</button>
                </>}
              </article>
            ))}
          {!readOnly && (
            <AttachmentControl
              label={slot.label}
              disabled={inputBlocked || !!review}
              error={errors[slot.label]}
              onFiles={(files, errors) => pick(files, slot.label, errors)}
            />
          )}
          {errors[slot.label] && !disabled && !readOnly && <button type="button" className="mweb-btn"
            aria-label={`Tutup pesan lampiran ${slot.label}`} onClick={() => {
              errorRef.current = { ...errorRef.current, [slot.label]: '' };
              setErrors(errorRef.current); reportPending();
            }}>Tutup pesan</button>}
          {readOnly && !slot.files.length && <p className="mweb-muted">Tidak ada lampiran.</p>}
        </section>
      ))}
    </div>
  );
}
