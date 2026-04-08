import { Plus, Trash2 } from 'lucide-react';
import type { ProposalData } from '../../types';
import { COMMON_GOALS } from '../../types';
import { Label, TextInput } from './FormHelpers';

let _id = Date.now();
function uid() { return String(++_id); }

interface Props {
  data: ProposalData;
  upd: <K extends keyof ProposalData>(key: K, value: ProposalData[K]) => void;
}

export function DoelenForm({ data, upd }: Props) {
  const allGoals = [...new Set(Object.values(COMMON_GOALS).flat())];

  const updateGoal = (id: string, text: string) =>
    upd('goals', data.goals.map(g => g.id === id ? { ...g, text } : g));
  const removeGoal = (id: string) =>
    upd('goals', data.goals.filter(g => g.id !== id));
  const addGoal = () => upd('goals', [...data.goals, { id: uid(), text: '' }]);

  return (
    <div className="space-y-3 font-sans">
      <div className="mb-4">
        <Label>Snel toevoegen</Label>
        <div className="flex flex-wrap gap-1.5">
          {allGoals.map(goal => (
            <button
              key={goal}
              onClick={() => {
                const emptyIndex = data.goals.findIndex(g => !g.text.trim());
                if (emptyIndex !== -1) {
                  updateGoal(data.goals[emptyIndex].id, goal);
                } else {
                  upd('goals', [...data.goals, { id: uid(), text: goal }]);
                }
              }}
              className="text-[10px] px-2 py-1 bg-warm-grey/50 hover:bg-indigo/10 hover:text-indigo rounded-md transition-colors"
            >+ {goal}</button>
          ))}
        </div>
      </div>
      {data.goals.map((g, i) => (
        <div key={g.id} className="flex gap-2 items-start">
          <span className="font-display font-bold text-indigo/60 text-xl leading-none mt-3 w-6 shrink-0 text-right">
            {(i + 1).toString().padStart(2, '0')}
          </span>
          <div className="flex-1">
            <TextInput
              value={g.text}
              onChange={v => updateGoal(g.id, v)}
              placeholder={`Doel ${i + 1}, bijv. MVP live binnen 8 weken`}
            />
          </div>
          {data.goals.length > 1 && (
            <button onClick={() => removeGoal(g.id)} className="mt-2 text-text-secondary hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addGoal}
        className="flex items-center gap-2 text-indigo text-sm font-semibold hover:opacity-70 transition-opacity mt-2"
      >
        <Plus className="w-4 h-4" /> Doel toevoegen
      </button>
    </div>
  );
}
