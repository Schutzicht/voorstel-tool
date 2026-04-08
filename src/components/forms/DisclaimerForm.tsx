import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import type { ProposalData } from '../../types';
import { DISCLAIMER_OPTIONS } from '../../types';
import { Label } from './FormHelpers';

interface Props {
  data: ProposalData;
  upd: <K extends keyof ProposalData>(key: K, value: ProposalData[K]) => void;
}

function parseItems(text: string): string[] {
  return text.split('\n').map(s => s.trim()).filter(Boolean);
}

function toText(items: string[]): string {
  return items.join('\n');
}

export function DisclaimerForm({ data, upd }: Props) {
  const [custom, setCustom] = useState('');
  const items = parseItems(data.customDisclaimer);
  const customItems = items.filter(s => !DISCLAIMER_OPTIONS.includes(s));

  const toggle = (item: string) => {
    const next = items.includes(item) ? items.filter(x => x !== item) : [...items, item];
    upd('customDisclaimer', toText(next));
  };

  const handleAdd = () => {
    const trimmed = custom.trim();
    if (trimmed && !items.includes(trimmed)) {
      upd('customDisclaimer', toText([...items, trimmed]));
      setCustom('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Selecteer de voorwaarden voor dit voorstel</Label>
        <div className="space-y-2">
          {DISCLAIMER_OPTIONS.map(item => {
            const active = items.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggle(item)}
                className={clsx(
                  'w-full text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-2',
                  active
                    ? 'border-indigo bg-indigo/5 text-indigo'
                    : 'border-warm-grey bg-white text-dark hover:border-indigo'
                )}
              >
                <div className={clsx('w-4 h-4 rounded flex items-center justify-center border shrink-0',
                  active ? 'bg-indigo border-indigo' : 'border-muted')}>
                  {active && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {customItems.length > 0 && (
        <div className="space-y-2">
          <Label>Eigen voorwaarden</Label>
          <div className="space-y-2">
            {customItems.map(item => (
              <div key={item} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo/5 border border-indigo/20">
                <span className="flex-1 text-sm font-medium text-indigo">{item}</span>
                <button onClick={() => upd('customDisclaimer', toText(items.filter(x => x !== item)))} className="text-indigo/40 hover:text-red-500 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Eigen voorwaarde toevoegen</Label>
        <div className="flex gap-2">
          <input
            type="text"
            value={custom}
            onChange={e => setCustom(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Bijv. betaling in 2 termijnen..."
            className="flex-1 px-3 py-2.5 rounded-xl border border-warm-grey bg-white text-sm text-dark placeholder:text-muted focus:outline-none focus:border-indigo transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={!custom.trim()}
            className="px-3 py-2.5 rounded-xl border border-indigo bg-indigo text-white text-sm font-medium hover:bg-indigo-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
