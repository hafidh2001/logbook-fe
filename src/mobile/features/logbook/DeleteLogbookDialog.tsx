import { useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Trash2 } from 'lucide-react';
import '../../logout-dialog.css';

/** Same portal, focus and medical-green visual language as LogoutDialog. */
export default function DeleteLogbookDialog({open,busy,error,onCancel,onConfirm}:{
  open:boolean;busy:boolean;error?:string;onCancel:()=>void;onConfirm:()=>void;
}) {
  const cancel=useRef<HTMLButtonElement>(null);
  const trigger=useRef<HTMLElement|null>(null);
  return <Dialog.Root open={open} onOpenChange={next=>{if(!next&&!busy)onCancel();}}>
    <Dialog.Portal>
      <Dialog.Overlay className="mobile-logout-overlay"/>
      <Dialog.Content className="mobile-logout-dialog" aria-busy={busy}
        onOpenAutoFocus={event=>{
          event.preventDefault();
          trigger.current=document.activeElement instanceof HTMLElement?document.activeElement:null;
          cancel.current?.focus();
        }}
        onCloseAutoFocus={event=>{
          event.preventDefault();
          if(trigger.current?.isConnected)trigger.current.focus();
          trigger.current=null;
        }}
        onEscapeKeyDown={event=>{if(busy)event.preventDefault();}}
        onPointerDownOutside={event=>{if(busy)event.preventDefault();}}
        onInteractOutside={event=>{if(busy)event.preventDefault();}}>
        <div className="mobile-logout-icon" aria-hidden="true"><Trash2 size={26} strokeWidth={1.8}/></div>
        <Dialog.Title className="mobile-logout-title">Hapus logbook?</Dialog.Title>
        <Dialog.Description className="mobile-logout-description">Logbook yang dihapus tidak dapat dikembalikan.</Dialog.Description>
        {error&&<p role="alert" className="mobile-logout-warning">{error}</p>}
        <div className="mobile-logout-actions">
          <button type="button" ref={cancel} disabled={busy} onClick={onCancel}>Batal</button>
          <button type="button" className="mobile-logout-confirm" disabled={busy} onClick={onConfirm}>{busy?'Memproses...':'Hapus'}</button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
