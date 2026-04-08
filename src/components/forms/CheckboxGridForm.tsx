import { Check } from 'lucide-react';
import clsx from 'clsx';
import { Label } from './FormHelpers';

interface Props {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
}

export function CheckboxGridForm({ label, options, selected, onToggle }: Props) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(s => (
          <button
            key={s}
            onClick={() => onToggle(s)}
            className={clsx(
              'text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-2',
              selected.includes(s)
                ? 'border-indigo bg-indigo/5 text-indigo'
                : 'border-warm-grey bg-white text-dark hover:border-indigo'
            )}
          >
            <div className={clsx('w-4 h-4 rounded flex items-center justify-center border shrink-0',
              selected.includes(s) ? 'bg-indigo border-indigo' : 'border-muted')}>
              {selected.includes(s) && <Check className="w-2.5 h-2.5 text-white" />}
            </div>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
