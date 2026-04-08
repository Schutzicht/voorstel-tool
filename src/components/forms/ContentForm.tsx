import type { ProposalData } from '../../types';
import { Label, Textarea } from './FormHelpers';

interface Props {
  data: ProposalData;
  upd: <K extends keyof ProposalData>(key: K, value: ProposalData[K]) => void;
}

export function ContentForm({ data, upd }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <Label>Geleverd door klant (één punt per regel)</Label>
        <Textarea value={data.contentByClient} onChange={v => upd('contentByClient', v)} rows={4}
          placeholder={'Foto- en videomateriaal\nProductfoto\'s'} />
      </div>
      <div>
        <Label>Geleverd door Agensea (één punt per regel)</Label>
        <Textarea value={data.contentByAgensea} onChange={v => upd('contentByAgensea', v)} rows={4}
          placeholder={'Advertentieteksten & CTA\'s\nCopywriting voor pagina\'s'} />
      </div>
    </div>
  );
}
