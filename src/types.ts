export interface WizardSelections {
  picks: string[];         // e.g. ['website', 'ads', 'seo']
  adPlatforms: string[];   // e.g. ['Meta Ads', 'Google Ads']
  analyticsTools: string[];
  challenges: string[];
  opportunities: string[];
  goals: string[];
}

export interface ProposalData {
  // Meta
  onboardingCompleted: boolean;
  wizardSelections?: WizardSelections;
  hiddenSlides: string[];  // slide keys to hide (e.g. ['analytics', 'mockups'])

  // Client info
  clientName: string;
  clientLogo: string;
  logoScale: number;
  proposalType: string;
  proposalDate: string;

  // Situatie analyse
  currentSituation: string;
  opportunities: string;

  // Concrete doelen
  goals: GoalItem[];

  // Werkwijze / Aanpak
  approach: ApproachStep[];

  // Ad Platforms (which ones are active)
  adPlatforms: string[];
  metaAdsContent: string;
  googleAdsContent: string;
  linkedinAdsContent: string;

  // Diensten
  services: string[];

  // Data & Analytics
  includeAnalytics: boolean;
  analyticsTools: string[];

  // Content / Contentbeheer
  contentByClient: string;
  contentByAgensea: string;

  // Eenmalige investering
  oneTimeItems: InvestmentItem[];

  // Maandelijkse investering
  monthlyItems: InvestmentItem[];

  // Disclaimer
  customDisclaimer: string;

  // CTA / Afsluiting
  ctaText: string;
}

export interface SavedProposal {
  id: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  data: ProposalData;
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

// ── Ad platform options ─────────────────────────────────────────────────────
export const AD_PLATFORMS = ['Meta Ads', 'Google Ads', 'LinkedIn Ads'] as const;

// ── Service categories for onboarding ───────────────────────────────────────
export const SERVICE_CATEGORIES = [
  {
    id: 'website',
    label: 'Website / Webshop',
    description: 'Maatwerk website, webshop of landing pages',
    services: ['Maatwerk Website', 'Webshop ontwikkeling', 'UX & Webdesign'],
    proposalType: 'Website Voorstel',
  },
  {
    id: 'marketing',
    label: 'Online Marketing',
    description: 'Advertenties, SEO en conversie optimalisatie',
    services: ['SEO Optimalisatie', 'Google Ads (SEA)', 'Meta Ads (Social)', 'LinkedIn Ads', 'Conversie Optimalisatie', 'E-mail Marketing'],
    proposalType: 'Online Marketing Voorstel',
  },
  {
    id: 'software',
    label: 'Software / AI Tooling',
    description: 'Maatwerk applicaties, automatisering of AI tools',
    services: ['Maatwerk Software / AI Tooling'],
    proposalType: 'Software & Applicatie Voorstel',
  },
  {
    id: 'content',
    label: 'Content Creatie',
    description: 'Foto, video, copywriting en social content',
    services: ['Content Creatie'],
    proposalType: 'Strategie & Implementatie Voorstel',
  },
] as const;

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

export const ANALYTICS_OPTIONS = ['Google Analytics 4', 'Google Tag Manager', 'Google Search Console', 'Google My Business', 'Hotjar', 'Microsoft Clarity', 'Meta Pixel', 'Custom Dashboard'];

export const COMMON_CHALLENGES: Record<string, string[]> = {
  website: [
    'Nog geen professionele website aanwezig',
    'Huidige website is verouderd en traag',
    'Geen mobiel-geoptimaliseerde ervaring',
    'Conversiepercentage blijft achter bij verwachting',
    'Website straalt niet het juiste vertrouwen uit',
    'Geen duidelijke online vindbaarheid',
    'Mist een duidelijke call-to-action en conversieflow',
  ],
  marketing: [
    'Lage online zichtbaarheid bij de doelgroep',
    'Te weinig kwalitatieve leads uit online kanalen',
    'Geen inzicht in resultaten van advertenties',
    'Hoge kosten per acquisitie zonder sturing',
    'Geen structurele marketingstrategie aanwezig',
  ],
  software: [
    'Handmatige processen kosten te veel tijd',
    'Bestaande tools sluiten niet aan op de workflow',
    'Data is verspreid over meerdere systemen',
    'Schaalprobleem: groei wordt geremd door technologie',
  ],
  general: [
    'Lage online zichtbaarheid bij de doelgroep',
    'Nog geen professionele website aanwezig',
    'Huidige website is verouderd en traag',
    'Te weinig kwalitatieve leads uit de website',
    'Conversiepercentage blijft achter bij verwachting',
    'Handmatige processen kosten te veel tijd',
    'Geen inzicht in resultaten van advertenties',
  ],
};

export const COMMON_OPPORTUNITIES: Record<string, string[]> = {
  website: [
    'Professionele online aanwezigheid vanaf dag één',
    'Nieuwe branding die vertrouwen en autoriteit uitstraalt',
    'Pijlsnelle tech-stack voor betere SEO posities',
    'Conversie-geoptimaliseerde user journeys',
    'Schaalbaar platform dat meegroeit met de business',
    'Direct vindbaar in Google voor relevante zoektermen',
  ],
  marketing: [
    'Inzetten op intentie-gedreven Google Search',
    'Schaalbare leadgeneratie via Meta & LinkedIn',
    'Datagedreven sturing op basis van harde KPI\'s',
    'Retargeting van warme bezoekers voor hogere conversie',
  ],
  software: [
    'AI-gedreven tools voor procesautomatisering',
    'Centraal platform dat alle data samenbrengt',
    'Tijdsbesparing van 10+ uur per week door automatisering',
    'Schaalbare oplossing die medewerkers ontzorgt',
  ],
  general: [
    'Professionele online aanwezigheid vanaf dag één',
    'Inzetten op intentie-gedreven Google Search',
    'Schaalbare leadgeneratie via Meta & LinkedIn',
    'AI-gedreven tools voor procesautomatisering',
    'Nieuwe branding die vertrouwen en autoriteit uitstraalt',
    'Pijlsnelle tech-stack voor betere SEO posities',
    'Datagedreven sturing op basis van harde KPI\'s',
  ],
};

export const COMMON_GOALS: Record<string, string[]> = {
  website: [
    'Professionalisering van de digitale identiteit',
    'Directe stijging in kwalitatieve offerte-aanvragen',
    'Snellere laadtijd en hogere Google-ranking',
  ],
  marketing: [
    'Structurele groei in maandelijkse omzet via ads',
    'Dominante positie in Google op relevante zoektermen',
    'Volledig meetbare marketing funnel',
  ],
  software: [
    'Automatisering van klantcommunicatie/boarding',
    'Minimaal 10 uur tijdsbesparing per week',
    'Eén centraal systeem voor het hele team',
  ],
  general: [
    'Directe stijging in kwalitatieve offerte-aanvragen',
    'Dominante positie in Google op relevante zoektermen',
    'Structurele groei in maandelijkse omzet via ads',
    'Professionalisering van de digitale identiteit',
    'Automatisering van klantcommunicatie/boarding',
    'Volledig meetbare marketing funnel',
  ],
};

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
  ],
  'Volledig': [
    { id: '1', phase: 'Kennismaking & Analyse', description: 'Business duik, processen ontleden en gezamenlijke scope bepalen.' },
    { id: '2', phase: 'Strategie & Design', description: 'Wireframes, merkidentiteit, KPI\'s en kanaalstrategie vastleggen.' },
    { id: '3', phase: 'Ontwikkeling & Lancering', description: 'Platform bouwen, campagnes opzetten en gefaseerd live gaan.' },
    { id: '4', phase: 'Groei & Optimalisatie', description: 'Datagedreven bijsturen, schalen wat werkt en continu verbeteren.' }
  ]
};

/**
 * Migrates old proposal data that's missing new fields.
 * Merges saved data with defaults so nothing is undefined.
 */
export function migrateProposalData(saved: Partial<ProposalData>): ProposalData {
  const defaults = getInitialData();
  const migrated = { ...defaults, ...saved };

  // Old proposals without onboardingCompleted but with content are "completed"
  if (migrated.onboardingCompleted === undefined && migrated.clientName) {
    migrated.onboardingCompleted = true;
  }

  // Old proposals without adPlatforms — infer from content
  if (!Array.isArray(migrated.adPlatforms)) {
    migrated.adPlatforms = [];
    if (migrated.metaAdsContent) migrated.adPlatforms.push('Meta Ads');
    if (migrated.googleAdsContent) migrated.adPlatforms.push('Google Ads');
  }

  // Ensure arrays are always arrays
  if (!Array.isArray(migrated.goals)) migrated.goals = [];
  if (!Array.isArray(migrated.approach)) migrated.approach = [];
  if (!Array.isArray(migrated.services)) migrated.services = [];
  if (!Array.isArray(migrated.analyticsTools)) migrated.analyticsTools = [];
  if (!Array.isArray(migrated.oneTimeItems)) migrated.oneTimeItems = [];
  if (!Array.isArray(migrated.monthlyItems)) migrated.monthlyItems = [];
  if (!Array.isArray(migrated.hiddenSlides)) migrated.hiddenSlides = [];

  return migrated;
}

export function getInitialData(): ProposalData {
  return {
    onboardingCompleted: false,
    hiddenSlides: [],
    clientName: '',
    clientLogo: '',
    logoScale: 48,
    proposalType: '',
    proposalDate: new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }),
    currentSituation: '',
    opportunities: '',
    goals: [],
    approach: [],
    adPlatforms: [],
    services: [],
    includeAnalytics: true,
    analyticsTools: [],
    metaAdsContent: '',
    googleAdsContent: '',
    linkedinAdsContent: '',
    contentByClient: '',
    contentByAgensea: '',
    oneTimeItems: [],
    monthlyItems: [],
    customDisclaimer: '',
    ctaText: 'is aan jou'
  };
}
