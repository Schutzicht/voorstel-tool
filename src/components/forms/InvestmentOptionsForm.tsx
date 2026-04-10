import { Plus, Trash2 } from 'lucide-react';
import type { InvestmentOption, InvestmentItem } from '../../types';
import { Label, TextInput, Textarea } from './FormHelpers';

let _id = Date.now();
function uid() { return String(++_id); }

interface Props {
  options: InvestmentOption[];
  onChange: (options: InvestmentOption[]) => void;
}

export function InvestmentOptionsForm({ options, onChange }: Props) {
  const updateOption = (id: string, patch: Partial<InvestmentOption>) =>
    onChange(options.map(o => o.id === id ? { ...o, ...patch } : o));

  const addOption = () => {
    const letter = String.fromCharCode(65 + options.length); // A, B, C
    onChange([...options, {
      id: uid(),
      name: `Optie ${letter}`,
      subtitle: '',
      description: '',
      oneTimeItems: [],
      monthlyItems: [],
    }]);
  };

  const removeOption = (id: string) =>
    onChange(options.filter(o => o.id !== id));

  const updItem = (optId: string, listKey: 'oneTimeItems' | 'monthlyItems', itemId: string, field: keyof InvestmentItem, v: string) => {
    onChange(options.map(o => o.id === optId ? {
      ...o,
      [listKey]: o[listKey].map(i => i.id === itemId ? { ...i, [field]: v } : i),
    } : o));
  };

  const addItem = (optId: string, listKey: 'oneTimeItems' | 'monthlyItems') => {
    onChange(options.map(o => o.id === optId ? {
      ...o,
      [listKey]: [...o[listKey], { id: uid(), description: '', agenseaPrice: '', typicalPrice: '' }],
    } : o));
  };

  const removeItem = (optId: string, listKey: 'oneTimeItems' | 'monthlyItems', itemId: string) => {
    onChange(options.map(o => o.id === optId ? {
      ...o,
      [listKey]: o[listKey].filter(i => i.id !== itemId),
    } : o));
  };

  return (
    <div className="space-y-6">
      <p className="text-xs text-text-secondary leading-relaxed">
        Voeg twee (of meer) pakketten toe die de klant kan vergelijken. Bij ondertekenen kiest de klant welke optie hij accepteert.
      </p>

      {options.map((opt, idx) => (
        <div key={opt.id} className="bg-white border border-warm-grey rounded-2xl p-4 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo text-white font-display font-bold text-sm flex items-center justify-center shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <input
                  value={opt.name}
                  onChange={e => updateOption(opt.id, { name: e.target.value })}
                  placeholder="Naam (bijv. Optie A)"
                  className="flex-1 text-sm font-bold bg-transparent border-b border-warm-grey focus:border-indigo outline-none px-1 py-1"
                />
              </div>
            </div>
            <button onClick={() => removeOption(opt.id)} className="text-text-secondary hover:text-red-500 transition-colors" title="Optie verwijderen">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div>
            <Label>Subtitel</Label>
            <TextInput value={opt.subtitle} onChange={v => updateOption(opt.id, { subtitle: v })} placeholder="Bijv. Basis website" />
          </div>

          <div>
            <Label>Toelichting</Label>
            <Textarea value={opt.description} onChange={v => updateOption(opt.id, { description: v })} rows={2} placeholder="Korte uitleg van wat dit pakket bevat..." />
          </div>

          <div>
            <Label>Eenmalig</Label>
            <div className="space-y-2">
              {opt.oneTimeItems.map(item => (
                <div key={item.id} className="grid grid-cols-[1fr,auto,auto] gap-2 items-center">
                  <TextInput value={item.description} onChange={v => updItem(opt.id, 'oneTimeItems', item.id, 'description', v)} placeholder="Omschrijving" />
                  <input type="text" value={item.agenseaPrice} onChange={e => updItem(opt.id, 'oneTimeItems', item.id, 'agenseaPrice', e.target.value)} placeholder="€ 0,-" className="w-24 text-sm bg-white border border-warm-grey rounded-xl px-2 py-2.5 outline-none focus:border-indigo text-right font-medium" />
                  <button onClick={() => removeItem(opt.id, 'oneTimeItems', item.id)} className="text-text-secondary hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={() => addItem(opt.id, 'oneTimeItems')} className="flex items-center gap-1.5 text-indigo text-xs font-semibold hover:opacity-70">
                <Plus className="w-3.5 h-3.5" /> Eenmalige post
              </button>
            </div>
          </div>

          <div>
            <Label>Maandelijks</Label>
            <div className="space-y-2">
              {opt.monthlyItems.map(item => (
                <div key={item.id} className="grid grid-cols-[1fr,auto,auto] gap-2 items-center">
                  <TextInput value={item.description} onChange={v => updItem(opt.id, 'monthlyItems', item.id, 'description', v)} placeholder="Omschrijving" />
                  <input type="text" value={item.agenseaPrice} onChange={e => updItem(opt.id, 'monthlyItems', item.id, 'agenseaPrice', e.target.value)} placeholder="€ 0,-" className="w-24 text-sm bg-white border border-warm-grey rounded-xl px-2 py-2.5 outline-none focus:border-indigo text-right font-medium" />
                  <button onClick={() => removeItem(opt.id, 'monthlyItems', item.id)} className="text-text-secondary hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={() => addItem(opt.id, 'monthlyItems')} className="flex items-center gap-1.5 text-indigo text-xs font-semibold hover:opacity-70">
                <Plus className="w-3.5 h-3.5" /> Maandelijkse post
              </button>
            </div>
          </div>
        </div>
      ))}

      <button onClick={addOption} className="w-full py-2.5 rounded-xl border border-dashed border-indigo/40 text-indigo text-sm font-semibold hover:bg-indigo/5 transition-colors flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> Nog een optie toevoegen
      </button>
    </div>
  );
}
