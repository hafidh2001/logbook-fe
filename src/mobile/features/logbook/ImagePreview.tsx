import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { clamp } from './imageGeometry';
import { useImageDialog } from './ImageReview';
export function AttachmentPreview({ url, close }: { url: string; close: () => void }) {
  const root = useImageDialog(close);
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const live = useRef(view);
  live.current = view;
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      zoom(e.deltaY < 0 ? 0.25 : -0.25);
    };
    stage.addEventListener('wheel', wheel, { passive: false });
    return () => stage.removeEventListener('wheel', wheel);
  }, []);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const base = useRef<{ view: typeof view; points: { x: number; y: number }[] } | null>(null);
  function resetBase() {
    base.current = { view: live.current, points: Array.from(pointers.current.values()) };
  }
  function zoom(delta: number) {
    setView((v) => ({
      ...v,
      scale: clamp(v.scale + delta, 1, 8),
      ...(v.scale + delta <= 1 ? { x: 0, y: 0 } : {}),
    }));
  }
  return createPortal(
    <div className="mweb-image-overlay">
      <div
        ref={root}
        tabIndex={-1}
        className="mweb-preview-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Pratinjau gambar"
        onKeyDown={(e) => {
          if ((e.target as HTMLElement).tagName === 'INPUT') return;
          const step = 40;
          if (e.key === '+' || e.key === '=') {
            e.preventDefault();
            zoom(0.5);
          }
          if (e.key === '-') {
            e.preventDefault();
            zoom(-0.5);
          }
          if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
            setView((v) => ({
              ...v,
              x: v.x + (e.key === 'ArrowLeft' ? step : e.key === 'ArrowRight' ? -step : 0),
              y: v.y + (e.key === 'ArrowUp' ? step : e.key === 'ArrowDown' ? -step : 0),
            }));
          }
        }}
      >
        <div className="mweb-row">
          <button type="button" className="mweb-btn" onClick={close}>
            Tutup ×
          </button>
          <button
            type="button"
            className="mweb-btn"
            aria-label="Perkecil"
            disabled={view.scale === 1}
            onClick={() => zoom(-0.5)}
          >
            −
          </button>
          <output aria-live="polite">{Math.round(view.scale * 100)}%</output>
          <button
            type="button"
            className="mweb-btn"
            aria-label="Perbesar"
            disabled={view.scale === 8}
            onClick={() => zoom(0.5)}
          >
            ＋
          </button>
          <button
            type="button"
            className="mweb-btn"
            onClick={() => setView({ scale: 1, x: 0, y: 0 })}
          >
            Reset
          </button>
        </div>
        <p>Pinch / roda untuk zoom, geser untuk pan. Keyboard: + / −, tombol panah, Escape.</p>
        <div
          ref={stageRef}
          className="mweb-preview-stage"
          tabIndex={0}
          aria-label="Gambar; gunakan tombol panah untuk menggeser"
          onPointerDown={(e) => {
            e.preventDefault();
            e.currentTarget.setPointerCapture(e.pointerId);
            pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
            resetBase();
          }}
          onPointerMove={(e) => {
            if (!pointers.current.has(e.pointerId) || !base.current) return;
            pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
            const points = Array.from(pointers.current.values());
            const b = base.current;
            const center = (p: { x: number; y: number }[]) => ({
              x: p.reduce((s, v) => s + v.x, 0) / p.length,
              y: p.reduce((s, v) => s + v.y, 0) / p.length,
            });
            const before = center(b.points),
              after = center(points);
            let scale = b.view.scale;
            if (points.length >= 2 && b.points.length >= 2) {
              const distance = (p: typeof points) => Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
              scale = clamp(
                (b.view.scale * distance(points)) / Math.max(1, distance(b.points)),
                1,
                8,
              );
            }
            setView({ scale, x: b.view.x + after.x - before.x, y: b.view.y + after.y - before.y });
          }}
          onPointerUp={(e) => {
            pointers.current.delete(e.pointerId);
            resetBase();
          }}
          onPointerCancel={(e) => {
            pointers.current.delete(e.pointerId);
            resetBase();
          }}
        >
          <img
            src={url}
            alt="Pratinjau lampiran"
            draggable={false}
            style={{ transform: `translate(${view.x}px,${view.y}px) scale(${view.scale})` }}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
