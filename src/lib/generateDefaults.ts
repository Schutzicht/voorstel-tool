import type { ProposalData } from '../types';
import {
  COMMON_CHALLENGES, COMMON_OPPORTUNITIES, COMMON_GOALS,
  DEFAULT_APPROACHES, SERVICE_CATEGORIES,
} from '../types';

/**
 * Input from the onboarding wizard.
 */
export interface OnboardingInput {
  clientName: string;
  clientLogo: string;
  logoScale: number;
  /** Raw wizard picks (e.g. ['website', 'ads', 'seo']) */
  picks?: string[];
  /** Which SERVICE_CATEGORIES ids are selected (e.g. ['website', 'marketing']) */
  categories: string[];
  /** Specific services selected */
  services: string[];
  /** Which ad platforms: 'Meta Ads' | 'Google Ads' | 'LinkedIn Ads' */
  adPlatforms: string[];
  /** Analytics tools */
  analyticsTools: string[];
  /** Quick-selected goals */
  goals: string[];
  /** Quick-selected challenges */
  challenges: string[];
  /** Quick-selected opportunities */
  opportunities: string[];
  /** Investment items */
  oneTimeItems: ProposalData['oneTimeItems'];
  monthlyItems: ProposalData['monthlyItems'];
}

/**
 * Generates a fully pre-filled ProposalData from onboarding input.
 */
export function generateProposalFromOnboarding(input: OnboardingInput): ProposalData {
  const cats = input.categories;

  // Determine proposal type
  const proposalType = determineProposalType(cats);

  // Determine approach based on primary focus
  const approach = determineApproach(cats);

  // Build ad content only for selected platforms
  const metaAdsContent = input.adPlatforms.includes('Meta Ads')
    ? 'Visual storytelling gericht op jouw doelgroep.\nRetargeting van warme websitebezoekers.\nVergroten van merkbekendheid en engagement.'
    : '';

  const googleAdsContent = input.adPlatforms.includes('Google Ads')
    ? 'Inspelen op actieve zoekintentie (SEA).\nPerformance Max voor maximaal bereik.\nContinue optimalisatie op kosten per lead.'
    : '';

  const linkedinAdsContent = input.adPlatforms.includes('LinkedIn Ads')
    ? 'Thought leadership campagnes voor B2B doelgroep.\nLead generation via LinkedIn formulieren.\nTargeting op functietitel, bedrijfsgrootte en sector.'
    : '';

  // Content verdeling based on services
  const contentByClient = generateClientContent(cats);
  const contentByAgensea = generateAgenseaContent(cats, input.services);

  // Analytics defaults
  const analyticsTools = input.analyticsTools.length > 0
    ? input.analyticsTools
    : determineAnalyticsDefaults(input.adPlatforms);

  return {
    onboardingCompleted: true,
    hiddenSlides: [],
    wizardSelections: {
      picks: input.picks || [],
      adPlatforms: input.adPlatforms,
      analyticsTools: input.analyticsTools,
      challenges: input.challenges,
      opportunities: input.opportunities,
      goals: input.goals,
    },
    clientName: input.clientName,
    clientLogo: input.clientLogo,
    logoScale: input.logoScale,
    proposalType,
    proposalDate: new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }),

    currentSituation: input.challenges.join('\n'),
    opportunities: input.opportunities.join('\n'),

    goals: input.goals.map((text, i) => ({ id: String(i + 1), text })),
    approach,

    adPlatforms: input.adPlatforms,
    metaAdsContent,
    googleAdsContent,
    linkedinAdsContent,

    services: input.services,

    includeAnalytics: analyticsTools.length > 0,
    analyticsTools,

    contentByClient,
    contentByAgensea,

    oneTimeItems: input.oneTimeItems.length > 0
      ? input.oneTimeItems
      : generateDefaultPricing(cats, 'oneTime'),
    monthlyItems: input.monthlyItems.length > 0
      ? input.monthlyItems
      : generateDefaultPricing(cats, 'monthly'),

    customDisclaimer: 'Genoemde prijzen zijn excl. 21% BTW.\nAdvertentiebudget wordt direct aan het platform betaald.\nMaandelijks opzegbaar na de eerste 3 maanden.\nPrijzen zijn geldig tot 30 dagen na dagtekening.',

    ctaText: 'is aan jou',
  };
}

function determineProposalType(cats: string[]): string {
  if (cats.length >= 3) return 'Volledig Digitaal Pakket Voorstel';
  if (cats.length === 2) {
    if (cats.includes('website') && cats.includes('marketing')) return 'Strategie & Implementatie Voorstel';
    if (cats.includes('software')) return 'Software & Applicatie Voorstel';
    return 'Strategie & Implementatie Voorstel';
  }
  const cat = cats[0];
  const match = SERVICE_CATEGORIES.find(c => c.id === cat);
  return match?.proposalType || 'Strategie & Implementatie Voorstel';
}

function determineApproach(cats: string[]) {
  if (cats.length >= 3) return DEFAULT_APPROACHES['Volledig'];
  if (cats.includes('website') && cats.includes('marketing')) return DEFAULT_APPROACHES['Volledig'];
  if (cats.includes('software')) return DEFAULT_APPROACHES['Software'];
  if (cats.includes('website')) return DEFAULT_APPROACHES['Website'];
  if (cats.includes('marketing')) return DEFAULT_APPROACHES['Marketing'];
  return DEFAULT_APPROACHES['Website'];
}

function generateClientContent(cats: string[]): string {
  const lines: string[] = ['Huisstijl elementen en logo\'s', 'Toegang tot benodigde accounts'];
  if (cats.includes('website')) lines.push('Bestaande teksten en beeldmateriaal');
  if (cats.includes('marketing')) lines.push('Bestaand advertentiemateriaal (indien aanwezig)');
  if (cats.includes('software')) lines.push('Beschrijving van huidige werkprocessen');
  if (cats.includes('content')) lines.push('Ruwe content en beeldmateriaal als basis');
  return lines.join('\n');
}

function generateAgenseaContent(cats: string[], services: string[]): string {
  const lines: string[] = [];
  if (cats.includes('website')) lines.push('UX Design en ontwikkeling van het platform');
  if (cats.includes('marketing')) lines.push('Strategisch marketingplan en campagne-inrichting');
  if (cats.includes('software')) lines.push('Technische architectuur en development');
  if (services.includes('Content Creatie')) lines.push('Content creatie en copywriting');
  lines.push('Maandelijkse rapportage en sturing');
  return lines.join('\n');
}

function determineAnalyticsDefaults(adPlatforms: string[]): string[] {
  const tools = ['Google Analytics 4', 'Google Tag Manager'];
  if (adPlatforms.includes('Meta Ads')) tools.push('Meta Pixel');
  return tools;
}

function generateDefaultPricing(cats: string[], type: 'oneTime' | 'monthly'): ProposalData['oneTimeItems'] {
  if (type === 'oneTime') {
    const items: ProposalData['oneTimeItems'] = [];
    if (cats.includes('website')) items.push({ id: '1', description: 'Website Design & Development', typicalPrice: '€ 4.500,-', agenseaPrice: '€ 3.250,-' });
    if (cats.includes('marketing')) items.push({ id: '2', description: 'Strategie & Campagne Setup', typicalPrice: '€ 1.500,-', agenseaPrice: '€ 1.100,-' });
    if (cats.includes('software')) items.push({ id: '3', description: 'Software Analyse & Development', typicalPrice: '€ 6.000,-', agenseaPrice: '€ 4.500,-' });
    if (items.length === 0) items.push({ id: '1', description: 'Strategie & Setup', typicalPrice: '€ 1.250,-', agenseaPrice: '€ 950,-' });
    return items;
  }

  const items: ProposalData['monthlyItems'] = [];
  if (cats.includes('website')) items.push({ id: '1', description: 'Hosting & Support', typicalPrice: '€ 125,-', agenseaPrice: '€ 85,-' });
  if (cats.includes('marketing')) items.push({ id: '2', description: 'Campagne Beheer & Optimalisatie', typicalPrice: '€ 850,-', agenseaPrice: '€ 650,-' });
  if (cats.includes('software')) items.push({ id: '3', description: 'Onderhoud & Doorontwikkeling', typicalPrice: '€ 750,-', agenseaPrice: '€ 550,-' });
  if (items.length === 0) items.push({ id: '1', description: 'Beheer & Optimalisatie', typicalPrice: '€ 850,-', agenseaPrice: '€ 650,-' });
  return items;
}

/**
 * Get relevant challenges/opportunities/goals for given categories.
 */
export function getSuggestionsForCategories(cats: string[]) {
  const merge = (map: Record<string, string[]>) => {
    if (cats.length === 0) return map['general'] || [];
    const seen = new Set<string>();
    const result: string[] = [];
    for (const cat of cats) {
      for (const item of (map[cat] || map['general'] || [])) {
        if (!seen.has(item)) { seen.add(item); result.push(item); }
      }
    }
    return result;
  };

  return {
    challenges: merge(COMMON_CHALLENGES),
    opportunities: merge(COMMON_OPPORTUNITIES),
    goals: merge(COMMON_GOALS),
  };
}
