import type { RefCallback } from 'react';
import './infinite-scroll.css';
export function InfiniteScrollFooter({sentinelRef,loading,error,onLoadMore}:{sentinelRef:RefCallback<HTMLDivElement>;loading:boolean;error?:string;onLoadMore:()=>void}) {
  return <div className="mobile-infinite-footer">
    <div ref={sentinelRef} className="mobile-infinite-sentinel" aria-hidden="true"/>
    {loading ? <p role="status"><span className="mobile-infinite-spinner" aria-hidden="true"/>Memuat lebih banyak…</p> : <>
      {error && <p role="alert">{error}</p>}
      <button type="button" onClick={onLoadMore}>{error ? 'Coba lagi memuat lebih banyak' : 'Muat lebih banyak'}</button>
    </>}
  </div>;
}
