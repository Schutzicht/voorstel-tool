import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import { SERVICES_OPTIONS } from '../../types';
import { Label } from './FormHelpers';

interface Props {
  services: string[];
  onToggle: (item: string) => void;
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
}

export function DienstenForm({ services, onToggle, onAdd, onRemove }: Props) {
  const [custom, setCustom] = useState('');

  const customServices = services.filter(s => !SERVICES_OPTIONS.includes(s));

  const handleAdd = () => {
    const trimmed = custom.trim();
    if (trimmed && !services.includes(trimmed)) {
      onAdd(trimmed);
      setCustom('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Selecteer de diensten voor dit voorstel</Label>
        <div className="grid grid-cols-2 gap-2">
          {SERVICES_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => onToggle(s)}
              className={clsx(
                'text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-2',
                services.includes(s)
                  ? 'border-indigo bg-indigo/5 text-indigo'
                  : 'border-warm-grey bg-white text-dark hover:border-indigo'
              )}
            >
              <div className={clsx('w-4 h-4 rounded flex items-center justify-center border shrink-0',
                services.includes(s) ? 'bg-indigo border-indigo' : 'border-muted')}>
                {services.includes(s) && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              {s}
            </button>
          ))}
        </div>
      </div>

      {customServices.length > 0 && (
        <div className="space-y-2">
          <Label>Eigen diensten</Label>
          <div className="flex flex-wrap gap-2">
            {customServices.map(s => (
              <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo/10 text-indigo text-sm font-medium">
                {s}
                <button onClick={() => onRemove(s)} className="hover:text-red-500 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Eigen dienst toevoegen</Label>
        <div className="flex gap-2">
          <input
            type="text"
            value={custom}
            onChange={e => setCustom(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Bijv. boekingsmodule, chatbot, dashboard..."
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
