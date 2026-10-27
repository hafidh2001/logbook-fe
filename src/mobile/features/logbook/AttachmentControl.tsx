import { useEffect, useId, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { ACCEPT_FILES } from './attachments';

// Only a nameless/extensionless clipboard File gets a MIME-derived extension.
// An explicit unsupported extension still reaches the ordinary picker validation.
const clipboardExtensions: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
  'application/pdf': 'pdf', 'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
};
export function clipboardFile(file: File): File {
  if (/[\\/\u0000-\u001f\u007f]/.test(file.name))
    throw new Error('Nama file clipboard tidak aman. Gunakan Pilih file.');
  const mime = file.type.toLowerCase();
  const extension = Object.prototype.hasOwnProperty.call(clipboardExtensions, mime)
    ? clipboardExtensions[mime] : undefined;
  if ((!file.name || !file.name.includes('.')) && extension)
    return new File([file], `${file.name.trim() || 'clipboard'}.${extension}`, {
      type: file.type, lastModified: file.lastModified,
    });
  return file;
}
export function transferFiles(data: DataTransfer, clipboard = false) {
  const files: File[] = [];
  const errors: string[] = [];
  const items = Array.from(data.items ?? []).filter(item => item.kind === 'file');
  // Never concatenate files and items: they are two views of the same occurrences.
  const candidates: File[] = [];
  if (items.length) {
    for (const item of items) {
      try {
        if (!clipboard && item.webkitGetAsEntry?.()?.isDirectory) {
          errors.push('Folder tidak didukung. Pilih file di dalam folder.');
          continue;
        }
        const file = item.getAsFile();
        if (file) candidates.push(file);
        else errors.push('File tidak dapat dibaca. Gunakan Pilih file.');
      } catch {
        errors.push('File tidak dapat dibaca. Gunakan Pilih file.');
      }
    }
  } else candidates.push(...Array.from(data.files ?? []));
  for (const file of candidates) {
    try { files.push(clipboard ? clipboardFile(file) : file); }
    catch (e) { errors.push(e instanceof Error ? e.message : 'File tidak dapat dibaca.'); }
  }
  if (!files.length && !errors.length) errors.push('File tidak dapat dibaca. Gunakan Pilih file.');
  return { files, errors };
}
function hasFiles(data: DataTransfer) {
  return Array.from(data.types ?? []).includes('Files') ||
    Array.from(data.items ?? []).some(item => item.kind === 'file') || data.files.length > 0;
}
export function AttachmentControl({ label, disabled, error, onFiles }: {
  label: string;
  disabled: boolean;
  error?: string;
  onFiles: (files: readonly File[], errors?: string[]) => void;
}) {
  const id = useId();
  const picker = useRef<HTMLInputElement>(null);
  const depth = useRef(0);
  const [dragging, setDragging] = useState(false);
  function resetDrag() { depth.current = 0; setDragging(false); }
  useEffect(() => {
    // Cleanup only; never intercept drops elsewhere on the page.
    window.addEventListener('drop', resetDrag);
    window.addEventListener('dragend', resetDrag);
    window.addEventListener('blur', resetDrag);
    return () => {
      window.removeEventListener('drop', resetDrag);
      window.removeEventListener('dragend', resetDrag);
      window.removeEventListener('blur', resetDrag);
    };
  }, []);
  useEffect(() => { if (disabled) resetDrag(); }, [disabled]);
  return (
    <div
      className={`mweb-attachment-dropzone${dragging ? ' is-dragging' : ''}`}
      role="group"
      aria-label={`Tambah lampiran ${label}`}
      aria-describedby={`${id}-hint ${id}-policy ${id}-error`}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={e => {
        if (disabled || e.target !== e.currentTarget || e.repeat) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); picker.current?.click();
        }
      }}
      onDragEnter={e => {
        if (!hasFiles(e.dataTransfer)) return;
        e.preventDefault();
        if (disabled) return;
        depth.current += 1; setDragging(true);
      }}
      onDragOver={e => {
        if (!hasFiles(e.dataTransfer)) return;
        e.preventDefault(); e.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
      }}
      onDragLeave={e => {
        if (!hasFiles(e.dataTransfer) || !depth.current) return;
        e.preventDefault();
        depth.current = Math.max(0, depth.current - 1);
        if (!depth.current) setDragging(false);
      }}
      onDrop={e => {
        resetDrag();
        if (!hasFiles(e.dataTransfer)) return;
        // A rejected file drop inside this zone is also handled: no browser navigation.
        e.preventDefault();
        if (disabled) return;
        const { files, errors } = transferFiles(e.dataTransfer);
        onFiles(files, errors);
      }}
      onPaste={e => {
        if (disabled || !e.currentTarget.contains(document.activeElement)) return;
        const target = e.target;
        if (target instanceof Element && target.closest('input, textarea, [contenteditable]:not([contenteditable="false"])')) return;
        if (!hasFiles(e.clipboardData)) return;
        const { files, errors } = transferFiles(e.clipboardData, true);
        e.preventDefault();
        onFiles(files, errors);
      }}
    >
      <Upload size={24} aria-hidden="true" />
      <p id={`${id}-hint`}>Seret file ke sini, atau pilih file. Fokus di sini lalu Ctrl+V untuk menempel file.</p>
      <div className="mweb-row">
        <label className="mweb-btn">
          Pilih file
          <input ref={picker} type="file" accept={ACCEPT_FILES} multiple disabled={disabled}
            onChange={e => { onFiles(Array.from(e.target.files ?? [])); e.target.value = ''; }} />
        </label>
      </div>
      <p id={`${id}-error`} className="mweb-error" role="alert" aria-live="polite">{error}</p>
      <small id={`${id}-policy`}>Opsional · JPG, PNG, WebP, PDF, Word, Excel, PowerPoint. Maks. per file: 25 MB (anjuran). Batas aktual ditetapkan server. Crop/rotasi hanya diterapkan setelah konfirmasi; tanpa edit, byte asli dipertahankan.</small>
    </div>
  );
}
