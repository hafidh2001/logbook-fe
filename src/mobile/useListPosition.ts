import { useLayoutEffect, useRef } from 'react';
import { readListMemory, writeListMemory, readListWindow } from './navigation';
/** Read-only owners only. No global scrollRestoration override and no form retention. */
export function useListPosition<T>(owner: string, key: string, actor: string, value: T, enabled: boolean, ready: boolean) {
  const snapshot = useRef<{key: string; value: T; scroll: number} | null>(null);
  if(enabled && ready) snapshot.current={key,value,scroll:snapshot.current?.key===key ? snapshot.current.scroll : 0};
  useLayoutEffect(()=>{
    if(!enabled)return;
    const remember=()=>{if(snapshot.current?.key===key)snapshot.current.scroll=window.scrollY;};
    window.addEventListener('scroll',remember,{passive:true});
    return ()=>{
      window.removeEventListener('scroll',remember);
      const saved=snapshot.current;
      if(saved?.key===key)writeListMemory(owner,key,actor,saved.value,saved.scroll);
    };
  },[owner,key,actor,enabled]);
  useLayoutEffect(()=>{
    if(!enabled || !ready)return;
    const saved=readListMemory<T>(owner,key) ?? readListWindow(actor,window.location.pathname+window.location.search);
    if(saved){window.scrollTo(0,saved.scroll);if(snapshot.current?.key===key)snapshot.current.scroll=saved.scroll;}
  },[owner,key,enabled,ready]);
  return () => {
    const saved=snapshot.current;
    if(enabled && saved?.key===key){saved.scroll=window.scrollY;writeListMemory(owner,key,actor,saved.value,saved.scroll);}
  };
}
