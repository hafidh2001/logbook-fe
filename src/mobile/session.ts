import { create } from 'zustand';
import { actorKey, setNavigationScope } from './navigation';
import { clearMobileRequests, mobileRequest } from './api';
import { MobileUser, parseMobileUser } from './types';
const KEY = 'mediclink.mobile.session.v1';
function readSession(): MobileUser | null {
  try { return parseMobileUser(JSON.parse(sessionStorage.getItem(KEY) || 'null')); } catch { return null; }
}
interface LogoutIntent {
  userId: MobileUser['id'];
  clientId: MobileUser['id_client'];
  hasUnsavedChanges: boolean;
}
interface MobileSession {
  pendingLogout: LogoutIntent | null;
  user: MobileUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<MobileUser>) => void;
}
export const useMobileSession = create<MobileSession>((set, get) => ({
  user: readSession(), isAuthenticated: !!readSession(), pendingLogout: null,
  login: async (username, password) => {
    get().logout();
    const payload = await mobileRequest('login', { username, password });
    const user = parseMobileUser(payload);
    if (!user) throw new Error('Role tidak diizinkan atau respons login mobile tidak valid.');
    sessionStorage.setItem(KEY, JSON.stringify({ success: true, data: user }));
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    clearMobileRequests();
    sessionStorage.removeItem(KEY);
    set({ user: null, isAuthenticated: false, pendingLogout: null });
    window.dispatchEvent(new Event('mobile:session-cleared'));
  },
  updateUser: data => {
    const current = get().user;
    if (!current) return;
    // Profile refresh cannot change authenticated identity, client or permissions.
    const user = parseMobileUser({success: true, data: {...current, ...data, id: current.id, id_client: current.id_client, role_name: current.role_name, id_role: current.id_role}});
    if (!user) return;
    sessionStorage.setItem(KEY, JSON.stringify({success: true, data: user}));
    set({user});
  },
}));
// Dismiss stale intents synchronously, including externally replaced identities.
useMobileSession.subscribe((state) => {
  setNavigationScope(state.user ? actorKey(state.user) : '');
  const pending = state.pendingLogout;
  if (pending && (!state.isAuthenticated || state.user?.id !== pending.userId || state.user.id_client !== pending.clientId)) {
    useMobileSession.setState({ pendingLogout: null });
  }
});
/** Returns request acceptance, NOT confirmation. Only the dialog may confirm. */
export function requestMobileLogout(): boolean {
  const { user, isAuthenticated, pendingLogout } = useMobileSession.getState();
  if (!user || !isAuthenticated) return false;
  if (pendingLogout) return true;
  const intent = Object.assign(new Event('mobile:before-logout', { cancelable: true }), { hasUnsavedChanges: false });
  if (!window.dispatchEvent(intent)) return false;
  // An event listener may have replaced/cleared the session.
  if (useMobileSession.getState().user !== user) return false;
  useMobileSession.setState({ pendingLogout: { userId: user.id, clientId: user.id_client, hasUnsavedChanges: intent.hasUnsavedChanges } });
  return true;
}
export function cancelMobileLogout(): void {
  useMobileSession.setState({ pendingLogout: null });
}
export function confirmMobileLogout(): boolean {
  const { user, isAuthenticated, pendingLogout, logout } = useMobileSession.getState();
  if (!pendingLogout) return false;
  cancelMobileLogout(); // Consume before logout: same-tick repeated acceptance is inert.
  if (!isAuthenticated || user?.id !== pendingLogout.userId || user.id_client !== pendingLogout.clientId) return false;
  logout();
  return true;
}
window.addEventListener('mobile:unauthorized', () => useMobileSession.getState().logout());
