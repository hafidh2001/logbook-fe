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
}) {
  const [review, setReview] = useState<UploadDraft[] | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inputBlocked = disabled || readOnly || drafts.some(d => d.state === 'uploading');
  const controller = useRef(new AbortController());
  const current = useRef(drafts);
  current.current = drafts;
  useEffect(() => {
    const c = new AbortController();
    controller.current = c;
    setReview(null);
    setErrors({});
    const cancel = () => {
      c.abort();
      setReview(null);
    };
    window.addEventListener('mobile:session-cleared', cancel);
    return () => {
      c.abort();
      window.removeEventListener('mobile:session-cleared', cancel);
    };
  }, [identity.id, identity.id_client]);
  function change(key: string, patch: Partial<UploadDraft>) {
    const next = current.current.map((d) => (d.key === key ? { ...d, ...patch } : d));
    current.current = next;
    onDrafts?.(next);
  }
  async function upload(draft: UploadDraft) {
    if (inputBlocked || review || controller.current.signal.aborted) return;
    change(draft.key, { state: 'uploading', error: undefined, progress: 0 });
    try {
      const uploaded = await uploadAttachment(
        draft.file,
        draft.label,
        identity,
        (v) => change(draft.key, { progress: v }),
        controller.current.signal,
      );
      change(draft.key, { state: 'done', uploaded });
    } catch (e) {
      change(draft.key, {
        state: 'error',
        error: e instanceof Error ? e.message : 'Upload gagal.',
      });
    }
  }
  function append(valid: UploadDraft[]) {
    const updated = new Map(valid.map((d) => [d.key, d]));
    const existing = new Set(current.current.map((d) => d.key));
    const next = [
      ...current.current.map((d) => updated.get(d.key) ?? d),
      ...valid.filter((d) => !existing.has(d.key)),
    ];
    current.current = next;
    onDrafts?.(next);
  }
  function commitReview(files: ReviewImage[]) {
    if (!review || inputBlocked || controller.current.signal.aborted) return;
    const outputs = new Map(files.map((file) => [file.key, file]));
    const next: UploadDraft[] = review.flatMap((d) => {
      const output = outputs.get(d.key);
      if (/\.(jpe?g|png|webp)$/i.test(d.file.name) && !output) return [];
      return [
        {
          ...d,
          file: output?.file ?? d.file,
          edit:
            output?.crop && output.rotation !== undefined
              ? { crop: output.crop, rotation: output.rotation }
              : d.edit,
          state: 'ready' as const,
          uploaded: undefined,
          progress: 0,
        },
      ];
    });
    append(next);
    setReview(null);
  }
  function pick(files: readonly File[], label: string, sourceErrors: string[] = []) {
    if (inputBlocked || review || controller.current.signal.aborted) return;
    const valid: UploadDraft[] = [];
    const errors: string[] = [...sourceErrors];
    for (const file of Array.from(files)) {
      try {
        validateFile(file);
        valid.push({
          key: crypto.randomUUID(),
          file,
          original: file,
          label,
          state: 'ready',
          progress: 0,
        });
      } catch (e) {
        errors.push(`${file.name}: ${e instanceof Error ? e.message : 'File tidak valid.'}`);
      }
    }
    if (valid.some((d) => /\.(jpe?g|png|webp)$/i.test(d.file.name))) setReview(valid);
    else append(valid);
    setErrors(previous => ({ ...previous, [label]: errors.join('\n') }));
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
          onCancel={() => setReview(null)}
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
                        ? d.progress === null
                          ? 'Memproses di server…'
                          : `Mengunggah ${d.progress}%`
                        : 'Belum diunggah'}
                  </small>
                  {d.state === 'uploading' && (
                    <progress max={100} value={d.progress ?? undefined} />
                  )}{' '}
                  {d.error && <span className="mweb-error">{d.error}</span>}
                </div>
                {d.state !== 'uploading' && !inputBlocked && !review && (
                  <>
                    {/\.(jpe?g|png|webp)$/i.test(d.file.name) && (
                      <button type="button" className="mweb-btn" onClick={() => setReview([d])}>
                        Tinjau ulang
                      </button>
                    )}
                    <button type="button" className="mweb-btn" onClick={() => upload(d)}>
                      {d.state === 'error'
                        ? 'Coba lagi'
                        : d.state === 'done'
                          ? 'Unggah ulang'
                          : 'Unggah'}
                    </button>
                    <button
                      type="button"
                      className="mweb-btn mweb-danger"
                      onClick={() => {
                        const next = current.current.filter((f) => f.key !== d.key);
                        current.current = next;
                        onDrafts?.(next);
                      }}
                    >
                      Hapus
                    </button>
                  </>
                )}
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
          {readOnly && !slot.files.length && <p className="mweb-muted">Tidak ada lampiran.</p>}
        </section>
      ))}
    </div>
  );
}
