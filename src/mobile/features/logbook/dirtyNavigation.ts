const MESSAGE = 'Perubahan belum disimpan. Keluar dari form?';
type NavigationEvents = {
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
};
/** No history patch/rollback or router internals. Native cancellation happens before a transition. */
export function installDirtyNavigationGuard(dirty: { current: boolean }) {
  const navigation = (window as Window & { navigation?: NavigationEvents }).navigation;
  const approve = () => {
    if (!dirty.current) return true;
    if (!window.confirm(MESSAGE)) return false;
    dirty.current = false;
    return true;
  };
  const navigate: EventListener = (e) => {
    if (dirty.current && e.cancelable && !approve()) e.preventDefault();
  };
  const unload = (e: BeforeUnloadEvent) => {
    if (dirty.current) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  const link = (e: MouseEvent) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
    if (!a || a.hasAttribute('download') || a.target === '_blank') return;
    if (!approve()) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  };
  const sessionCleared = () => { dirty.current = false; };
  const beforeLogout: EventListener = (event) => {
    if (dirty.current) (event as Event & { hasUnsavedChanges: boolean }).hasUnsavedChanges = true;
  };
  window.addEventListener('mobile:before-logout', beforeLogout);
  window.addEventListener('mobile:session-cleared', sessionCleared);
  navigation?.addEventListener('navigate', navigate);
  window.addEventListener('beforeunload', unload);
  document.addEventListener('click', link, true);
  return () => {
    window.removeEventListener('mobile:before-logout', beforeLogout);
    window.removeEventListener('mobile:session-cleared', sessionCleared);
    navigation?.removeEventListener('navigate', navigate);
    window.removeEventListener('beforeunload', unload);
    document.removeEventListener('click', link, true);
  };
}
