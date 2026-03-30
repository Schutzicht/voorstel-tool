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
  'Meta Ads (Social)',
  'LinkedIn Ads',
  'Conversie Optimalisatie',
  'Maatwerk Software / AI Tooling',
  'E-mail Marketing',
  'Content Creatie'
];

export const ANALYTICS_OPTIONS = ['Google Analytics 4', 'Google Tag Manager', 'Hotjar', 'Microsoft Clarity', 'Meta Pixel', 'Custom Dashboard'];

export const COMMON_CHALLENGES = [
  'Lage online zichtbaarheid bij de doelgroep',
  'Huidige website is verouderd en traag',
  'Te weinig kwalitatieve leads uit de website',
  'Conversiepercentage blijft achter bij verwachting',
  'Handmatige processen kosten te veel tijd',
  'Geen inzicht in resultaten van advertenties'
];

export const COMMON_OPPORTUNITIES = [
  'Inzetten op intentie-gedreven Google Search',
  'Schaalbare leadgeneratie via Meta & LinkedIn',
  'AI-gedreven tools voor procesautomatisering',
  'Nieuwe branding die vertrouwen en autoriteit uitstraalt',
  'Pijlsnelle tech-stack voor betere SEO posities',
  'Datagedreven sturing op basis van harde KPI\'s'
];

export const COMMON_GOALS = [
  'Directe stijging in kwalitatieve offerte-aanvragen',
  'Dominante positie in Google op relevante zoektermen',
  'Structurele groei in maandelijkse omzet via ads',
  'Professionalisering van de digitale identiteit',
  'Automatisering van klantcommunicatie/boarding',
  'Volledig meetbare marketing funnel'
];

export const DEFAULT_APPROACHES: Record<string, ApproachStep[]> = {
  'Marketing': [
    { id: '1', phase: 'Kennismaking', description: 'Business duik, doelgroep ontleden en transparant voorstel op maat.' },
    { id: '2', phase: 'Strategie', description: 'KPI\'s bepalen, budgetverdeling over kanalen en meetpunten klaarzetten.' },
    { id: '3', phase: 'Lancering', description: 'Pixels plaatsen, ads vormgeven en campagnes live zetten.' },
    { id: '4', phase: 'Optimalisatie', description: 'Dagelijks monitoren, testen en bijsturen voor maximaal resultaat.' }
  ],
  'Website': [
    { id: '1', phase: 'Strategie', description: 'Wireframes, sitemap en bepalen van de gewenste conversiedoelen.' },
    { id: '2', phase: 'Design', description: 'Vormgeving die past bij de identiteit en focus op gebruikerservaring.' },
    { id: '3', phase: 'Development', description: 'Bouwen van een pijlsnel platform op moderne technieken.' },
    { id: '4', phase: 'Lancering', description: 'SEO check, testen en livegang inclusief support na de start.' }
  ],
  'Software': [
    { id: '1', phase: 'Analyse', description: 'Diepgaande verkenning van processen en technische behoeften.' },
    { id: '2', phase: 'Architectuur', description: 'Datamodel en UX design van het platform of de tool.' },
    { id: '3', phase: 'Ontwikkeling', description: 'Agile development van de oplossing in sprints.' },
    { id: '4', phase: 'Implementatie', description: 'Testen, feedback verwerken en uitrol in de organisatie.' }
  ]
};

export function getInitialData(): ProposalData {
  return {
    clientName: '',
    clientLogo: '',
    proposalType: 'Website',
    proposalDate: new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }),
    currentSituation: '',
    opportunities: '',
    goals: [
      { id: '1', text: '' },
      { id: '2', text: '' },
      { id: '3', text: '' }
    ],
    approach: DEFAULT_APPROACHES['Website'],
    services: [],
    includeAnalytics: true,
    analyticsTools: ['Google Analytics 4', 'Google Tag Manager'],
    metaAdsContent: 'Visual storytelling gericht op jouw doelgroep.\nRetargeting van warme websitebezoekers.\nVergroten van merkbekendheid en engagement.',
    googleAdsContent: 'Inspelen op actieve zoekintentie (SEA).\nPerformance Max voor maximaal bereik.\nContinue optimalisatie op kosten per lead.',
    contentByClient: 'Huisstijl elementen en logo\'s\nBestaande teksten en beeldmateriaal\nToegang tot benodigde accounts (indien aanwezig)',
    contentByAgensea: 'Strategisch marketingplan / Design\nInrichting van campagnes of platform\nMaandelijkse rapportage en sturing',
    oneTimeItems: [
      { id: '1', description: 'Strategie & Setup', typicalPrice: '€ 1.250,-', agenseaPrice: '€ 950,-' },
      { id: '2', description: 'Design & Ontwikkeling', typicalPrice: '€ 4.500,-', agenseaPrice: '€ 3.250,-' },
      { id: 'total', description: 'Totaal Eenmalig', typicalPrice: '€ 5.750,-', agenseaPrice: '€ 4.200,-' }
    ],
    monthlyItems: [
      { id: '1', description: 'Beheer & Optimalisatie', typicalPrice: '€ 850,-', agenseaPrice: '€ 650,-' },
      { id: '2', description: 'Hosting & Support', typicalPrice: '€ 125,-', agenseaPrice: '€ 85,-' },
      { id: 'total', description: 'Totaal Maandelijks', typicalPrice: '€ 975,-', agenseaPrice: '€ 735,-' }
    ],
    customDisclaimer: 'Genoemde prijzen zijn excl. 21% BTW.\nAdvertentiebudget wordt direct aan het platform betaald.\nMaandelijks opzegbaar na de eerste 3 maanden.',
    ctaText: 'is aan jou'
  };
}
