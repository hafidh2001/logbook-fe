export type NavigationActor = {id: number; id_client: number; role?: unknown; role_name?: unknown; id_role?: unknown};
export type ReturnContext = {actor: string; from: string; key: string; index: number; session: string; savedList?: ListWindow};
export type ListWindow = {actor: string; session: string; from: string; page: number; scroll: number};
const entries = new Map<number, ReturnContext>();
let scope = '';
let session = '';
const SESSION_KEY='mediclink.mobile.navigation.session';
export const navigationSessionKey=()=>session;
export const actorKey = (user: NavigationActor) => `${user.id_client}:${user.id}:${String(user.role ?? '')}:${String(user.role_name ?? '')}:${String(user.id_role ?? '')}`;
export function setNavigationScope(next: string) {
  if (scope !== next || !next) {
    scope = next; entries.clear(); lists.clear();
    let previous: {actor?:string;token?:string}={};
    try{previous=JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}');}catch{/* unavailable storage */}
    session=next ? previous.actor===next && previous.token ? previous.token : globalThis.crypto?.randomUUID?.() ?? `${Date.now()}:${Math.random()}` : '';
    try{if(next)sessionStorage.setItem(SESSION_KEY,JSON.stringify({actor:next,token:session}));else sessionStorage.removeItem(SESSION_KEY);}catch{/* in-memory isolation still applies */}
  }
}
/** Return destinations are navigation hints, never authorization or read-only grants. */
export function safeReturn(from: unknown, current: string): string | null {
  if (typeof from !== 'string' || !from.startsWith('/mobile') || /[\\#\r\n]/.test(from)) return null;
  const url = new URL(from, 'https://mobile.invalid');
  if (url.origin !== 'https://mobile.invalid' || url.pathname + url.search !== from) return null;
  const normal = current.match(/^\/mobile\/logbooks\/(\d+)(?:\/\d+(?:\/edit)?|\/create)?$/);
  const explore = current.match(/^\/mobile\/explore\/(\d+)\/logbooks\/(\d+)(?:\/\d+)?$/);
  const path = url.pathname;
  if (explore) return (path === `/mobile/explore/${explore[1]}` || path === `/mobile/explore/${explore[1]}/logbooks/${explore[2]}`) ? from : null;
  if (/^\/mobile\/explore\/[1-9]\d*$/.test(current)) return path==='/mobile/explore' && !url.search ? from : null;
  if(current==='/mobile/milestone')return path==='/mobile/milestone' && !url.searchParams.has('record') && !url.searchParams.has('edit') ? from : null;
  if (!normal) return null;
  if (path === '/mobile' || path === '/mobile/todo' || path === '/mobile/notifications' || path === '/mobile/milestone') return from;
  if (path === `/mobile/logbooks/${normal[1]}`) return from;
  // An Edit form may return only to its own saved Detail, not another record.
  if (current.endsWith('/edit') && path === current.slice(0,-5) && !url.search) return from;
  return null;
}
export function captureReturn(user: NavigationActor, location: {pathname: string; search: string; key: string}): ReturnContext {
  const context: ReturnContext = {actor: actorKey(user), from: location.pathname + location.search, key: location.key, index: Number(window.history.state?.idx ?? -1),session,savedList:readListWindow(actorKey(user),location.pathname+location.search)};
  if (context.actor === scope) {
    entries.set(context.index, context);
    if(entries.size>16)entries.delete(entries.keys().next().value!);
  }
  return context;
}
export function returnDestination(context: unknown, user: NavigationActor, current: string): string | null {
  const c = context as ReturnContext | undefined;
  return c?.actor === actorKey(user) && c.session===session ? safeReturn(c.from, current) : null;
}
export function canPopReturn(context: ReturnContext | undefined, user: NavigationActor, current: string, index: number): boolean {
  const known = context && entries.get(context.index);
  return !!(returnDestination(context,user,current) && known && known.actor === context!.actor && known.key === context!.key && known.from === context!.from && context!.index >= 0 && index === context!.index + 1);
}
// One in-memory read-only snapshot per owner; never persist clinical rows or forms.
const lists = new Map<string, {scope: string; key: string; value: unknown; scroll: number}>();
export function readListMemory<T>(owner: string, key: string): {value: T; scroll: number} | undefined {
  const entry = lists.get(owner);
  return entry?.scope === scope && entry.key === key ? {value: entry.value as T, scroll: entry.scroll} : undefined;
}
export function writeListMemory<T>(owner: string, key: string, actor: string, value: T, scroll: number) {
  if (actor === scope) lists.set(owner, {scope, key, value, scroll});
}
export function forgetListMemory(owner: string) { lists.delete(owner); }
export function readListWindow(actor: string, from: string): ListWindow | undefined {
  const w=window.history.state?.usr?.readonlyList;
  return w?.actor===actor && w.session===session && w.from===from && Number.isSafeInteger(w.page) && w.page>0 && w.page<=100 && Number.isFinite(w.scroll) && w.scroll>=0 ? w : undefined;
}
export function saveListWindow(actor: string, from: string, page: number, scroll: number) {
  if(actor!==scope)return;
  window.history.replaceState({...window.history.state,usr:{...window.history.state?.usr,readonlyList:{actor,session,from,page,scroll}}},'');
}
