import { useCallback, useEffect, useRef, useState } from 'react';

type Options = { enabled: boolean; loading: boolean; scopeKey: string; progressKey: string | number; restored?: boolean; onLoadMore: () => void | Promise<void> };
/** Native onEndReached(0.4), using pixels (IntersectionObserver rejects vh).
 * Owners retain API, cancellation, deduplication and authoritative end semantics.
 * At most three automatic fills without a scroll; manual fallback remains usable.
 */
export function useInfiniteScroll(options: Options) {
  const latest=useRef(options);latest.current=options;
  const [node,setNode]=useState<HTMLDivElement|null>(null);
  const [margin,setMargin]=useState(()=>Math.round(window.innerHeight*0.4));
  const [movement,setMovement]=useState(0);
  const flight=useRef<symbol|null>(null),budget=useRef(0),alive=useRef(true);
  const scope=useRef(options.scopeKey);
  const awaitingInteraction=useRef(!!options.restored);
  if(scope.current!==options.scopeKey){scope.current=options.scopeKey;flight.current=null;budget.current=0;awaitingInteraction.current=false;}
  const loadMore=useCallback(async()=>{
    const current=latest.current;
    if(!alive.current || !current.enabled || current.loading || flight.current)return;
    if(typeof document!=='undefined' && (document.visibilityState==='hidden' || document.querySelector('[aria-modal="true"]')))return;
    const token=Symbol();flight.current=token;
    try{await current.onLoadMore();}finally{if(flight.current===token)flight.current=null;}
  },[]);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;flight.current=null;};},[]);
  useEffect(()=>{
    let frame=0;
    const resize=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>setMargin(Math.round(window.innerHeight*0.4)));};
    const scroll=()=>{if(latest.current.enabled && !latest.current.loading)setMovement(n=>n+1);};
    const interact=()=>{budget.current=0;awaitingInteraction.current=false;scroll();};
    window.addEventListener('resize',resize);window.addEventListener('scroll',scroll,{passive:true});
    window.addEventListener('wheel',interact,{passive:true});window.addEventListener('touchmove',interact,{passive:true});window.addEventListener('keydown',interact);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);window.removeEventListener('scroll',scroll);window.removeEventListener('wheel',interact);window.removeEventListener('touchmove',interact);window.removeEventListener('keydown',interact);};
  },[]);
  useEffect(()=>{
    if(!node || !options.enabled || options.loading || typeof IntersectionObserver==='undefined')return;
    const key=options.scopeKey;
    let active=true;
    const observer=new IntersectionObserver(entries=>{
      if(!active || awaitingInteraction.current || latest.current.scopeKey!==key || !entries.some(e=>e.isIntersecting) || budget.current>=3)return;
      if(latest.current.enabled && !latest.current.loading && !flight.current){budget.current++;void loadMore();}
    },{root:null,rootMargin:`0px 0px ${margin}px 0px`,threshold:0});
    observer.observe(node);
    return()=>{active=false;observer.disconnect();};
  },[node,options.enabled,options.loading,options.scopeKey,options.progressKey,margin,movement,loadMore]);
  return {sentinelRef:setNode,loadMore};
}
