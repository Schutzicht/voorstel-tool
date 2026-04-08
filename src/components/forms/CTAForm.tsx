import type { ProposalData } from '../../types';
import { Label, TextInput } from './FormHelpers';

interface Props {
  data: ProposalData;
  upd: <K extends keyof ProposalData>(key: K, value: ProposalData[K]) => void;
}

export function CTAForm({ data, upd }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <Label>CTA tagline (na de bedrijfsnaam)</Label>
        <TextInput value={data.ctaText} onChange={v => upd('ctaText', v)} placeholder="is aan jou" />
        <p className="text-xs text-text-secondary mt-1.5">
          Wordt: "<strong>{data.clientName || 'De Next Play'}</strong> {data.ctaText || 'is aan jou'}"
        </p>
      </div>
    </div>
  );
}
