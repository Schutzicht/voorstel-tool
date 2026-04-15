import { type ReactNode } from 'react';
import type { ProposalData, ProposalSignature } from '../types';
import {
  CoverSlide, AgencySlide, ClientMarqueeSlide, SituatieSlide, AboutTeamSlide, WerkwijzeSlide,
  AdPlatformsSlide, DienstenSlide, AnalyticsSlide, ContentSlide, EenmaligeInvesteringSlide,
  MaandelijksSlide, DisclaimerSlide, CTASlide, MockupsSlide, InvestmentOptionsSlide
} from './slides';
import { DoelSlide, getGoalSlideCount } from './slides/DoelSlide';

export interface SlideEntry {
  key: string;
  label: string;
  node: ReactNode;
}

/**
 * Generates slides dynamically based on data.
 * Skips irrelevant slides based on what was selected.
 */
export function generateSlides(data: ProposalData, signature?: ProposalSignature | null): SlideEntry[] {
  const slides: SlideEntry[] = [
    { key: 'cover', label: 'Cover', node: <CoverSlide data={data} /> },
    { key: 'agency', label: 'Agensea', node: <AgencySlide data={data} /> },
    { key: 'partners', label: 'Klanten', node: <ClientMarqueeSlide data={data} /> },
  ];

  // Situatie — always show if there's content
  if (data.currentSituation || data.opportunities || !data.onboardingCompleted) {
    slides.push({ key: 'situatie', label: 'Situatie', node: <SituatieSlide data={data} /> });
  }

  // Dynamic goal slides
  const goalPageCount = getGoalSlideCount(data);
  for (let p = 0; p < goalPageCount; p++) {
    slides.push({
      key: `doelen-${p}`,
      label: goalPageCount > 1 ? `Doelen ${p + 1}/${goalPageCount}` : 'Doelen',
      node: <DoelSlide data={data} page={p} />,
    });
  }

  slides.push(
    { key: 'team', label: 'Team', node: <AboutTeamSlide data={data} /> },
    { key: 'werkwijze', label: 'Werkwijze', node: <WerkwijzeSlide data={data} /> },
  );

  // Ad Platforms — only if any platform is selected
  const hasAds = data.adPlatforms.length > 0;
  if (hasAds) {
    slides.push({ key: 'adplatforms', label: 'Advertentie Kanalen', node: <AdPlatformsSlide data={data} /> });
  }

  // Diensten — always show if there are services
  if (data.services.length > 0 || !data.onboardingCompleted) {
    slides.push({ key: 'diensten', label: 'Diensten', node: <DienstenSlide data={data} /> });
  }

  // Analytics — only if tools are selected
  if (data.analyticsTools.length > 0) {
    slides.push({ key: 'analytics', label: 'Analytics', node: <AnalyticsSlide data={data} /> });
  }

  // Mockups — only for website/software/webshop types
  const showMockups = data.proposalType.toLowerCase().includes('website')
    || data.proposalType.toLowerCase().includes('software')
    || data.proposalType.toLowerCase().includes('webshop')
    || data.services.some(s => s.toLowerCase().includes('website') || s.toLowerCase().includes('webshop') || s.toLowerCase().includes('software'));
  if (showMockups || !data.onboardingCompleted) {
    slides.push({ key: 'mockups', label: 'Mockups', node: <MockupsSlide data={data} /> });
  }

  slides.push(
    { key: 'content', label: 'Content', node: <ContentSlide data={data} /> },
  );

  // Investering slides — opties-modus vervangt de losse slides.
  // Elke optie krijgt z'n eigen slide zodat A/B ruim ademen.
  if (data.hasInvestmentOptions && data.investmentOptions.length > 0) {
    data.investmentOptions.forEach((_, i) => {
      slides.push({
        key: `investeringopties-${i}`,
        label: `Investering ${String.fromCharCode(65 + i)}`,
        node: <InvestmentOptionsSlide data={data} optionIndex={i} />,
      });
    });
  } else {
    if (data.oneTimeItems.length > 0 || !data.onboardingCompleted) {
      slides.push({ key: 'eenmalig', label: 'Investering (1x)', node: <EenmaligeInvesteringSlide data={data} /> });
    }
    if (data.monthlyItems.length > 0 || !data.onboardingCompleted) {
      slides.push({ key: 'maandelijks', label: 'Investering (mnd)', node: <MaandelijksSlide data={data} /> });
    }
  }

  slides.push(
    { key: 'disclaimer', label: 'Disclaimer', node: <DisclaimerSlide data={data} /> },
    { key: 'cta', label: 'Afsluiting', node: <CTASlide data={data} signature={signature} /> },
  );

  // Filter out manually hidden slides
  const hidden = data.hiddenSlides || [];
  return slides.filter(s => !hidden.includes(s.key));
}
