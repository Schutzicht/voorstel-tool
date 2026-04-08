import type { ProposalData } from '../../types';
import { COMMON_CHALLENGES, COMMON_OPPORTUNITIES } from '../../types';
import { Label, Textarea } from './FormHelpers';

interface Props {
  data: ProposalData;
  upd: <K extends keyof ProposalData>(key: K, value: ProposalData[K]) => void;
}

export function SituatieForm({ data, upd }: Props) {
  // Flatten all challenges/opportunities for the quick-select buttons
  const allChallenges = [...new Set(Object.values(COMMON_CHALLENGES).flat())];
  const allOpportunities = [...new Set(Object.values(COMMON_OPPORTUNITIES).flat())];

  return (
    <div className="space-y-5">
      <div>
        <Label>Huidige situatie (één punt per regel)</Label>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {allChallenges.map(c => (
            <button
              key={c}
              onClick={() => {
                const lines = data.currentSituation.split('\n').filter(l => l.trim());
                if (!lines.includes(c)) upd('currentSituation', [...lines, c].join('\n'));
              }}
              className="text-[10px] px-2 py-1 bg-warm-grey/50 hover:bg-indigo/10 hover:text-indigo rounded-md transition-colors"
            >+ {c}</button>
          ))}
        </div>
        <Textarea
          value={data.currentSituation}
          onChange={v => upd('currentSituation', v)}
          rows={4}
          placeholder="Selecteer hierboven of typ zelf..."
        />
      </div>
      <div>
        <Label>Kansen (één punt per regel)</Label>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {allOpportunities.map(o => (
            <button
              key={o}
              onClick={() => {
                const lines = data.opportunities.split('\n').filter(l => l.trim());
                if (!lines.includes(o)) upd('opportunities', [...lines, o].join('\n'));
              }}
              className="text-[10px] px-2 py-1 bg-warm-grey/50 hover:bg-indigo/10 hover:text-indigo rounded-md transition-colors"
            >+ {o}</button>
          ))}
        </div>
        <Textarea
          value={data.opportunities}
          onChange={v => upd('opportunities', v)}
          rows={4}
          placeholder="Selecteer hierboven of typ zelf..."
        />
      </div>
    </div>
  );
}
