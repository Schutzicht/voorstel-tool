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
  serviceDescriptions: Record<string, string>;

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

  // Optionele A/B opties (vergelijking van pakketten)
  hasInvestmentOptions: boolean;
  investmentOptions: InvestmentOption[];

  // Disclaimer
  customDisclaimer: string;

  // CTA / Afsluiting
  ctaText: string;
}

export interface ProposalSignature {
  name: string;
  date: string;
  agreed: boolean;
  signatureImage?: string; // base64 PNG dataURL
  selectedOptionId?: string; // when proposal has investment options
  selectedOptionName?: string; // human-readable name (for display)
}

export interface SavedProposal {
  id: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  data: ProposalData;
  signature?: ProposalSignature | null;
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

export interface InvestmentOption {
  id: string;
  name: string;          // e.g. "Optie A"
  subtitle: string;      // e.g. "Basis website"
  description: string;   // longer explanation
  oneTimeItems: InvestmentItem[];
  monthlyItems: InvestmentItem[];
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

export const SERVICE_DESCRIPTIONS: Record<string, string> = {
  'Maatwerk Website': 'Een professionele website die past bij jouw merk en bezoekers overtuigt om actie te ondernemen.',
  'Webshop ontwikkeling': 'Een webshop waar klanten makkelijk kunnen bestellen, betalen en hun aankoop kunnen volgen.',
  'UX & Webdesign': 'Een ontwerp dat er goed uitziet én makkelijk te gebruiken is voor jouw bezoekers.',
  'SEO Optimalisatie': 'Beter gevonden worden in Google door mensen die zoeken naar wat jij aanbiedt.',
  'Google Ads (SEA)': 'Advertenties in Google zoekresultaten, precies op het moment dat mensen zoeken naar jouw dienst.',
  'Meta Ads (Social)': 'Advertenties op Facebook en Instagram gericht op jouw ideale doelgroep.',
  'LinkedIn Ads': 'Advertenties op LinkedIn gericht op zakelijke beslissers en professionals.',
  'Conversie Optimalisatie': 'Meer resultaat halen uit je bestaande bezoekers door de website slimmer in te richten.',
  'Maatwerk Software / AI Tooling': 'Software die aansluit op jouw werkwijze en je team uren per week bespaart.',
  'E-mail Marketing': 'Gerichte e-mails die klanten informeren, activeren en terugbrengen.',
  'Content Creatie': 'Teksten, beeld en video die jouw verhaal vertellen en je doelgroep aanspreken.',
};

export const ANALYTICS_OPTIONS = ['Google Analytics 4', 'Google Tag Manager', 'Google Search Console', 'Google My Business', 'Hotjar', 'Microsoft Clarity', 'Meta Pixel', 'Custom Dashboard'];

export const DISCLAIMER_OPTIONS = [
  'Genoemde prijzen zijn exclusief 21% BTW',
  'Advertentiebudget wordt direct aan het platform betaald en is niet inbegrepen',
  'Maandelijks opzegbaar na de eerste 3 maanden',
  'Prijzen zijn geldig tot 30 dagen na dagtekening',
  'Tussentijdse wijzigingen worden in overleg doorberekend',
  'Levertijden zijn indicatief en afhankelijk van tijdige aanlevering door de klant',
  'Intellectueel eigendom gaat over na volledige betaling',
  'Op deze overeenkomst zijn onze algemene voorwaarden van toepassing',
  'Facturatie vindt maandelijks achteraf plaats',
  'Eenmalige kosten worden gefactureerd bij start van het project',
  'Hosting en domeinnaam zijn niet inbegrepen tenzij anders vermeld',
  'Support na oplevering is 3 maanden inbegrepen',
];

export const CLIENT_CONTENT_OPTIONS: Record<string, string[]> = {
  general: [
    'Huisstijl elementen en logo\'s',
    'Toegang tot benodigde accounts',
    'Feedback op tussentijdse oplevermomenten',
  ],
  website: [
    'Teksten voor de website',
    'Foto- en beeldmateriaal',
    'Productfoto\'s en omschrijvingen',
  ],
  marketing: [
    'Bestaand advertentiemateriaal (indien aanwezig)',
    'Doelgroep informatie en klantendata',
    'Bestaande merkrichtlijnen',
  ],
  software: [
    'Beschrijving van huidige werkprocessen',
    'Toegang tot bestaande systemen',
    'Testgebruikers voor feedback',
  ],
  content: [
    'Ruwe content en beeldmateriaal als basis',
    'Merkrichtlijnen en tone of voice',
  ],
};

export const AGENSEA_CONTENT_OPTIONS: Record<string, string[]> = {
  general: [
    'Projectmanagement en communicatie',
    'Maandelijkse rapportage en sturing',
  ],
  website: [
    'Ontwerp en vormgeving van de website',
    'Technische bouw en ontwikkeling',
    'Mobiele optimalisatie',
    'Zoekmachine-optimalisatie (SEO)',
  ],
  marketing: [
    'Marketingstrategie en campagneplan',
    'Advertenties maken en beheren',
    'Doelgroep onderzoek en targeting',
    'Resultaten bijhouden en optimaliseren',
  ],
  software: [
    'Technisch ontwerp en ontwikkeling',
    'Gebruiksvriendelijk design',
    'Testen en kwaliteitscontrole',
    'Training en handleiding',
  ],
  content: [
    'Copywriting en tekstcreatie',
    'Grafisch ontwerp en beeldbewerking',
  ],
};

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
    { id: '1', phase: 'Kennismaking', description: 'We leren jouw bedrijf kennen. Wat zijn je doelen, wie wil je bereiken en wat heb je al geprobeerd?' },
    { id: '2', phase: 'Plan & Voorstel', description: 'We maken een helder plan: welke kanalen, hoeveel budget en wat je kunt verwachten. Geen verrassingen achteraf.' },
    { id: '3', phase: 'Live gaan', description: 'We zetten de advertenties klaar, richten alles in en gaan live. Je blijft op de hoogte via korte updates.' },
    { id: '4', phase: 'Bijsturen & Groeien', description: 'We houden de resultaten dagelijks in de gaten en sturen bij waar nodig. Zo halen we het maximale eruit.' }
  ],
  'Website': [
    { id: '1', phase: 'Kennismaking', description: 'We bespreken jouw wensen, wie je klanten zijn en wat de website voor je moet opleveren.' },
    { id: '2', phase: 'Ontwerp', description: 'We ontwerpen de indeling en vormgeving van je website. Je ziet vooraf precies hoe alles eruitziet.' },
    { id: '3', phase: 'Bouwen', description: 'We bouwen je website: snel, veilig en op moderne technieken. Je kunt tussendoor meekijken en feedback geven.' },
    { id: '4', phase: 'Oplevering', description: 'We testen alles grondig, zetten de website live en zorgen dat jij ermee kunt werken. Daarna blijven we beschikbaar.' }
  ],
  'Software': [
    { id: '1', phase: 'Kennismaking', description: 'We brengen samen in kaart hoe je nu werkt en waar het beter kan. Welke taken kosten te veel tijd?' },
    { id: '2', phase: 'Ontwerp', description: 'We bedenken hoe de oplossing eruitziet en hoe die past in jouw werkwijze. Helder en zonder technisch jargon.' },
    { id: '3', phase: 'Bouwen', description: 'We ontwikkelen de software stap voor stap. Je kunt tussendoor testen en feedback geven zodat het precies klopt.' },
    { id: '4', phase: 'Oplevering', description: 'We zorgen dat alles werkt, leggen het uit aan je team en blijven beschikbaar voor vragen en verbeteringen.' }
  ],
  'Volledig': [
    { id: '1', phase: 'Kennismaking', description: 'We leren jouw bedrijf kennen. Wat zijn je ambities, waar loop je tegenaan en wat heb je nodig?' },
    { id: '2', phase: 'Plan & Ontwerp', description: 'We maken een compleet plan: hoe je website eruitziet, welke kanalen we inzetten en wat het kost. Helder en transparant.' },
    { id: '3', phase: 'Bouwen & Live gaan', description: 'We bouwen je platform, zetten campagnes op en gaan stap voor stap live. Je blijft betrokken via korte updates.' },
    { id: '4', phase: 'Oplevering & Groeien', description: 'We leveren alles op, zorgen dat je ermee kunt werken en blijven bijsturen voor het beste resultaat.' }
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
  if (!migrated.serviceDescriptions || typeof migrated.serviceDescriptions !== 'object') migrated.serviceDescriptions = {};
  if (typeof migrated.hasInvestmentOptions !== 'boolean') migrated.hasInvestmentOptions = false;
  if (!Array.isArray(migrated.investmentOptions)) migrated.investmentOptions = [];

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
    serviceDescriptions: {},
    includeAnalytics: true,
    analyticsTools: [],
    metaAdsContent: '',
    googleAdsContent: '',
    linkedinAdsContent: '',
    contentByClient: '',
    contentByAgensea: '',
    oneTimeItems: [],
    monthlyItems: [],
    hasInvestmentOptions: false,
    investmentOptions: [],
    customDisclaimer: '',
    ctaText: 'is aan jou'
  };
}
