import type { ProposalData } from '../../types';
import { Label, Textarea } from './FormHelpers';

interface Props {
  data: ProposalData;
  upd: <K extends keyof ProposalData>(key: K, value: ProposalData[K]) => void;
}

export function AdPlatformsForm({ data, upd }: Props) {
  return (
    <div className="space-y-5">
      {data.adPlatforms.includes('Meta Ads') && (
        <div>
          <Label>Meta Ads Focus (één punt per regel)</Label>
          <Textarea
            value={data.metaAdsContent}
            onChange={v => upd('metaAdsContent', v)}
            rows={4}
            placeholder={'Storytelling & Video\nRetargeting\nLookalike audiences'}
          />
        </div>
      )}
      {data.adPlatforms.includes('Google Ads') && (
        <div>
          <Label>Google Ads Focus (één punt per regel)</Label>
          <Textarea
            value={data.googleAdsContent}
            onChange={v => upd('googleAdsContent', v)}
            rows={4}
            placeholder={'Zoekintentie\nShopping advertenties\nTargeting op categorie'}
          />
        </div>
      )}
      {data.adPlatforms.includes('LinkedIn Ads') && (
        <div>
          <Label>LinkedIn Ads Focus (één punt per regel)</Label>
          <Textarea
            value={data.linkedinAdsContent}
            onChange={v => upd('linkedinAdsContent', v)}
            rows={4}
            placeholder={'Thought leadership\nLead gen formulieren\nB2B targeting'}
          />
        </div>
      )}
    </div>
  );
}
