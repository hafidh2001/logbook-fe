// Local, synthetic-only browser harness; no API or clinical writes.
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Link, useNavigate, useLocation } from 'react-router-dom';
import { installDirtyNavigationGuard } from './dirtyNavigation';
import { createRoot } from 'react-dom/client';
import { AttachmentFields, AttachmentPreview, type UploadDraft } from './AttachmentFields';
import { attachmentGroup, type Attachment } from './attachments';
import './logbook.css';
import LogbookWorkspace from '../LogbookWorkspace';
import { useMobileSession } from '../../session';
import { parseMobileUser } from '../../types';
import '../../mobile.css';
async function canvasChecks() {
  const { transformImage } = await import('./imageTransform');
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 2;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(0, 0, 2, 2);
  ctx.fillStyle = '#0000ff';
  ctx.fillRect(2, 0, 2, 2);
  const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!), 'image/png'));
  const original = new File([blob], 'original.test.png', { type: 'image/png' });
  const same = await transformImage(original, { x: 0, y: 0, width: 1, height: 1 }, 0);
  if (same !== original) throw Error('No-op did not preserve original bytes');
  const out = await transformImage(original, { x: 0, y: 0, width: 0.5, height: 1 }, 90);
  const img = await createImageBitmap(out);
  if (
    img.width !== 1 ||
    img.height !== 4 ||
    out.name !== 'original.test.png' ||
    out.type !== 'image/png'
  )
    throw Error('Wrong rotated crop/type/name');
  const read = document.createElement('canvas');
  read.width = 1;
  read.height = 4;
  read.getContext('2d')!.drawImage(img, 0, 0);
  const pixels = read.getContext('2d')!.getImageData(0, 0, 1, 4).data;
  if (pixels[0] !== 255 || pixels[14] !== 255) throw Error('Incorrect rotated crop pixels');
  img.close();
  const webp = new File([blob], 'original.webp', { type: 'image/webp' });
  const converted = await transformImage(webp, { x: 0, y: 0, width: 0.5, height: 1 }, 0);
  const sig = new Uint8Array(await converted.arrayBuffer());
  if (
    converted.name !== 'original.png' ||
    converted.type !== 'image/png' ||
    sig[0] !== 137 ||
    sig[1] !== 80
  )
    throw Error('Transformed bytes do not match extension');
  const jpeg = await new Promise<Blob>((r) => c.toBlob((b) => r(b!), 'image/jpeg', 1));
  const jpg = await transformImage(
    new File([jpeg], 'photo.jpeg', { type: 'image/jpeg' }),
    { x: 0, y: 0, width: 1, height: 1 },
    90,
  );
  const bytes = new Uint8Array(await jpg.arrayBuffer());
  if (jpg.name !== 'photo.jpg' || jpg.type !== 'image/jpeg' || bytes[0] !== 255 || bytes[1] !== 216)
    throw Error('JPEG mismatch');
  return {
    original,
    checks:
      'PASS: real Canvas no-op identity, rotated crop pixels, PNG/WebP conversion and JPEG signatures',
  };
}
function NavigationFixture() {
  const dirty = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => installDirtyNavigationGuard(dirty), []);
  return (
    <section>
      <button
        type="button"
        onClick={() => {
          dirty.current = true;
        }}
      >
        Mark dirty
      </button>
      <Link to="?destination=global">Global navigation fixture</Link>
      <button type="button" onClick={() => navigate('?destination=button')}>
        Programmatic navigation
      </button>
      <output id="location-output">{location.search}</output>
    </section>
  );
}
function Harness() {
  const [drafts, setDrafts] = useState<UploadDraft[]>([]);
  const [preview, setPreview] = useState('');
  const [status, setStatus] = useState('');
  const inputFixture = new URLSearchParams(location.search).has('inputFixture');
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [retained, setRetained] = useState<Attachment[]>(inputFixture ? [
    { id: 71, occurrenceKey: '71:0', name: 'Before', url_file: 'existing.pdf' },
    { id: 71, occurrenceKey: '71:1', name: 'Before', url_file: 'existing.pdf' },
  ] : []);
  return (
    <main className="mweb-logbook">
      <h1>Synthetic attachment browser fixture</h1>
      <NavigationFixture />
      <button
        onClick={() =>
          canvasChecks()
            .then((r) => setStatus(r.checks))
            .catch((e) => setStatus(`FAIL: ${e.message}`))
        }
      >
        Run real Canvas checks
      </button>
      <output id="canvas-output">{status}</output>
      {inputFixture && <section aria-label="Synthetic input controls">
        <label><input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} />Disabled fixture</label>
        <label><input type="checkbox" checked={readOnly} onChange={e => setReadOnly(e.target.checked)} />Read-only fixture</label>
        <label><input type="checkbox" checked={uploading} onChange={e => setUploading(e.target.checked)} />Uploading fixture</label>
        <textarea aria-label="Outside notes" />
        <output id="retained-output">{JSON.stringify(retained)}</output>
      </section>}
      <AttachmentFields
        action={{ has_attachment: true, attachment_name: inputFixture ? '["Before","After","Dokumen"]' : '["Before","After"]' }}
        retained={retained}
        onRetained={setRetained}
        disabled={disabled}
        readOnly={readOnly}
        drafts={uploading ? drafts.map((d, i) => i === 0 ? { ...d, state: 'uploading' as const } : d) : drafts}
        onDrafts={setDrafts}
        identity={{ id: 1, id_client: 1 }}
        onPreview={setPreview}
      />
      <output id="draft-output">
        {JSON.stringify(
          drafts.map((d) => ({
            key: d.key,
            label: d.label,
            group: attachmentGroup(d.label),
            originalIdentity: d.file === d.original,
            name: d.file.name,
            type: d.file.type,
            size: d.file.size,
            state: d.state,
          })),
        )}
      </output>
      {preview && <AttachmentPreview url={preview} close={() => setPreview('')} />}
    </main>
  );
}
const workspaceFixture = new URLSearchParams(location.search).has('workspaceFixture');
if (workspaceFixture)
  useMobileSession.setState({
    user: parseMobileUser({
      success: true,
      data: { id: 9, id_client: 2, id_role: 3, role_name: 'staff', username: 'synthetic-fixture' },
    }),
    isAuthenticated: true,
  });
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {workspaceFixture ? <LogbookWorkspace actionId="26" mode="list" /> : <Harness />}
    </BrowserRouter>
  </React.StrictMode>,
);
