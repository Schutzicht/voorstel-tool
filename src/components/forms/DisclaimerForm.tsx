import type { ProposalData } from '../../types';
import { Label, Textarea } from './FormHelpers';

interface Props {
  data: ProposalData;
  upd: <K extends keyof ProposalData>(key: K, value: ProposalData[K]) => void;
}

export function DisclaimerForm({ data, upd }: Props) {
  return (
    <div>
      <Label>Voorwaarden (één punt per regel)</Label>
      <Textarea value={data.customDisclaimer} onChange={v => upd('customDisclaimer', v)} rows={8}
        placeholder={'Alle bedragen exclusief BTW\nAdvertentiebudget is extra\nOpzegtermijn 2 maanden'} />
    </div>
  );
}
