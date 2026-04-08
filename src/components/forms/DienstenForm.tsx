import { useState } from 'react';
import { Check, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { SERVICES_OPTIONS, SERVICE_DESCRIPTIONS } from '../../types';
import { Label } from './FormHelpers';

interface Props {
  services: string[];
  serviceDescriptions: Record<string, string>;
  onToggle: (item: string) => void;
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  onDescriptionChange: (service: string, description: string) => void;
}

export function DienstenForm({ services, serviceDescriptions, onToggle, onAdd, onRemove, onDescriptionChange }: Props) {
  const [custom, setCustom] = useState('');
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);

  const customServices = services.filter(s => !SERVICES_OPTIONS.includes(s));

  const handleAdd = () => {
    const trimmed = custom.trim();
    if (trimmed && !services.includes(trimmed)) {
      onAdd(trimmed);
      setExpandedDesc(trimmed);
      setCustom('');
    }
  };

  const getDescription = (s: string) => serviceDescriptions[s] ?? SERVICE_DESCRIPTIONS[s] ?? '';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Selecteer de diensten voor dit voorstel</Label>
        <div className="grid grid-cols-2 gap-2">
          {SERVICES_OPTIONS.map(s => {
            const active = services.includes(s);
            return (
              <div key={s}>
                <button
                  onClick={() => onToggle(s)}
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
                  <span className="flex-1">{s}</span>
                  {active && (
                    <span
                      onClick={e => { e.stopPropagation(); setExpandedDesc(expandedDesc === s ? null : s); }}
                      className="text-indigo/50 hover:text-indigo transition-colors"
                    >
                      {expandedDesc === s ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </span>
                  )}
                </button>
                {active && expandedDesc === s && (
                  <textarea
                    value={getDescription(s)}
                    onChange={e => onDescriptionChange(s, e.target.value)}
                    placeholder="Toelichting voor op de slide..."
                    rows={2}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-indigo/20 bg-indigo/5 text-sm text-dark placeholder:text-muted focus:outline-none focus:border-indigo transition-colors resize-none"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {customServices.length > 0 && (
        <div className="space-y-2">
          <Label>Eigen diensten</Label>
          <div className="space-y-2">
            {customServices.map(s => (
              <div key={s} className="bg-indigo/5 border border-indigo/20 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex-1 text-sm font-medium text-indigo">{s}</span>
                  <button onClick={() => onRemove(s)} className="text-indigo/40 hover:text-red-500 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  value={getDescription(s)}
                  onChange={e => onDescriptionChange(s, e.target.value)}
                  placeholder="Toelichting voor op de slide..."
                  rows={2}
                  className="w-full mt-2 px-3 py-2 rounded-lg border border-indigo/20 bg-white text-sm text-dark placeholder:text-muted focus:outline-none focus:border-indigo transition-colors resize-none"
                />
              </div>
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
