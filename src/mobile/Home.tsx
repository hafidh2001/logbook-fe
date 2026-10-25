import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, GraduationCap, Stethoscope, ChevronRight } from 'lucide-react';
import { mobileRequest } from './api';
import { parseDashboardState, readHomeMenus } from './foundationReads';
import { useMobileSession } from './session';
import TodoSection from './TodoSection';
import { actorKey, captureReturn } from './navigation';
import { useListPosition } from './useListPosition';

type Row = Record<string, any>;
export default function Home() {
  const user = useMobileSession(s => s.user)!;
  const [actions, setActions] = useState<Row[]>([]);
  const [visible, setVisible] = useState<number[] | null>(null);
  const [menuDraft, setMenuDraft] = useState<number[] | null>(null);
  const [menuSaving, setMenuSaving] = useState(false);
  const [error, setError] = useState('');
  const [academicError, setAcademicError] = useState('');
  const [busy, setBusy] = useState(true);
  const [notice, setNotice] = useState('');
  const [academic, setAcademic] = useState<Row>(user);
  const key = `${user.id}:${user.id_client}:${user.id_semester}:${user.role}`;
  const [loadedKey, setLoadedKey] = useState('');
  const generation = useRef(0);
  const currentKey = useRef(key);
  currentKey.current = key;
  const ready = loadedKey === key;
  const location=useLocation();
  const remember=useListPosition('home-menu',`${key}:${location.search}`,actorKey(user),{},true,ready && !busy);
  const loadMenus = useCallback(async () => {
    const token = ++generation.current;
    const current = () => token === generation.current && currentKey.current === key;
    setBusy(true); setError(''); setMenuDraft(null);
    try {
      const menu = await readHomeMenus(user, mobileRequest,current);
      if(current()){setActions(menu.actions);setVisible(menu.visible);setLoadedKey(key);}
    } catch(e) {if(current())setError((e as Error).message);}
    finally {if(current())setBusy(false);}
  }, [key]);
  useEffect(() => {
    setNotice('');setMenuSaving(false);loadMenus();
    return () => {generation.current++;};
  }, [loadMenus]);
  useEffect(() => {
    let live = true, request = 0;
    setAcademic(user);setAcademicError('');
    const refresh = async () => {
      if(user.role !== 'ppds') return;
      const token=++request;setAcademicError('');
      try {
        const result=await mobileRequest('getDashboardMorbiditasState',{id_user:user.id,id_client:user.id_client});
        if(!live || token!==request || currentKey.current!==key) return;
        const data=parseDashboardState(result,user);
        setAcademic(data);
        useMobileSession.getState().updateUser({id_semester:data.id_semester,semester_name:data.semester_name || '',id_stase:data.id_stase,stase_name:data.stase_name || '',total_points:data.total_points});
      } catch(e){if(live && token===request)setAcademicError((e as Error).message);}
    };
    const foreground=()=>{if(document.visibilityState==='visible')void refresh();};
    void refresh();document.addEventListener('visibilitychange',foreground);
    window.addEventListener('mobile:dashboard-refresh',refresh);
    return ()=>{live=false;request++;document.removeEventListener('visibilitychange',foreground);window.removeEventListener('mobile:dashboard-refresh',refresh);};
  }, [key]);
  async function saveMenus() {
    if(menuDraft === null || menuSaving || busy || !ready || error) return;
    const token = generation.current;
    const current = () => currentKey.current === key && generation.current === token;
    setMenuSaving(true);setError('');
    try {
      const result=await mobileRequest('saveMenuConfig',{id_user:String(user.id),id_client:user.id_client,created_by:user.id,id_actions:menuDraft});
      if(result.success !== true) throw new Error(result.message || 'Gagal menyimpan konfigurasi menu.');
      if(!current()) return;
      const saved=await mobileRequest('getMenuConfig',{id_user:String(user.id),id_client:user.id_client});
      if(!Array.isArray(saved.data)) throw new Error('Konfigurasi menu tidak dapat dikonfirmasi.');
      if(current()){setVisible(saved.data.map(Number));setMenuDraft(null);setNotice('Menu berhasil disimpan.');}
    } catch(e){if(current())setError((e as Error).message);} finally{if(current())setMenuSaving(false);}
  }
  const availableMenus = actions.filter(a => Number.isSafeInteger(Number(a.id_action ?? a.id)) && Number(a.id_action ?? a.id)>0 && a.action_name && !['test','testing'].includes(String(a.action_name).trim().toLowerCase()));
  const menus = useMemo(()=>actions.filter(a => Number.isSafeInteger(Number(a.id_action ?? a.id)) && Number(a.id_action ?? a.id)>0 && a.action_name && !['test','testing'].includes(String(a.action_name).trim().toLowerCase()) && (visible === null || visible.length === 0 || visible.includes(Number(a.id_action ?? a.id)))),[actions,visible]);
  return <>
    <section className="mobile-hero">
      <img className="mobile-hero-illustration" src="/mobile/hero-banner-home.svg" alt="" aria-hidden="true" width="112" height="97" />
      <div><p className="mobile-eyebrow">Dashboard</p><h1>{user.display_name}</h1>
        {user.role === 'ppds' && <><p className="mobile-muted">Stase aktif</p><h3>{academic.stase_name || 'Belum tersedia'}</h3>
          <div className="mobile-stats"><div><small>Pendidikan</small><strong>{academic.semester_name || 'Belum tersedia'}</strong></div><div><small>Poin morbiditas</small><strong>{academic.total_points ?? '—'}</strong></div></div></>}
        {user.role === 'staff' && <p>{user.role_name} · {user.client_name}</p>}
      </div>
    </section>
    {academicError && <p className="mobile-error" role="alert">{academicError}<button onClick={()=>window.dispatchEvent(new Event('mobile:dashboard-refresh'))}>Coba lagi</button></p>}
    {error && <div className="mobile-error" role="alert">{error}<button disabled={busy} onClick={loadMenus}>Coba lagi</button></div>}
    {notice && <p role="status" className="mobile-notice">{notice}</p>}
    {user.role === 'staff' && <TodoSection menuActions={menus}/>}
    <section aria-label="Menu" aria-busy={busy || (!ready && !error)}><div className="mobile-section-heading"><h2>Menu</h2><div className="mobile-actions"><button disabled={busy || menuSaving} onClick={loadMenus}>Muat ulang menu</button><button disabled={busy || menuSaving || !ready || !!error || !availableMenus.length} onClick={()=>setMenuDraft(menus.map(a=>Number(a.id_action ?? a.id)))}>Kelola Menu</button></div></div>
      {(busy || (!ready && !error)) && <div className={`mobile-menu-loading${ready ? ' mobile-menu-refreshing' : ''}`} role="status"><span className="mobile-menu-spinner mobile-spinner" aria-hidden="true"/>{ready ? 'Memperbarui menu…' : 'Memuat menu…'}</div>}
      <div className="mobile-menu-grid">{ready && menus.map(a=>{const id=String(a.id_action ?? a.id); const Icon=String(a.action_type_name).toLowerCase()==='academic' ? GraduationCap : String(a.action_type_name).toLowerCase()==='activity' ? Stethoscope : BookOpen;
        return <Link className="mobile-menu-card" key={id} to={`/mobile/logbooks/${id}`} onClick={()=>{remember();captureReturn(user,location);}} state={{menuActionId:id,menuActionName:a.action_name,mobileReturn:captureReturn(user,location)}}><span className="mobile-menu-icon"><Icon size={29}/></span><strong>{a.action_name}</strong><ChevronRight size={17}/></Link>;})}</div>
      {ready && !busy && !error && !menus.length && <div className="mobile-empty"><img src="/mobile/home-empty.svg" alt=""/><p>Menu logbook belum tersedia untuk semester Anda.</p></div>}
    </section>
    {menuDraft !== null && ready && <div className="mobile-modal-backdrop"><section role="dialog" aria-modal="true" aria-labelledby="menu-title" className="mobile-modal"><h2 id="menu-title">Kelola Menu</h2><p>Pilih menu yang ditampilkan. Tanpa pilihan berarti tampilkan semua menu.</p><div className="mobile-menu-options">{availableMenus.map(a=>{const id=Number(a.id_action ?? a.id);return <label key={id}><input type="checkbox" checked={menuDraft.includes(id)} disabled={menuSaving} onChange={e=>setMenuDraft(old=>e.target.checked ? [...(old || []),id] : (old || []).filter(v=>v!==id))}/>{a.action_name}</label>;})}</div><div className="mobile-actions"><button disabled={menuSaving} onClick={()=>setMenuDraft(null)}>Batal</button><button className="mobile-primary" disabled={menuSaving || busy || !ready || !!error} onClick={saveMenus}>{menuSaving ? 'Menyimpan…' : 'Simpan'}</button></div></section></div>}

  </>;
}
