import { Plus } from 'lucide-react';

/** List-only Create affordance; the owner retains authorization and navigation. */
export default function FloatingAddButton({title, onClick}: {title: string; onClick: () => void}) {
  return <button type="button" className="mweb-floating-add" aria-label="Tambah" title={title} onClick={onClick}><Plus size={24} aria-hidden="true"/></button>;
}
