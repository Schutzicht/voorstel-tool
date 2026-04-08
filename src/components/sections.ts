import type { ProposalData } from '../types';

export type FormSection = {
  id: string;
  slideLabel: string;
  title: string;
};

const ALL_SECTIONS: FormSection[] = [
  { id: 'cover', slideLabel: 'Cover', title: 'Cover & Klantnaam' },
  { id: 'agency', slideLabel: 'Agensea', title: 'Agency Intro' },
  { id: 'partners', slideLabel: 'Klanten', title: 'Onze Klanten' },
  { id: 'situatie', slideLabel: 'Situatie', title: 'Situatie Analyse' },
  { id: 'doelen', slideLabel: 'Doelen', title: 'Concrete Doelen' },
  { id: 'team', slideLabel: 'Team', title: 'Ons Team' },
  { id: 'werkwijze', slideLabel: 'Werkwijze', title: 'Werkwijze / Aanpak' },
  { id: 'adplatforms', slideLabel: 'Advertenties', title: 'Advertentie Kanalen' },
  { id: 'diensten', slideLabel: 'Diensten', title: 'Diensten & Scope' },
  { id: 'analytics', slideLabel: 'Analytics', title: 'Data & Analytics' },
  { id: 'mockups', slideLabel: 'Mockups', title: 'Visueel Concept' },
  { id: 'content', slideLabel: 'Content', title: 'Content & Samenwerking' },
  { id: 'eenmalig', slideLabel: 'Investering (1x)', title: 'Eenmalige Investering' },
  { id: 'maandelijks', slideLabel: 'Investering (mnd)', title: 'Maandelijkse Investering' },
  { id: 'disclaimer', slideLabel: 'Disclaimer', title: 'Voorwaarden' },
  { id: 'cta', slideLabel: 'Afsluiting', title: 'Afsluiting & CTA' },
];

/**
 * Returns only the editor sections that are relevant for the current data.
 */
export function getSectionsForData(data: ProposalData): FormSection[] {
  if (!data.onboardingCompleted) return ALL_SECTIONS;

  return ALL_SECTIONS.filter(s => {
    switch (s.id) {
      case 'adplatforms': return data.adPlatforms.length > 0;
      case 'analytics': return data.analyticsTools.length > 0;
      case 'mockups': {
        const type = data.proposalType.toLowerCase();
        return type.includes('website') || type.includes('software') || type.includes('webshop')
          || data.services.some(svc => svc.toLowerCase().includes('website') || svc.toLowerCase().includes('webshop') || svc.toLowerCase().includes('software'));
      }
      case 'eenmalig': return data.oneTimeItems.length > 0;
      case 'maandelijks': return data.monthlyItems.length > 0;
      default: return true;
    }
  });
}

/** All sections (for backwards compat) */
export const SECTIONS = ALL_SECTIONS;
