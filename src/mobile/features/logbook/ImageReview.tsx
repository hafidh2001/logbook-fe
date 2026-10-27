import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { clampCrop, FULL_CROP, rotatedSize, type CropRect } from './imageGeometry';
import { decodeImage, transformImage } from './imageTransform';
export function useImageDialog(close: () => void) {
  const root = useRef<HTMLDivElement>(null);
  const latest = useRef(close);
  latest.current = close;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const background = Array.from(document.body.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && !el.contains(root.current),
    );
    const inert = background.map((el) => el.inert);
    background.forEach((el) => {
      el.inert = true;
    });
    root.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        latest.current();
      }
      if (e.key === 'Tab') {
        const items = Array.from(
          root.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled),input:not(:disabled),[tabindex="0"]',
          ) ?? [],
        );
        const first = items[0],
          last = items[items.length - 1];
        if (!first) {
          e.preventDefault();
          return;
        }
        if (
          e.shiftKey &&
          (document.activeElement === first || document.activeElement === root.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (
          !e.shiftKey &&
          (document.activeElement === last || document.activeElement === root.current)
        ) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('keydown', key);
      document.body.style.overflow = overflow;
      background.forEach((el, index) => {
        el.inert = inert[index];
      });
      previous?.focus();
    };
  }, []);
  return root;
}
export type ReviewImage = { key: string; file: File; crop?: CropRect; rotation?: number };
export function ImageReview({
  images,
  onConfirm,
  onCancel,
}: {
  images: ReviewImage[];
  onConfirm: (files: ReviewImage[]) => void;
  onCancel: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [drafts, setDrafts] = useState(() =>
    images.map((image) => ({
      crop: image.crop ?? { ...FULL_CROP },
      rotation: image.rotation ?? 0,
    })),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [size, setSize] = useState({ width: 1, height: 1 });
  const [ready, setReady] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const active = useRef(true);
  const processing = useRef(false);
  const root = useImageDialog(() => {
    if (!processing.current) onCancel();
  });
  const draft = drafts[index];
  const item = images[index];
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setError('');
    decodeImage(item.file)
      .then((image) => {
        if (cancelled) return;
        const next = rotatedSize(image.naturalWidth, image.naturalHeight, draft.rotation);
        const c = canvas.current;
        if (!c) return;
        c.width = next.width;
        c.height = next.height;
        const ctx = c.getContext('2d');
        if (!ctx) throw Error('Canvas tidak tersedia.');
        ctx.translate(next.width / 2, next.height / 2);
        ctx.rotate((draft.rotation * Math.PI) / 180);
        ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
        setSize(next);
        setReady(true);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [item, draft.rotation]);
  function update(patch: Partial<typeof draft>) {
    setDrafts((all) => all.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }
  const drag = useRef<{ id: number; x: number; y: number; crop: CropRect; handle: string } | null>(
    null,
  );
  function start(e: ReactPointerEvent, handle: string) {
    if (!ready || busy) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, crop: draft.crop, handle };
  }
  function move(e: ReactPointerEvent) {
    const d = drag.current;
    const bounds = stage.current?.getBoundingClientRect();
    if (!d || d.id !== e.pointerId || !bounds) return;
    const dx = (e.clientX - d.x) / bounds.width,
      dy = (e.clientY - d.y) / bounds.height;
    const c = d.crop;
    if (d.handle === 'move') {
      update({ crop: clampCrop({ ...c, x: c.x + dx, y: c.y + dy }) });
      return;
    }
    const left = d.handle.endsWith('l')
      ? Math.max(0, Math.min(c.x + c.width - 0.01, c.x + dx))
      : c.x;
    const top = d.handle.startsWith('t')
      ? Math.max(0, Math.min(c.y + c.height - 0.01, c.y + dy))
      : c.y;
    const right = d.handle.endsWith('r')
      ? Math.min(1, Math.max(c.x + 0.01, c.x + c.width + dx))
      : c.x + c.width;
    const bottom = d.handle.startsWith('b')
      ? Math.min(1, Math.max(c.y + 0.01, c.y + c.height + dy))
      : c.y + c.height;
    update({ crop: clampCrop({ x: left, y: top, width: right - left, height: bottom - top }) });
  }
  async function confirm() {
    if (processing.current) return;
    processing.current = true;
    setBusy(true);
    setError('');
    try {
      const result: ReviewImage[] = [];
      for (let i = 0; i < images.length; i++) {
        const d = drafts[i];
        result.push({
          ...images[i],
          crop: d.crop,
          rotation: d.rotation,
          file: await transformImage(images[i].file, d.crop, d.rotation),
        });
      }
      if (active.current) onConfirm(result);
    } catch (e) {
      if (active.current) setError(e instanceof Error ? e.message : 'Ekspor gagal.');
    } finally {
      processing.current = false;
      if (active.current) setBusy(false);
    }
  }
  return createPortal(
    <div className="mweb-image-overlay">
      <div
        ref={root}
        tabIndex={-1}
        className="mweb-image-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Tinjau gambar"
      >
        <h2>
          Tinjau gambar {index + 1} / {images.length}
        </h2>
        <p className="mweb-review-name">{item.file.name}</p>
        <p>
          Geser kotak / sudut untuk crop. Gunakan kontrol angka untuk keyboard. File asli
          dipertahankan sampai konfirmasi seluruh batch.
        </p>
        {error && (
          <p role="alert" className="mweb-error">
            {error}
          </p>
        )}
        <div
          className="mweb-crop-stage"
          ref={stage}
          style={{
            aspectRatio: `${size.width}/${size.height}`,
            width: `min(100%, 560px, ${(45 * size.width) / size.height}dvh)`,
          }}
        >
          <canvas ref={canvas} aria-label="Gambar asli dengan rotasi" />
          {ready && (
            <>
              <div
                className="mweb-crop-selection"
                onPointerDown={(e) => start(e, 'move')}
                onPointerMove={move}
                onPointerUp={() => {
                  drag.current = null;
                }}
                onPointerCancel={() => {
                  drag.current = null;
                }}
                style={{
                  left: `${draft.crop.x * 100}%`,
                  top: `${draft.crop.y * 100}%`,
                  width: `${draft.crop.width * 100}%`,
                  height: `${draft.crop.height * 100}%`,
                }}
              />
              {['tl', 'tr', 'bl', 'br'].map((handle) => (
                <span
                  key={handle}
                  className="mweb-crop-handle"
                  aria-hidden="true"
                  onPointerDown={(e) => start(e, handle)}
                  onPointerMove={move}
                  onPointerUp={() => {
                    drag.current = null;
                  }}
                  onPointerCancel={() => {
                    drag.current = null;
                  }}
                  style={{
                    left: `${(draft.crop.x + (handle.endsWith('r') ? draft.crop.width : 0)) * 100}%`,
                    top: `${(draft.crop.y + (handle.startsWith('b') ? draft.crop.height : 0)) * 100}%`,
                  }}
                />
              ))}
            </>
          )}
        </div>
        <fieldset disabled={busy || !ready} className="mweb-crop-controls">
          <legend>Area crop (%)</legend>
          {(['x', 'y', 'width', 'height'] as const).map((key, i) => (
            <label key={key}>
              {['Kiri', 'Atas', 'Lebar', 'Tinggi'][i]}
              <input
                type="number"
                min={key === 'width' || key === 'height' ? 0.1 : 0}
                max={100}
                step={0.1}
                value={Math.round(draft.crop[key] * 1000) / 10}
                onChange={(e) => {
                  if (e.target.value !== '')
                    update({
                      crop: clampCrop({ ...draft.crop, [key]: Number(e.target.value) / 100 }),
                    });
                }}
              />
            </label>
          ))}
        </fieldset>
        <div className="mweb-row">
          <button
            type="button"
            className="mweb-btn"
            disabled={busy || !ready}
            onClick={() =>
              update({ rotation: (draft.rotation + 90) % 360, crop: { ...FULL_CROP } })
            }
          >
            Putar 90°
          </button>
          <button
            type="button"
            className="mweb-btn"
            disabled={busy}
            onClick={() => update({ crop: { ...FULL_CROP }, rotation: 0 })}
          >
            Reset
          </button>
          <button
            type="button"
            className="mweb-btn"
            disabled={busy || index === 0}
            onClick={() => setIndex((i) => i - 1)}
          >
            Sebelumnya
          </button>
          {index < images.length - 1 ? (
            <button
              type="button"
              className="mweb-btn mweb-primary"
              disabled={busy}
              onClick={() => setIndex((i) => i + 1)}
            >
              Berikutnya
            </button>
          ) : (
            <button
              type="button"
              className="mweb-btn mweb-primary"
              disabled={busy || !ready}
              onClick={confirm}
            >
              {busy ? 'Memproses…' : 'Gunakan semua gambar'}
            </button>
          )}
          <button type="button" className="mweb-btn" disabled={busy} onClick={onCancel}>
            Batal tinjauan
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
