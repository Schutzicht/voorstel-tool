import { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, Upload, Trash2, Sparkles, Globe, ShoppingCart, Megaphone, Search, Cog, Camera, Mail, Plus } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ANALYTICS_OPTIONS, COMMON_CHALLENGES, COMMON_OPPORTUNITIES, COMMON_GOALS, type ProposalData } from '../types';
import { generateProposalFromOnboarding, getSuggestionsForCategories, type OnboardingInput } from '../lib/generateDefaults';
import { uploadLogo, deleteLogo } from '../lib/storage';

interface Props {
  proposalId?: string;
  /** Existing data when re-entering wizard */
  existingData?: ProposalData;
  onComplete: (data: ProposalData) => void;
  onCancel?: () => void;
}

// ── Simple service options for admins ────────────────────────────────────────
const SERVICE_PICKS = [
  { id: 'website', label: 'Website', Icon: Globe },
  { id: 'webshop', label: 'Webshop', Icon: ShoppingCart },
  { id: 'ads', label: 'Ads / Campagnes', Icon: Megaphone },
  { id: 'seo', label: 'SEO', Icon: Search },
  { id: 'software', label: 'Software op maat', Icon: Cog },
  { id: 'content', label: 'Content & Social', Icon: Camera },
  { id: 'email', label: 'E-mail Marketing', Icon: Mail },
] as const;

const AD_PLATFORM_PICKS = [
  { id: 'Meta Ads', label: 'Meta', sub: 'Facebook & Instagram' },
  { id: 'Google Ads', label: 'Google', sub: 'Search & Display' },
  { id: 'LinkedIn Ads', label: 'LinkedIn', sub: 'B2B & Recruitment' },
] as const;

// Map simple picks → internal service strings + categories for the generator
function resolveSelections(picks: string[]) {
  const services: string[] = [];
  const categories: string[] = [];

  if (picks.includes('website')) { services.push('Maatwerk Website', 'UX & Webdesign'); categories.push('website'); }
  if (picks.includes('webshop')) { services.push('Webshop ontwikkeling', 'UX & Webdesign'); categories.push('website'); }
  if (picks.includes('ads'))    { services.push('Conversie Optimalisatie'); categories.push('marketing'); }
  if (picks.includes('seo'))    { services.push('SEO Optimalisatie'); categories.push('marketing'); }
  if (picks.includes('software')) { services.push('Maatwerk Software / AI Tooling'); categories.push('software'); }
  if (picks.includes('content')) { services.push('Content Creatie'); categories.push('content'); }
  if (picks.includes('email'))  { services.push('E-mail Marketing'); categories.push('marketing'); }

  return { services: [...new Set(services)], categories: [...new Set(categories)] };
}

// ── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  { title: 'Klant', subtitle: 'Voor wie is dit voorstel?' },
  { title: 'Diensten', subtitle: 'Wat wil de klant?' },
  { title: 'Doelen', subtitle: 'Wat willen we bereiken?' },
  { title: 'Prijzen', subtitle: 'Optioneel — kan ook later' },
];

export default function OnboardingWizard({ proposalId, existingData, onComplete, onCancel }: Props) {
  const ws = existingData?.wizardSelections;
  const isReconfigure = !!existingData;
  const [step, setStep] = useState(0);

  // Step 1 — pre-fill from existing data
  const [clientName, setClientName] = useState(existingData?.clientName || '');
  const [clientLogo, setClientLogo] = useState(existingData?.clientLogo || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 — pre-fill from stored wizard selections
  const [picks, setPicks] = useState<string[]>(ws?.picks || []);
  const [adPlatforms, setAdPlatforms] = useState<string[]>(ws?.adPlatforms || []);
  const [analyticsTools, setAnalyticsTools] = useState<string[]>(ws?.analyticsTools || ['Google Analytics 4', 'Google Tag Manager']);

  // Step 3
  const [challenges, setChallenges] = useState<string[]>(ws?.challenges || []);
  const [opportunities, setOpportunities] = useState<string[]>(ws?.opportunities || []);
  const [goals, setGoals] = useState<string[]>(ws?.goals || []);
  const [customChallenge, setCustomChallenge] = useState('');
  const [customOpportunity, setCustomOpportunity] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  // Track all custom-added items so they stay visible even when deselected
  const [addedChallenges, setAddedChallenges] = useState<string[]>(() => (ws?.challenges || []).filter(c => !Object.values(COMMON_CHALLENGES).flat().includes(c)));
  const [addedOpportunities, setAddedOpportunities] = useState<string[]>(() => (ws?.opportunities || []).filter(o => !Object.values(COMMON_OPPORTUNITIES).flat().includes(o)));
  const [addedGoals, setAddedGoals] = useState<string[]>(() => (ws?.goals || []).filter(g => !Object.values(COMMON_GOALS).flat().includes(g)));

  // Step 4
  const [oneTimeItems, setOneTimeItems] = useState<ProposalData['oneTimeItems']>(existingData?.oneTimeItems || []);
  const [monthlyItems, setMonthlyItems] = useState<ProposalData['monthlyItems']>(existingData?.monthlyItems || []);

  const { categories } = resolveSelections(picks);
  const suggestions = getSuggestionsForCategories(categories);
  const showAds = picks.includes('ads');

  const toggle = (item: string, list: string[], set: (v: string[]) => void) =>
    set(list.includes(item) ? list.filter(x => x !== item) : [...list, item]);

  const togglePick = (id: string) => {
    const next = picks.includes(id) ? picks.filter(x => x !== id) : [...picks, id];
    setPicks(next);
    // Auto-add default ad platforms when selecting ads
    if (id === 'ads' && !picks.includes('ads')) {
      setAdPlatforms(prev => prev.length === 0 ? ['Meta Ads', 'Google Ads'] : prev);
    }
    // Clear ad platforms when deselecting ads
    if (id === 'ads' && picks.includes('ads')) {
      setAdPlatforms([]);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (proposalId) {
      const url = await uploadLogo(proposalId, file);
      setClientLogo(url);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => setClientLogo(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = () => {
    const { services, categories } = resolveSelections(picks);
    if (adPlatforms.includes('Meta Ads')) services.push('Meta Ads (Social)');
    if (adPlatforms.includes('Google Ads')) services.push('Google Ads (SEA)');
    if (adPlatforms.includes('LinkedIn Ads')) services.push('LinkedIn Ads');

    const input: OnboardingInput = {
      clientName, clientLogo, logoScale: existingData?.logoScale ?? 48,
      picks,
      categories, services: [...new Set(services)], adPlatforms, analyticsTools,
      goals, challenges, opportunities,
      oneTimeItems, monthlyItems,
    };

    const generated = generateProposalFromOnboarding(input);

    if (isReconfigure && existingData) {
      // Smart merge: keep manual text edits, update structural things
      const merged: ProposalData = {
        ...generated,
        // Keep manually edited text fields if they were changed from the original wizard defaults
        currentSituation: existingData.currentSituation || generated.currentSituation,
        opportunities: existingData.opportunities || generated.opportunities,
        metaAdsContent: existingData.metaAdsContent || generated.metaAdsContent,
        googleAdsContent: existingData.googleAdsContent || generated.googleAdsContent,
        linkedinAdsContent: existingData.linkedinAdsContent || generated.linkedinAdsContent,
        contentByClient: existingData.contentByClient || generated.contentByClient,
        contentByAgensea: existingData.contentByAgensea || generated.contentByAgensea,
        customDisclaimer: existingData.customDisclaimer || generated.customDisclaimer,
        ctaText: existingData.ctaText || generated.ctaText,
        // Keep hidden slides
        hiddenSlides: existingData.hiddenSlides || [],
      };
      onComplete(merged);
    } else {
      onComplete(generated);
    }
  };

  const canProceed = () => {
    if (step === 0) return clientName.trim().length > 0;
    if (step === 1) return picks.length > 0 && (!showAds || adPlatforms.length > 0);
    if (step === 2) return goals.length > 0;
    return true;
  };

  let _id = Date.now();
  const uid = () => String(++_id);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      {/* Header */}
      <header className="border-b border-warm-grey bg-white px-8 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo text-white rounded-xl flex items-center justify-center text-sm font-display font-bold">Ag</div>
            <div>
              <h1 className="font-display font-bold text-dark text-lg">{isReconfigure ? 'Opzet wijzigen' : 'Nieuw Voorstel'}</h1>
              <p className="text-xs text-text-secondary">{clientName || 'Onbekende klant'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {STEPS.map((_s, i) => (
              <div key={i} className="flex items-center">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                    i < step ? 'bg-indigo text-white cursor-pointer' :
                    i === step ? 'bg-indigo text-white ring-4 ring-indigo/20' :
                    'bg-warm-grey/60 text-text-secondary'
                  )}
                >{i + 1}</button>
                {i < STEPS.length - 1 && <div className={clsx('w-6 h-[2px] mx-0.5', i < step ? 'bg-indigo' : 'bg-warm-grey')} />}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-8 py-12 overflow-y-auto">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-2">Stap {step + 1}</p>
                <h2 className="text-3xl font-display font-bold text-dark">{STEPS[step].title}</h2>
                <p className="text-text-secondary mt-1">{STEPS[step].subtitle}</p>
              </div>

              {/* ── STEP 0: Klant ─────────────────────────────────────────── */}
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-dark mb-2">Bedrijfsnaam *</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      placeholder="Bijv. De Next Play"
                      className="w-full text-lg bg-white border border-warm-grey rounded-2xl focus:border-indigo focus:ring-2 focus:ring-indigo/20 outline-none px-5 py-4 transition-all text-dark"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-dark mb-2">Logo <span className="font-normal text-text-secondary">(optioneel)</span></label>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    <div className="relative">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-warm-grey rounded-2xl py-8 flex flex-col items-center gap-2 text-text-secondary hover:border-indigo hover:text-indigo transition-colors"
                      >
                        {clientLogo
                          ? <img src={clientLogo} alt="logo" className="h-16 object-contain" />
                          : <><Upload className="w-5 h-5" /><span className="text-sm">Upload logo</span></>
                        }
                      </button>
                      {clientLogo && (
                        <button
                          onClick={e => { e.stopPropagation(); setClientLogo(''); if (proposalId) deleteLogo(proposalId).catch(console.error); }}
                          className="absolute top-3 right-3 w-8 h-8 bg-white border border-warm-grey rounded-lg flex items-center justify-center text-text-secondary hover:text-red-500 hover:border-red-300 transition-colors shadow-sm"
                        ><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 1: Diensten ──────────────────────────────────────── */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    {SERVICE_PICKS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => togglePick(p.id)}
                        className={clsx(
                          'flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left',
                          picks.includes(p.id)
                            ? 'border-indigo bg-indigo/5'
                            : 'border-warm-grey bg-white hover:border-indigo/40'
                        )}
                      >
                        <p.Icon className={clsx('w-6 h-6', picks.includes(p.id) ? 'text-indigo' : 'text-text-secondary')} />
                        <span className="font-display font-bold text-dark">{p.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Ad platforms — only visible when ads picked */}
                  {showAds && (
                    <div className="pt-2">
                      <label className="block text-sm font-bold text-dark mb-3">Op welke platformen?</label>
                      <div className="grid grid-cols-3 gap-3">
                        {AD_PLATFORM_PICKS.map(p => (
                          <button
                            key={p.id}
                            onClick={() => toggle(p.id, adPlatforms, setAdPlatforms)}
                            className={clsx(
                              'p-4 rounded-2xl border-2 text-center transition-all',
                              adPlatforms.includes(p.id)
                                ? 'border-indigo bg-indigo/5'
                                : 'border-warm-grey bg-white hover:border-indigo/40'
                            )}
                          >
                            <span className="font-display font-bold text-dark block">{p.label}</span>
                            <span className="text-[11px] text-text-secondary">{p.sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Analytics — collapsed, only if relevant */}
                  {picks.length > 0 && (
                    <div className="pt-2">
                      <label className="block text-sm font-bold text-dark mb-3">Tracking & Analytics</label>
                      <div className="flex flex-wrap gap-2">
                        {ANALYTICS_OPTIONS.map(t => (
                          <button
                            key={t}
                            onClick={() => toggle(t, analyticsTools, setAnalyticsTools)}
                            className={clsx(
                              'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                              analyticsTools.includes(t)
                                ? 'bg-indigo/10 text-indigo border-indigo/30'
                                : 'bg-white text-text-secondary border-warm-grey hover:border-indigo/40'
                            )}
                          >{t}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 2: Doelen ────────────────────────────────────────── */}
              {step === 2 && (
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-dark mb-3">Uitdagingen</label>
                    <div className="flex flex-wrap gap-2">
                      {[...suggestions.challenges, ...addedChallenges.filter(c => !suggestions.challenges.includes(c))].map(c => (
                        <button
                          key={c}
                          onClick={() => toggle(c, challenges, setChallenges)}
                          className={clsx(
                            'px-3 py-2 rounded-xl text-sm border transition-all text-left',
                            challenges.includes(c)
                              ? 'bg-indigo/5 text-indigo border-indigo/30 font-medium'
                              : 'bg-white text-dark border-warm-grey hover:border-indigo/40'
                          )}
                        >{c}</button>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        value={customChallenge}
                        onChange={e => setCustomChallenge(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && customChallenge.trim()) {
                            const val = customChallenge.trim();
                            if (!challenges.includes(val)) setChallenges([...challenges, val]);
                            if (!addedChallenges.includes(val) && !suggestions.challenges.includes(val)) setAddedChallenges([...addedChallenges, val]);
                            setCustomChallenge('');
                          }
                        }}
                        placeholder="Typ een eigen uitdaging..."
                        className="flex-1 text-sm bg-white border border-warm-grey rounded-xl px-4 py-2.5 outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all text-dark"
                      />
                      <button
                        onClick={() => {
                          const val = customChallenge.trim();
                          if (val) {
                            if (!challenges.includes(val)) setChallenges([...challenges, val]);
                            if (!addedChallenges.includes(val) && !suggestions.challenges.includes(val)) setAddedChallenges([...addedChallenges, val]);
                            setCustomChallenge('');
                          }
                        }}
                        disabled={!customChallenge.trim()}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo text-white text-sm font-semibold rounded-xl hover:bg-indigo-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" /> Toevoegen
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-dark mb-3">Kansen</label>
                    <div className="flex flex-wrap gap-2">
                      {[...suggestions.opportunities, ...addedOpportunities.filter(o => !suggestions.opportunities.includes(o))].map(o => (
                        <button
                          key={o}
                          onClick={() => toggle(o, opportunities, setOpportunities)}
                          className={clsx(
                            'px-3 py-2 rounded-xl text-sm border transition-all text-left',
                            opportunities.includes(o)
                              ? 'bg-indigo/5 text-indigo border-indigo/30 font-medium'
                              : 'bg-white text-dark border-warm-grey hover:border-indigo/40'
                          )}
                        >{o}</button>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        value={customOpportunity}
                        onChange={e => setCustomOpportunity(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && customOpportunity.trim()) {
                            const val = customOpportunity.trim();
                            if (!opportunities.includes(val)) setOpportunities([...opportunities, val]);
                            if (!addedOpportunities.includes(val) && !suggestions.opportunities.includes(val)) setAddedOpportunities([...addedOpportunities, val]);
                            setCustomOpportunity('');
                          }
                        }}
                        placeholder="Typ een eigen kans..."
                        className="flex-1 text-sm bg-white border border-warm-grey rounded-xl px-4 py-2.5 outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all text-dark"
                      />
                      <button
                        onClick={() => {
                          const val = customOpportunity.trim();
                          if (val) {
                            if (!opportunities.includes(val)) setOpportunities([...opportunities, val]);
                            if (!addedOpportunities.includes(val) && !suggestions.opportunities.includes(val)) setAddedOpportunities([...addedOpportunities, val]);
                            setCustomOpportunity('');
                          }
                        }}
                        disabled={!customOpportunity.trim()}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo text-white text-sm font-semibold rounded-xl hover:bg-indigo-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" /> Toevoegen
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-dark mb-3">Doelen *</label>
                    <div className="flex flex-wrap gap-2">
                      {[...suggestions.goals, ...addedGoals.filter(g => !suggestions.goals.includes(g))].map(g => (
                        <button
                          key={g}
                          onClick={() => toggle(g, goals, setGoals)}
                          className={clsx(
                            'px-3 py-2 rounded-xl text-sm border transition-all text-left',
                            goals.includes(g)
                              ? 'bg-indigo text-white border-indigo font-medium'
                              : 'bg-white text-dark border-warm-grey hover:border-indigo/40'
                          )}
                        >{g}</button>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        value={customGoal}
                        onChange={e => setCustomGoal(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && customGoal.trim()) {
                            const val = customGoal.trim();
                            if (!goals.includes(val)) setGoals([...goals, val]);
                            if (!addedGoals.includes(val) && !suggestions.goals.includes(val)) setAddedGoals([...addedGoals, val]);
                            setCustomGoal('');
                          }
                        }}
                        placeholder="Typ een eigen doel..."
                        className="flex-1 text-sm bg-white border border-warm-grey rounded-xl px-4 py-2.5 outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all text-dark"
                      />
                      <button
                        onClick={() => {
                          const val = customGoal.trim();
                          if (val) {
                            if (!goals.includes(val)) setGoals([...goals, val]);
                            if (!addedGoals.includes(val) && !suggestions.goals.includes(val)) setAddedGoals([...addedGoals, val]);
                            setCustomGoal('');
                          }
                        }}
                        disabled={!customGoal.trim()}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo text-white text-sm font-semibold rounded-xl hover:bg-indigo-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" /> Toevoegen
                      </button>
                    </div>
                    <p className="text-xs text-text-secondary mt-2">Minimaal 1. Kies uit de suggesties of typ je eigen doel.</p>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Prijzen ───────────────────────────────────────── */}
              {step === 3 && (
                <div className="space-y-8">
                  <p className="text-sm text-text-secondary bg-white border border-warm-grey rounded-xl p-4">
                    Optioneel — laat leeg voor standaard prijzen op basis van de gekozen diensten. Aanpassen kan altijd later.
                  </p>

                  <div>
                    <label className="block text-sm font-bold text-dark mb-3">Eenmalig</label>
                    <div className="space-y-2">
                      {oneTimeItems.map(item => (
                        <div key={item.id} className="flex gap-2 items-center">
                          <input type="text" value={item.description} onChange={e => setOneTimeItems(prev => prev.map(i => i.id === item.id ? { ...i, description: e.target.value } : i))} placeholder="Omschrijving" className="flex-1 text-sm bg-white border border-warm-grey rounded-xl px-3 py-2.5 outline-none focus:border-indigo" />
                          <input type="text" value={item.agenseaPrice} onChange={e => setOneTimeItems(prev => prev.map(i => i.id === item.id ? { ...i, agenseaPrice: e.target.value } : i))} placeholder="€ prijs" className="w-28 text-sm bg-white border border-warm-grey rounded-xl px-3 py-2.5 outline-none focus:border-indigo text-center" />
                          <button onClick={() => setOneTimeItems(prev => prev.filter(i => i.id !== item.id))} className="text-text-secondary hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button onClick={() => setOneTimeItems(prev => [...prev, { id: uid(), description: '', agenseaPrice: '', typicalPrice: '' }])} className="text-indigo text-sm font-semibold hover:opacity-70">+ Toevoegen</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-dark mb-3">Maandelijks</label>
                    <div className="space-y-2">
                      {monthlyItems.map(item => (
                        <div key={item.id} className="flex gap-2 items-center">
                          <input type="text" value={item.description} onChange={e => setMonthlyItems(prev => prev.map(i => i.id === item.id ? { ...i, description: e.target.value } : i))} placeholder="Omschrijving" className="flex-1 text-sm bg-white border border-warm-grey rounded-xl px-3 py-2.5 outline-none focus:border-indigo" />
                          <input type="text" value={item.agenseaPrice} onChange={e => setMonthlyItems(prev => prev.map(i => i.id === item.id ? { ...i, agenseaPrice: e.target.value } : i))} placeholder="€ prijs" className="w-28 text-sm bg-white border border-warm-grey rounded-xl px-3 py-2.5 outline-none focus:border-indigo text-center" />
                          <button onClick={() => setMonthlyItems(prev => prev.filter(i => i.id !== item.id))} className="text-text-secondary hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button onClick={() => setMonthlyItems(prev => [...prev, { id: uid(), description: '', agenseaPrice: '', typicalPrice: '' }])} className="text-indigo text-sm font-semibold hover:opacity-70">+ Toevoegen</button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-warm-grey bg-white px-8 py-5">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-dark transition-colors">
              <ChevronLeft className="w-4 h-4" /> Vorige
            </button>
          ) : onCancel ? (
            <button onClick={onCancel} className="text-sm font-medium text-text-secondary hover:text-dark transition-colors">
              Annuleer
            </button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-dark text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Volgende <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 bg-indigo text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-indigo-light transition-colors shadow-lg shadow-indigo/20"
            >
              <Sparkles className="w-4 h-4" /> Genereer voorstel
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
