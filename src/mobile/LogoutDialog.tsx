import { useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { LogOut } from 'lucide-react';
import { cancelMobileLogout, confirmMobileLogout, useMobileSession } from './session';
import './logout-dialog.css';

/** One shared confirmation for Header and Profile; auth force-clear never opens it. */
export default function LogoutDialog() {
  const pending = useMobileSession(state => state.pendingLogout);
  const cancel = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  return <Dialog.Root open={!!pending} onOpenChange={open => { if (!open) cancelMobileLogout(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="mobile-logout-overlay"/>
      <Dialog.Content className="mobile-logout-dialog"
        onOpenAutoFocus={event => {
          event.preventDefault();
          trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
          cancel.current?.focus();
        }}
        onCloseAutoFocus={event => {
          event.preventDefault();
          if (trigger.current?.isConnected) trigger.current.focus();
          trigger.current = null;
        }}>
        <div className="mobile-logout-icon" aria-hidden="true"><LogOut size={26} strokeWidth={1.8}/></div>
        <Dialog.Title className="mobile-logout-title">Keluar dari akun?</Dialog.Title>
        <Dialog.Description className="mobile-logout-description">
          Anda akan keluar dari sesi ini. Silakan masuk kembali untuk melanjutkan aktivitas di Logbook.
          {pending?.hasUnsavedChanges && <span className="mobile-logout-warning">Perubahan yang belum disimpan akan hilang jika Anda keluar.</span>}
        </Dialog.Description>
        <div className="mobile-logout-actions">
          <button type="button" ref={cancel} onClick={cancelMobileLogout}>Batal</button>
          <button type="button" className="mobile-logout-confirm" onClick={confirmMobileLogout}>Ya, keluar</button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
