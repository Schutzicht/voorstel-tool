import { Plus, Trash2 } from 'lucide-react';
import type { InvestmentItem } from '../../types';
import { TextInput } from './FormHelpers';

let _id = Date.now();
function uid() { return String(++_id); }

interface Props {
  items: InvestmentItem[];
  onChange: (items: InvestmentItem[]) => void;
}

export function InvestmentForm({ items, onChange }: Props) {
  const updItem = (id: string, field: keyof InvestmentItem, v: string) =>
    onChange(items.map(i => i.id === id ? { ...i, [field]: v } : i));
  const addItem = () =>
    onChange([...items, { id: uid(), description: '', agenseaPrice: '', typicalPrice: '' }]);
  const removeItem = (id: string) =>
    onChange(items.filter(i => i.id !== id));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr,auto,auto] gap-2 text-[10px] uppercase tracking-widest text-text-secondary font-bold px-1 mb-1">
        <span>Onderdeel</span><span>Prijs</span><span></span>
      </div>
      {items.map(item => (
        <div key={item.id} className="grid grid-cols-[1fr,auto,auto] gap-2 items-center">
          <TextInput value={item.description} onChange={v => updItem(item.id, 'description', v)} placeholder="Omschrijving" />
          <input type="text" value={item.agenseaPrice} onChange={e => updItem(item.id, 'agenseaPrice', e.target.value)} placeholder="€ 0,-" className="w-28 text-sm bg-white border border-warm-grey rounded-xl px-3 py-2.5 outline-none focus:border-indigo text-right font-medium" />
          <button onClick={() => removeItem(item.id)} className="text-text-secondary hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button onClick={addItem} className="flex items-center gap-2 text-indigo text-sm font-semibold hover:opacity-70 transition-opacity">
        <Plus className="w-4 h-4" /> Post toevoegen
      </button>
    </div>
  );
}
