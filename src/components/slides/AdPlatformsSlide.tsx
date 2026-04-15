import { type ProposalData } from '../../types';
import { SlideFooter } from './SlideFooter';

interface PlatformConfig {
  name: string;
  logo: string;
  bgColor: string;
  content: string;
}

export function AdPlatformsSlide({ data }: { data: ProposalData }) {
  const platforms: PlatformConfig[] = [];

  if (data.adPlatforms.includes('Meta Ads') && data.metaAdsContent) {
    platforms.push({ name: 'Meta Ads', logo: '/brand-logos/meta.svg', bgColor: '#1877F2', content: data.metaAdsContent });
  }
  if (data.adPlatforms.includes('Google Ads') && data.googleAdsContent) {
    platforms.push({ name: 'Google Ads', logo: '/brand-logos/google.svg', bgColor: '#4285F4', content: data.googleAdsContent });
  }
  if (data.adPlatforms.includes('LinkedIn Ads') && data.linkedinAdsContent) {
    platforms.push({ name: 'LinkedIn Ads', logo: '/brand-logos/linkedin.svg', bgColor: '#0A66C2', content: data.linkedinAdsContent });
  }

  // Grid layout: 2 cols for 2, 3 cols for 3, 1 col for 1
  const gridCols = platforms.length === 3 ? 'grid-cols-3' : platforms.length === 2 ? 'grid-cols-2' : 'grid-cols-1 max-w-[50%] mx-auto';

  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16 overflow-hidden">
      <div className="mesh-blob w-[600px] h-[600px] bg-indigo/10 -top-[10%] -left-[10%]" style={{ animationDelay: '0s' }}></div>
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Adverteren</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none">Kanalen & Focus.</h2>
      </div>

      <div className={`flex-1 grid ${gridCols} gap-8 relative z-10`}>
        {platforms.map((platform, idx) => (
          <div
            key={platform.name}
            className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white shadow-xl flex flex-col reveal"
            style={{ animationDelay: `${0.2 + idx * 0.15}s` }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center p-2" style={{ backgroundColor: `${platform.bgColor}10` }}>
                <img src={platform.logo} alt={platform.name} className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-dark text-2xl">{platform.name.replace(' Ads', '')}</h3>
            </div>
            <ul className="space-y-4 flex-1">
              {platform.content.split('\n').filter(Boolean).map((line, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="text-indigo font-bold mt-1.5">↘</span>
                  <span className={`text-text-primary leading-snug ${platforms.length === 3 ? 'text-base' : 'text-lg'}`}>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <SlideFooter />
    </div>
  );
}
