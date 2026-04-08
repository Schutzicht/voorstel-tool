import { Plus, Trash2 } from 'lucide-react';
import type { ProposalData, ApproachStep } from '../../types';
import { TextInput, Textarea } from './FormHelpers';

let _id = Date.now();
function uid() { return String(++_id); }

interface Props {
  data: ProposalData;
  upd: <K extends keyof ProposalData>(key: K, value: ProposalData[K]) => void;
}

export function WerkwijzeForm({ data, upd }: Props) {
  const updateApproach = (id: string, field: keyof ApproachStep, v: string) =>
    upd('approach', data.approach.map(a => a.id === id ? { ...a, [field]: v } : a));
  const addApproach = () =>
    upd('approach', [...data.approach, { id: uid(), phase: '', description: '' }]);
  const removeApproach = (id: string) =>
    upd('approach', data.approach.filter(a => a.id !== id));

  return (
    <div className="space-y-3">
      {data.approach.map((step, i) => (
        <div key={step.id} className="bg-white rounded-xl p-4 border border-warm-grey space-y-2">
          <div className="flex items-center gap-2 justify-between">
            <div className="w-7 h-7 rounded-full bg-indigo text-white flex items-center justify-center text-xs font-bold font-display shrink-0">{i + 1}</div>
            <TextInput value={step.phase} onChange={v => updateApproach(step.id, 'phase', v)} placeholder="Fase naam" />
            {data.approach.length > 1 && (
              <button onClick={() => removeApproach(step.id)} className="text-text-secondary hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <Textarea
            rows={2}
            value={step.description}
            onChange={v => updateApproach(step.id, 'description', v)}
            placeholder="Beschrijving van deze fase..."
          />
        </div>
      ))}
      <button onClick={addApproach} className="flex items-center gap-2 text-indigo text-sm font-semibold hover:opacity-70 transition-opacity">
        <Plus className="w-4 h-4" /> Fase toevoegen
      </button>
    </div>
  );
}
