import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronRight, LogOut, ShieldCheck, UserRoundPen } from 'lucide-react';
import { requestMobileLogout, useMobileSession } from '../../session';
import { mobileRequest } from '../../api';
import { auditScreenVisit } from '../../useNavigationAudit';
import { profileOverview, type Actor, type Row } from './contracts';
import { Frame, Info, State, messageOf } from './shared';
import './profile.css';

export function Profile({user}: {user:Actor}) {
  const updateUser=useMobileSession(state=>state.updateUser);
  const [view,setView]=useState<'overview'|'edit'|'password'>('overview'),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const [form,setForm]=useState<Row>({display_name:user.display_name || '',code:user.code || '',email:user.email || '',phone:user.phone || '',address:user.address || '',date_of_birth:String(user.date_of_birth || '').slice(0,10)});
  const [password,setPassword]=useState({old:'',next:'',confirm:''});
  useEffect(()=>{auditScreenVisit(view==='edit'?'profile/edit-profile':view==='password'?'profile/change-password':'profile/overview');},[view,user.id,user.id_client]);
  const lock=useRef(false),identity=`${user.id}:${user.id_client}`;
  const latest=useRef(identity);latest.current=identity;
  const generation=useRef(0);
  useEffect(()=>{generation.current++;setBusy(false);setError('');lock.current=false;return()=>{generation.current++;};},[identity,view]);
  const run=async(operation:()=>Promise<void>)=>{if(lock.current)return;lock.current=true;setBusy(true);setError('');setNotice('');const started=identity,version=generation.current;try{await operation();}catch(e){if(latest.current===started && version===generation.current)setError(messageOf(e));}finally{if(latest.current===started && version===generation.current){lock.current=false;setBusy(false);}}};
  const refresh=async()=>{
    const started=generation.current;
    const body=await mobileRequest('getProfile',{id_user:user.id,created_by:user.id,id_client:user.id_client});
    const row=body.data;
    if(body.success!==true || !row || Number(row.id)!==user.id || Number(row.id_client)!==user.id_client)throw new Error('Identitas profil tidak sesuai sesi.');
    if(started!==generation.current || useMobileSession.getState().user?.id!==user.id || useMobileSession.getState().user?.id_client!==user.id_client)return;
    const allowed=profileOverview(user,row);
    updateUser(allowed);setNotice('Profil diperbarui dari server.');
  };
  const save=()=>void run(async()=>{
    if(!String(form.display_name).trim())throw new Error('Nama lengkap wajib diisi.');
    const result=await mobileRequest('editProfile',{id:user.id,display_name:String(form.display_name).trim(),code:form.code,email:form.email,phone:form.phone,date_of_birth:form.date_of_birth ? new Date(`${form.date_of_birth}T00:00:00`).toISOString():null,address:form.address});
    if(result.success!==true || !result.data || Number(result.data.id)!==user.id || Number(result.data.id_client)!==user.id_client)throw new Error('Server belum mengonfirmasi identitas profil tersimpan. Refresh profil sebelum mengulang.');
    await refresh();
    // Preserve the real session role/tenant; only allow edited profile fields back.
    if(useMobileSession.getState().user?.id===user.id && useMobileSession.getState().user?.id_client===user.id_client) {
      updateUser(Object.fromEntries(['display_name','code','email','phone','date_of_birth','address'].filter(key=>key in result.data).map(key=>[key,result.data[key]])));
      setView('overview');setNotice('Profil berhasil diperbarui dan dimuat ulang.');
    }
  });
  const changePassword=()=>void run(async()=>{
    if(!password.old || !password.next)throw new Error('Isi password lama dan password baru.');
    if(password.next.length<5)throw new Error('Password baru minimal 5 karakter.');
    if(password.next!==password.confirm)throw new Error('Password baru dan konfirmasi tidak cocok.');
    const result=await mobileRequest('changePassword',{id:user.id,ID:user.id,username:user.username,old_password:password.old,new_password:password.next,confirm_password:password.confirm,password_lama:password.old,password_baru:password.next,konfirmasi_password:password.confirm});
    if(result.success!==true)throw new Error('Server belum mengonfirmasi perubahan password.');
    setPassword({old:'',next:'',confirm:''});setView('overview');setNotice('Password berhasil diubah.');
  });
  const switchView=(next:typeof view)=>{setError('');setNotice('');setPassword({old:'',next:'',confirm:''});setView(next);};
  return <div className="mweb-profile"><Frame title={view==='edit'?'Edit Profile':view==='password'?'Ubah Password':'Profil Pengguna'} actions={view==='overview'?<button onClick={()=>void run(refresh)} disabled={busy}>Refresh profil</button>:<button disabled={busy} onClick={()=>switchView('overview')}><ArrowLeft size={18} aria-hidden="true"/>Kembali</button>}>
    <State error={error} retry={view==='overview'?()=>void run(refresh):undefined}/>{notice && <p className="mweb-extras-success" role="status">{notice}</p>}
    {view==='overview' ? <div className="mweb-extras-columns mweb-profile-columns">
      <article className="mweb-extras-card mweb-profile-summary" aria-label="Identitas pengguna">
        <span className="mweb-extras-eyebrow">Profil Pengguna</span>
        <div className="mweb-profile-identity">
          <span className="mweb-extras-avatar" aria-hidden="true">{String(user.display_name || user.username || '?').split(' ').slice(0,2).map(s=>s[0]).join('').toUpperCase()}</span>
          <div className="mweb-profile-person"><h2>{user.display_name}</h2><span className="mweb-profile-role">{user.role_name}</span><p className="mweb-profile-organization">{String(user.client_name || '—')}</p></div>
        </div>
        <Info items={[
          ['Username',user.username],['Code / NIM',user.code],...(String(user.role_name).toLowerCase()==='ppds' ? [['Semester',user.semester_name],['Stase',user.stase_name]] as Array<[string,unknown]> : []),
        ]}/>
      </article>
      <article className="mweb-extras-card mweb-profile-settings">
        <span className="mweb-extras-eyebrow">Pengaturan Akun</span><h2>Kelola profil dan keamanan</h2><p>Perbarui informasi akun dan password Anda.</p>
        <div className="mweb-profile-menu">
          <button className="mweb-profile-setting" onClick={()=>{setForm({display_name:user.display_name || '',code:user.code || '',email:user.email || '',phone:user.phone || '',address:user.address || '',date_of_birth:String(user.date_of_birth || '').slice(0,10)});switchView('edit');}}><span className="mweb-profile-setting-icon"><UserRoundPen size={20} aria-hidden="true"/></span><span className="mweb-profile-setting-copy"><strong>Edit Profile</strong><small>Perbarui informasi pribadi</small></span><ChevronRight className="mweb-profile-chevron" size={20} aria-hidden="true"/></button>
          <button className="mweb-profile-setting" onClick={()=>switchView('password')}><span className="mweb-profile-setting-icon"><ShieldCheck size={20} aria-hidden="true"/></span><span className="mweb-profile-setting-copy"><strong>Ubah Password</strong><small>Jaga keamanan akun Anda</small></span><ChevronRight className="mweb-profile-chevron" size={20} aria-hidden="true"/></button>
        </div>
        <div className="mweb-profile-logout"><button className="mweb-extras-danger mweb-extras-full" disabled={busy} onClick={requestMobileLogout}><LogOut size={18} aria-hidden="true"/>Logout</button></div>
      </article>
    </div>
    : view==='edit' ? <form className="mweb-extras-card" onSubmit={e=>{e.preventDefault();save();}}><h2>Informasi dasar</h2><fieldset disabled={busy}><div className="mweb-extras-form-grid">{[['display_name','Nama Lengkap','text'],['email','Email','email'],['phone','Nomor Telepon / HP','tel'],['code','Code','text'],['date_of_birth','Tanggal Lahir','date']].map(([key,label,type])=><label key={key} className="mweb-extras-field">{label}<input type={type} value={form[key]} required={key==='display_name'} onChange={e=>setForm(current=>({...current,[key]:e.target.value}))}/></label>)}<label className="mweb-extras-field mweb-extras-full">Alamat<textarea value={form.address} onChange={e=>setForm(current=>({...current,address:e.target.value}))}/></label></div><button className="mweb-extras-primary" type="submit">{busy?'Menyimpan…':'Simpan'}</button></fieldset></form>
    : <form className="mweb-extras-card" onSubmit={e=>{e.preventDefault();changePassword();}}><h2>Perbarui password akunmu</h2><p>Gunakan password yang kuat agar akun tetap aman dan terlindungi.</p><fieldset disabled={busy}><div className="mweb-extras-form-grid">{[['old','Password lama','current-password'],['next','Password baru','new-password'],['confirm','Konfirmasi password','new-password']].map(([key,label,autocomplete])=><label key={key} className="mweb-extras-field">{label}<input type="password" required autoComplete={autocomplete} minLength={key==='old'?undefined:5} value={password[key as keyof typeof password]} onChange={e=>setPassword(current=>({...current,[key]:e.target.value}))}/></label>)}</div><button type="submit" className="mweb-extras-primary">{busy?'Menyimpan…':'Ubah Password'}</button></fieldset></form>}
  </Frame></div>;
}
