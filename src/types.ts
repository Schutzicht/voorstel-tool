export interface ProposalData {
  // Slide 1 - Cover
  clientName: string;
  clientLogo: string; // base64 data URL
  proposalType: string;
  proposalDate: string;

  // Slide 2 - Agency intro (pre-filled, always Agensea)
  // Slide 3 - Situatie analyse
  currentSituation: string;
  opportunities: string;

  // Slide 4 - Concrete doelen
  goals: GoalItem[];

  // Slide 5 - Werkwijze / Aanpak
  approach: ApproachStep[];

  // Slide 6 - Ad Platforms
  metaAdsContent: string;
  googleAdsContent: string;

  // Slide 7 - Diensten
  services: string[];

  // Slide 8 - Data & Analytics
  includeAnalytics: boolean;
  analyticsTools: string[];

  // Slide 9 - Content / Contentbeheer
  contentByClient: string;
  contentByAgensea: string;

  // Slide 10 - Eenmalige investering
  oneTimeItems: InvestmentItem[];

  // Slide 11 - Maandelijkse investering
  monthlyItems: InvestmentItem[];

  // Slide 12 - Disclaimer
  customDisclaimer: string;

  // Slide 13 - CTA / Afsluiting
  ctaText: string;
}

export interface GoalItem {
  id: string;
  text: string;
}

export interface ApproachStep {
  id: string;
  phase: string;
  description: string;
}

export interface InvestmentItem {
  id: string;
  description: string;
  agenseaPrice: string;
  typicalPrice: string;
}

export const PROPOSAL_TYPES = [
  'Strategie & Implementatie Voorstel',
  'Website Voorstel',
  'Webshop / E-commerce Voorstel',
  'Online Marketing Voorstel',
  'Software & Applicatie Voorstel',
  'AI & Automatisering Voorstel',
  'Volledig Digitaal Pakket Voorstel',
];

export const SERVICES_OPTIONS = [
  'Maatwerk Website',
  'Webshop ontwikkeling',
  'UX & Webdesign',
  'SEO Optimalisatie',
  'Google Ads (SEA)',
  'Meta Ads (Facebook/Instagram)',
  'LinkedIn Advertising',
  'Content Creatie',
  'Social Media Beheer',
  'Maatwerk Software / Applicatie',
  'AI & Automatisering',
  'Analytics & Tracking Setup',
  'Branding & Huisstijl',
  'Copywriting',
];

export const ANALYTICS_OPTIONS = [
  'Google Analytics 4',
  'Google Search Console',
  'Google Tag Manager',
  'Meta Pixel',
  'LinkedIn Insight Tag',
  'Looker Studio Dashboard',
  'Conversie Tracking',
  'Heatmaps (Hotjar)',
];

export function getInitialData(): ProposalData {
  return {
    clientName: '',
    clientLogo: '',
    proposalType: 'Strategie & Implementatie Voorstel',
    proposalDate: new Date().toLocaleDateString('nl-NL'),

    currentSituation: '',
    opportunities: '',

    goals: [
      { id: '1', text: '' },
      { id: '2', text: '' },
      { id: '3', text: '' },
    ],

    approach: [
      { id: '1', phase: 'Audit & Strategie', description: 'We analyseren de huidige situatie en stellen een concrete strategie op.' },
      { id: '2', phase: 'Design & Ontwikkeling', description: 'We ontwerpen en bouwen de oplossing pixel-perfect.' },
      { id: '3', phase: 'Lancering & Optimalisatie', description: 'We lanceren live en optimaliseren op basis van data.' },
      { id: '4', phase: 'Groei & Opschalen', description: 'We groeien mee en schalen de oplossing waar nodig op.' },
    ],

    metaAdsContent: 'Focus op storytelling & video\nRetargeting van shop bezoekers\nLookalike doelgroepen op basis van kopers',
    googleAdsContent: 'Focus op actieve zoekintentie\nShopping advertenties voor golfgear\nSearch campagnes op merknaam & categorieen',

    services: ['Maatwerk Website', 'SEO Optimalisatie'],

    includeAnalytics: true,
    analyticsTools: ['Google Analytics 4', 'Google Tag Manager', 'Meta Pixel'],

    contentByClient: 'Foto- en videomateriaal\nProductfoto\'s en testimonials',
    contentByAgensea: 'Advertentieteksten & CTA\'s\nCopywriting voor de pagina\'s',

    oneTimeItems: [
      { id: '1', description: 'Website / Webshop ontwikkeling', agenseaPrice: '€0', typicalPrice: '€2.500 - €5.000' },
      { id: '2', description: 'Design & UX', agenseaPrice: 'Inbegrepen', typicalPrice: '€750 - €1.500' },
      { id: '3', description: 'Totaal', agenseaPrice: '€1.150', typicalPrice: '€3.500+' },
    ],

    monthlyItems: [
      { id: '1', description: 'SEA (Google Ads) beheer', agenseaPrice: 'Inbegrepen', typicalPrice: '€300/mnd' },
      { id: '2', description: 'SEO rapportage', agenseaPrice: 'Inbegrepen', typicalPrice: '€150/mnd' },
      { id: '3', description: 'Totaal managementfee', agenseaPrice: '€1.000/mnd', typicalPrice: '€1.500+/mnd' },
    ],

    customDisclaimer: 'Alle genoemde bedragen zijn exclusief BTW.\nAdvertentiebudget is niet inbegrepen en wordt apart afgesproken.\nOpzegtermijn van 2 maanden van toepassing.\nNa afloop van de overeenkomst is het platform eigendom van de klant.',

    ctaText: 'is aan jou',
  };
}
