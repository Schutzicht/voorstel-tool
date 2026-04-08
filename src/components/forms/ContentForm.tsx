import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import type { ProposalData } from '../../types';
import { CLIENT_CONTENT_OPTIONS, AGENSEA_CONTENT_OPTIONS } from '../../types';
import { Label } from './FormHelpers';

interface Props {
  data: ProposalData;
  upd: <K extends keyof ProposalData>(key: K, value: ProposalData[K]) => void;
}

function getOptionsForCategories(optionsMap: Record<string, string[]>, categories: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  // Always include general
  for (const item of optionsMap['general'] || []) {
    if (!seen.has(item)) { seen.add(item); result.push(item); }
  }
  for (const cat of categories) {
    for (const item of optionsMap[cat] || []) {
      if (!seen.has(item)) { seen.add(item); result.push(item); }
    }
  }
  return result;
}

function ContentToggleList({ label, options, selected, onToggle, onAdd, onRemove }: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
}) {
  const [custom, setCustom] = useState('');
  const customItems = selected.filter(s => !options.includes(s));

  const handleAdd = () => {
    const trimmed = custom.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onAdd(trimmed);
      setCustom('');
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map(item => {
          const active = selected.includes(item);
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className={clsx(
                'px-3 py-2 rounded-xl border text-sm font-medium transition-all flex items-center gap-2',
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
        {customItems.map(item => (
          <span key={item} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo/10 text-indigo text-sm font-medium">
            {item}
            <button onClick={() => onRemove(item)} className="hover:text-red-500 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Eigen item toevoegen..."
          className="flex-1 px-3 py-2 rounded-xl border border-warm-grey bg-white text-sm text-dark placeholder:text-muted focus:outline-none focus:border-indigo transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!custom.trim()}
          className="px-3 py-2 rounded-xl border border-indigo bg-indigo text-white text-sm font-medium hover:bg-indigo-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function parseItems(text: string): string[] {
  return text.split('\n').map(s => s.trim()).filter(Boolean);
}

function toText(items: string[]): string {
  return items.join('\n');
}

export function ContentForm({ data, upd }: Props) {
  // Infer categories from wizard selections or services
  const categories = data.wizardSelections?.picks || [];
  const cats: string[] = [];
  if (categories.some(p => ['website', 'webshop'].includes(p)) || data.services.some(s => s.toLowerCase().includes('website') || s.toLowerCase().includes('webshop'))) cats.push('website');
  if (categories.some(p => ['ads', 'seo'].includes(p)) || data.services.some(s => ['SEO', 'Google Ads', 'Meta Ads', 'LinkedIn Ads'].some(k => s.includes(k)))) cats.push('marketing');
  if (categories.some(p => ['software'].includes(p)) || data.services.some(s => s.toLowerCase().includes('software'))) cats.push('software');
  if (categories.some(p => ['content'].includes(p)) || data.services.some(s => s.toLowerCase().includes('content'))) cats.push('content');

  const clientOptions = getOptionsForCategories(CLIENT_CONTENT_OPTIONS, cats);
  const agenseaOptions = getOptionsForCategories(AGENSEA_CONTENT_OPTIONS, cats);

  const clientItems = parseItems(data.contentByClient);
  const agenseaItems = parseItems(data.contentByAgensea);

  const toggleItem = (key: 'contentByClient' | 'contentByAgensea', items: string[], item: string) => {
    const next = items.includes(item) ? items.filter(x => x !== item) : [...items, item];
    upd(key, toText(next));
  };

  return (
    <div className="space-y-6">
      <ContentToggleList
        label={`Geleverd door ${data.clientName || 'klant'}`}
        options={clientOptions}
        selected={clientItems}
        onToggle={item => toggleItem('contentByClient', clientItems, item)}
        onAdd={item => upd('contentByClient', toText([...clientItems, item]))}
        onRemove={item => upd('contentByClient', toText(clientItems.filter(x => x !== item)))}
      />
      <ContentToggleList
        label="Geleverd door Agensea"
        options={agenseaOptions}
        selected={agenseaItems}
        onToggle={item => toggleItem('contentByAgensea', agenseaItems, item)}
        onAdd={item => upd('contentByAgensea', toText([...agenseaItems, item]))}
        onRemove={item => upd('contentByAgensea', toText(agenseaItems.filter(x => x !== item)))}
      />
    </div>
  );
}
