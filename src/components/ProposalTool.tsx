import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProposal, saveProposal } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, Plus, Trash2,
  Upload, Check, Download, Eye, Loader2
} from 'lucide-react';
import clsx from 'clsx';
import {
  type ProposalData, type ApproachStep, type InvestmentItem,
  PROPOSAL_TYPES, SERVICES_OPTIONS, ANALYTICS_OPTIONS, getInitialData,
  COMMON_CHALLENGES, COMMON_OPPORTUNITIES, COMMON_GOALS, DEFAULT_APPROACHES
} from '../types';
import {
  CoverSlide, AgencySlide, ClientMarqueeSlide, SituatieSlide, DoelSlide, AboutTeamSlide, WerkwijzeSlide,
  AdPlatformsSlide, DienstenSlide, AnalyticsSlide, ContentSlide, EenmaligeInvesteringSlide,
  MaandelijksSlide, DisclaimerSlide, CTASlide, MockupsSlide
} from './Slides';

// ── Helper UI ────────────────────────────────────────────────────────────────
function Label({ children }: { children: ReactNode }) {
  return <label className="block text-[11px] uppercase tracking-widest font-bold text-text-secondary mb-2">{children}</label>;
}

function Textarea({ value, onChange, rows = 4, placeholder }: {
  value: string; onChange: (v: string) => void; rows?: number; placeholder?: string
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-sm bg-white border border-warm-grey rounded-xl focus:border-indigo focus:ring-1 focus:ring-indigo/20 outline-none p-3 transition-all resize-none font-sans text-dark leading-relaxed"
    />
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-sm bg-white border border-warm-grey rounded-xl focus:border-indigo focus:ring-1 focus:ring-indigo/20 outline-none px-3 py-2.5 transition-all font-sans text-dark"
    />
  );
}

// ── Slide Preview Frame ──────────────────────────────────────────────────────
function SlideFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <div className="absolute inset-0 overflow-hidden rounded-xl shadow-2xl border border-warm-grey">
        <div
          className="absolute origin-top-left"
          style={{
            width: '1280px',
            height: '720px',
            transform: 'scale(var(--slide-scale, 0.4))',
          }}
          ref={(el) => {
            if (el) {
              const updateScale = () => {
                const container = el.parentElement;
                if (container) {
                  const scale = container.offsetWidth / 1280;
                  el.style.setProperty('--slide-scale', String(scale));
                  el.style.transform = `scale(${scale})`;
                }
              };
              updateScale();
              const ro = new ResizeObserver(updateScale);
              ro.observe(el.parentElement!);
            }
          }}
        >
          <div className="w-[1280px] h-[720px] overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── The main tool ────────────────────────────────────────────────────────────
type FormSection = {
  id: string;
  slideIndex: number;
  slideLabel: string;
  title: string;
};

const SECTIONS: FormSection[] = [
  { id: 'cover', slideIndex: 0, slideLabel: 'Cover', title: '1. Cover & Klantnaam' },
  { id: 'agency', slideIndex: 1, slideLabel: 'Agensea', title: '2. Agency Intro' },
  { id: 'partners', slideIndex: 2, slideLabel: 'Klanten', title: '3. Onze Klanten' },
  { id: 'situatie', slideIndex: 3, slideLabel: 'Situatie', title: '4. Situatie Analyse' },
  { id: 'doelen', slideIndex: 4, slideLabel: 'Doelen', title: '5. Concrete Doelen' },
  { id: 'team', slideIndex: 5, slideLabel: 'Team', title: '6. Ons Team' },
  { id: 'werkwijze', slideIndex: 6, slideLabel: 'Werkwijze', title: '7. Werkwijze / Aanpak' },
  { id: 'adplatforms', slideIndex: 7, slideLabel: 'Advertentie Kanalen', title: '8. Meta vs Google' },
  { id: 'diensten', slideIndex: 8, slideLabel: 'Diensten', title: '9. Diensten & Scope' },
  { id: 'analytics', slideIndex: 9, slideLabel: 'Analytics', title: '10. Data & Analytics' },
  { id: 'mockups', slideIndex: 10, slideLabel: 'Mockups', title: '11. Visueel Concept' },
  { id: 'content', slideIndex: 11, slideLabel: 'Content', title: '12. Content & Samenwerking' },
  { id: 'eenmalig', slideIndex: 12, slideLabel: 'Investering (1x)', title: '13. Eenmalige Investering' },
  { id: 'maandelijks', slideIndex: 13, slideLabel: 'Investering (mnd)', title: '14. Maandelijkse Investering' },
  { id: 'disclaimer', slideIndex: 14, slideLabel: 'Disclaimer', title: '15. Voorwaarden' },
  { id: 'cta', slideIndex: 15, slideLabel: 'Afsluiting', title: '16. Afsluiting & CTA' },
];

function renderSlide(data: ProposalData, index: number) {
  switch (index) {
    case 0: return <CoverSlide data={data} />;
    case 1: return <AgencySlide data={data} />;
    case 2: return <ClientMarqueeSlide data={data} />;
    case 3: return <SituatieSlide data={data} />;
    case 4: return <DoelSlide data={data} />;
    case 5: return <AboutTeamSlide data={data} />;
    case 6: return <WerkwijzeSlide data={data} />;
    case 7: return <AdPlatformsSlide data={data} />;
    case 8: return <DienstenSlide data={data} />;
    case 9: return <AnalyticsSlide data={data} />;
    case 10: return <MockupsSlide data={data} />;
    case 11: return <ContentSlide data={data} />;
    case 12: return <EenmaligeInvesteringSlide data={data} />;
    case 13: return <MaandelijksSlide data={data} />;
    case 14: return <DisclaimerSlide data={data} />;
    case 15: return <CTASlide data={data} />;
    default: return null;
  }
}

// ── ID generator ─────────────────────────────────────────────────────────────
let _id = Date.now();
function uid() { return String(++_id); }

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProposalTool() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [data, setData] = useState<ProposalData>(getInitialData());
  const [activeSection, setActiveSection] = useState<string>('cover');
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial data if an ID exists
  useEffect(() => {
    if (id) {
      getProposal(id).then(res => {
        if (res) setData(res.data);
      }).catch(console.error);
    }
  }, [id]);

  // Sync approach when proposal type changes
  const lastType = useRef(data.proposalType);
  if (lastType.current !== data.proposalType) {
    const newApproach = DEFAULT_APPROACHES[data.proposalType] || DEFAULT_APPROACHES['Website'];
    setData(prev => ({ ...prev, approach: newApproach }));
    lastType.current = data.proposalType;
  }

  // Auto-save debounced
  useEffect(() => {
    if (!id) return;
    const timer = setTimeout(() => {
      setIsSaving(true);
      saveProposal(id, data).then(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }).catch(err => {
        console.error('Failed to save', err);
        setIsSaving(false);
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [data, id]);

  const currentSection = SECTIONS.find(s => s.id === activeSection)!;
  const currentSlideIndex = currentSection.slideIndex;

  // Update helpers
  const upd = useCallback(<K extends keyof ProposalData>(key: K, value: ProposalData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => upd('clientLogo', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Goal helpers
  const addGoal = () => upd('goals', [...data.goals, { id: uid(), text: '' }]);
  const updateGoal = (id: string, text: string) =>
    upd('goals', data.goals.map(g => g.id === id ? { ...g, text } : g));
  const removeGoal = (id: string) =>
    upd('goals', data.goals.filter(g => g.id !== id));

  // Approach helpers
  const updateApproach = (id: string, field: keyof ApproachStep, v: string) =>
    upd('approach', data.approach.map(a => a.id === id ? { ...a, [field]: v } : a));
  const addApproach = () =>
    upd('approach', [...data.approach, { id: uid(), phase: '', description: '' }]);
  const removeApproach = (id: string) =>
    upd('approach', data.approach.filter(a => a.id !== id));

  // Service toggle
  const toggleService = (s: string) =>
    upd('services', data.services.includes(s) ? data.services.filter(x => x !== s) : [...data.services, s]);

  // Analytics toggle
  const toggleAnalytics = (s: string) =>
    upd('analyticsTools', data.analyticsTools.includes(s) ? data.analyticsTools.filter(x => x !== s) : [...data.analyticsTools, s]);

  // Investment helpers
  const updOneTime = (id: string, field: keyof InvestmentItem, v: string) =>
    upd('oneTimeItems', data.oneTimeItems.map(i => i.id === id ? { ...i, [field]: v } : i));
  const addOneTime = () =>
    upd('oneTimeItems', [...data.oneTimeItems, { id: uid(), description: '', agenseaPrice: '', typicalPrice: '' }]);
  const removeOneTime = (id: string) =>
    upd('oneTimeItems', data.oneTimeItems.filter(i => i.id !== id));

  const updMonthly = (id: string, field: keyof InvestmentItem, v: string) =>
    upd('monthlyItems', data.monthlyItems.map(i => i.id === id ? { ...i, [field]: v } : i));
  const addMonthly = () =>
    upd('monthlyItems', [...data.monthlyItems, { id: uid(), description: '', agenseaPrice: '', typicalPrice: '' }]);
  const removeMonthly = (id: string) =>
    upd('monthlyItems', data.monthlyItems.filter(i => i.id !== id));

  // ── Form Sections ────────────────────────────────────────────────────────
  const renderForm = () => {
    switch (activeSection) {
      case 'cover':
        return (
          <div className="space-y-5">
            <div>
              <Label>Bedrijfsnaam klant *</Label>
              <TextInput value={data.clientName} onChange={v => upd('clientName', v)} placeholder="De Next Play" />
            </div>
            <div>
              <Label>Type voorstel</Label>
              <div className="grid gap-2">
                {PROPOSAL_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => upd('proposalType', t)}
                    className={clsx(
                      'text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                      data.proposalType === t
                        ? 'border-indigo bg-indigo/5 text-indigo ring-1 ring-indigo/30'
                        : 'border-warm-grey bg-white text-dark hover:border-indigo'
                    )}
                  >{t}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>Logo klant (upload afbeelding)</Label>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-warm-grey rounded-xl py-6 flex flex-col items-center gap-2 text-text-secondary hover:border-indigo hover:text-indigo transition-colors"
              >
                {data.clientLogo
                  ? <img src={data.clientLogo} alt="logo" className="h-12 object-contain" />
                  : <><Upload className="w-6 h-6" /><span className="text-sm font-medium">Klik om logo te uploaden</span></>
                }
              </button>
            </div>
            <div>
              <Label>Datum voorstel</Label>
              <TextInput value={data.proposalDate} onChange={v => upd('proposalDate', v)} placeholder="30-3-2025" />
            </div>
          </div>
        );

      case 'agency':
      case 'partners':
        return (
          <div className="py-6 text-center text-text-secondary">
            <div className="w-16 h-16 bg-indigo/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <div className="font-display font-bold text-indigo text-xl">Ag</div>
            </div>
            <p className="font-medium text-dark mb-2">{currentSection.slideLabel} slide</p>
            <p className="text-sm">Deze slide is standaard Agensea branding. Geen aanpassingen nodig.</p>
          </div>
        );

      case 'team':
        return (
          <div className="py-6 text-center text-text-secondary">
            <div className="w-16 h-16 bg-indigo/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
               <svg className="w-8 h-8 text-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <p className="font-medium text-dark mb-2">Ons Team slide</p>
            <p className="text-sm">Deze slide toont de drie partners van Agensea. Geen aanpassingen nodig.</p>
          </div>
        );

      case 'situatie':
        return (
          <div className="space-y-5">
            <div>
              <Label>Huidige situatie (één punt per regel)</Label>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {COMMON_CHALLENGES.map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      const lines = data.currentSituation.split('\n').filter(l => l.trim());
                      if (!lines.includes(c)) upd('currentSituation', [...lines, c].join('\n'));
                    }}
                    className="text-[10px] px-2 py-1 bg-warm-grey/50 hover:bg-indigo/10 hover:text-indigo rounded-md transition-colors"
                  >+ {c}</button>
                ))}
              </div>
              <Textarea
                value={data.currentSituation}
                onChange={v => upd('currentSituation', v)}
                rows={4}
                placeholder={'Selecteer hierboven of typ zelf...'}
              />
            </div>
            <div>
              <Label>Kansen (één punt per regel)</Label>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {COMMON_OPPORTUNITIES.map(o => (
                  <button
                    key={o}
                    onClick={() => {
                      const lines = data.opportunities.split('\n').filter(l => l.trim());
                      if (!lines.includes(o)) upd('opportunities', [...lines, o].join('\n'));
                    }}
                    className="text-[10px] px-2 py-1 bg-warm-grey/50 hover:bg-indigo/10 hover:text-indigo rounded-md transition-colors"
                  >+ {o}</button>
                ))}
              </div>
              <Textarea
                value={data.opportunities}
                onChange={v => upd('opportunities', v)}
                rows={4}
                placeholder={'Selecteer hierboven of typ zelf...'}
              />
            </div>
          </div>
        );

      case 'doelen':
        return (
          <div className="space-y-3 font-sans">
            <div className="mb-4">
              <Label>Snel toevoegen</Label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_GOALS.map(goal => (
                  <button
                    key={goal}
                    onClick={() => {
                      const emptyIndex = data.goals.findIndex(g => !g.text.trim());
                      if (emptyIndex !== -1) {
                        updateGoal(data.goals[emptyIndex].id, goal);
                      } else {
                        upd('goals', [...data.goals, { id: uid(), text: goal }]);
                      }
                    }}
                    className="text-[10px] px-2 py-1 bg-warm-grey/50 hover:bg-indigo/10 hover:text-indigo rounded-md transition-colors"
                  >+ {goal}</button>
                ))}
              </div>
            </div>
            {data.goals.map((g, i) => (
              <div key={g.id} className="flex gap-2 items-start">
                <span className="font-display font-bold text-indigo/60 text-xl leading-none mt-3 w-6 shrink-0 text-right">
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <TextInput
                    value={g.text}
                    onChange={v => updateGoal(g.id, v)}
                    placeholder={`Doel ${i + 1}, bijv. MVP live binnen 8 weken`}
                  />
                </div>
                {data.goals.length > 1 && (
                  <button onClick={() => removeGoal(g.id)} className="mt-2 text-text-secondary hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addGoal}
              className="flex items-center gap-2 text-indigo text-sm font-semibold hover:opacity-70 transition-opacity mt-2"
            >
              <Plus className="w-4 h-4" /> Doel toevoegen
            </button>
          </div>
        );

      case 'werkwijze':
        return (
          <div className="space-y-3">
            {data.approach.map((step, i) => (
              <div key={step.id} className="bg-white rounded-xl p-4 border border-warm-grey space-y-2">
                <div className="flex items-center gap-2 justify-between">
                  <div className="w-7 h-7 rounded-full bg-indigo text-white flex items-center justify-center text-xs font-bold font-display shrink-0">{i + 1}</div>
                  <TextInput value={step.phase} onChange={v => updateApproach(step.id, 'phase', v)} placeholder="Fase naam" />
                  {data.approach.length > 1 && (
                    <button onClick={() => removeApproach(step.id)} className="text-text-secondary hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Textarea
                  rows={2}
                  value={step.description}
                  onChange={v => updateApproach(step.id, 'description', v)}
                  placeholder="Beschrijving van deze fase..."
                />
              </div>
            ))}
            <button onClick={addApproach} className="flex items-center gap-2 text-indigo text-sm font-semibold hover:opacity-70 transition-opacity">
              <Plus className="w-4 h-4" /> Fase toevoegen
            </button>
          </div>
        );

      case 'adplatforms':
        return (
          <div className="space-y-5">
            <div>
              <Label>Meta Ads Focus (één punt per regel)</Label>
              <Textarea
                value={data.metaAdsContent}
                onChange={v => upd('metaAdsContent', v)}
                rows={5}
                placeholder={'Storytelling & Video\nRetargeting\nLookalike audiences'}
              />
            </div>
            <div>
              <Label>Google Ads Focus (één punt per regel)</Label>
              <Textarea
                value={data.googleAdsContent}
                onChange={v => upd('googleAdsContent', v)}
                rows={5}
                placeholder={'Zoekintentie\nShopping advertenties\nTargeting op categorie'}
              />
            </div>
          </div>
        );

      case 'diensten':
        return (
          <div className="space-y-2">
            <Label>Selecteer de diensten voor dit voorstel</Label>
            <div className="grid grid-cols-2 gap-2">
              {SERVICES_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => toggleService(s)}
                  className={clsx(
                    'text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-2',
                    data.services.includes(s)
                      ? 'border-indigo bg-indigo/5 text-indigo'
                      : 'border-warm-grey bg-white text-dark hover:border-indigo'
                  )}
                >
                  <div className={clsx('w-4 h-4 rounded flex items-center justify-center border shrink-0',
                    data.services.includes(s) ? 'bg-indigo border-indigo' : 'border-muted')}>
                    {data.services.includes(s) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  {s}
                </button>
              ))}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div>
            <Label>Tools & Tracking selecteren</Label>
            <div className="grid grid-cols-2 gap-2">
              {ANALYTICS_OPTIONS.map(t => (
                <button
                  key={t}
                  onClick={() => toggleAnalytics(t)}
                  className={clsx(
                    'text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-2',
                    data.analyticsTools.includes(t)
                      ? 'border-indigo bg-indigo/5 text-indigo'
                      : 'border-warm-grey bg-white text-dark hover:border-indigo'
                  )}
                >
                  <div className={clsx('w-4 h-4 rounded flex items-center justify-center border shrink-0',
                    data.analyticsTools.includes(t) ? 'bg-indigo border-indigo' : 'border-muted')}>
                    {data.analyticsTools.includes(t) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  {t}
                </button>
              ))}
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-5">
            <div>
              <Label>Geleverd door klant (één punt per regel)</Label>
              <Textarea value={data.contentByClient} onChange={v => upd('contentByClient', v)} rows={4}
                placeholder={'Foto- en videomateriaal\nProductfoto\'s'} />
            </div>
            <div>
              <Label>Geleverd door Agensea (één punt per regel)</Label>
              <Textarea value={data.contentByAgensea} onChange={v => upd('contentByAgensea', v)} rows={4}
                placeholder={'Advertentieteksten & CTA\'s\nCopywriting voor pagina\'s'} />
            </div>
          </div>
        );

      case 'eenmalig':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr,auto,auto,auto] gap-2 text-[10px] uppercase tracking-widest text-text-secondary font-bold px-1 mb-1">
              <span>Onderdeel</span><span>Normaal</span><span>Agensea</span><span></span>
            </div>
            {data.oneTimeItems.map(item => (
              <div key={item.id} className="grid grid-cols-[1fr,auto,auto,auto] gap-2 items-center">
                <TextInput value={item.description} onChange={v => updOneTime(item.id, 'description', v)} placeholder="Omschrijving" />
                <input type="text" value={item.typicalPrice} onChange={e => updOneTime(item.id, 'typicalPrice', e.target.value)} placeholder="€0" className="w-24 text-sm bg-white border border-warm-grey rounded-xl px-2 py-2.5 outline-none focus:border-indigo text-center" />
                <input type="text" value={item.agenseaPrice} onChange={e => updOneTime(item.id, 'agenseaPrice', e.target.value)} placeholder="€0" className="w-24 text-sm bg-white border border-indigo/30 rounded-xl px-2 py-2.5 outline-none focus:border-indigo text-center text-indigo font-bold" />
                <button onClick={() => removeOneTime(item.id)} className="text-text-secondary hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={addOneTime} className="flex items-center gap-2 text-indigo text-sm font-semibold hover:opacity-70 transition-opacity">
              <Plus className="w-4 h-4" /> Post toevoegen
            </button>
          </div>
        );

      case 'maandelijks':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr,auto,auto,auto] gap-2 text-[10px] uppercase tracking-widest text-text-secondary font-bold px-1 mb-1">
              <span>Onderdeel</span><span>Normaal</span><span>Agensea</span><span></span>
            </div>
            {data.monthlyItems.map(item => (
              <div key={item.id} className="grid grid-cols-[1fr,auto,auto,auto] gap-2 items-center">
                <TextInput value={item.description} onChange={v => updMonthly(item.id, 'description', v)} placeholder="Omschrijving" />
                <input type="text" value={item.typicalPrice} onChange={e => updMonthly(item.id, 'typicalPrice', e.target.value)} placeholder="€0" className="w-24 text-sm bg-white border border-warm-grey rounded-xl px-2 py-2.5 outline-none focus:border-indigo text-center" />
                <input type="text" value={item.agenseaPrice} onChange={e => updMonthly(item.id, 'agenseaPrice', e.target.value)} placeholder="€0" className="w-24 text-sm bg-white border border-indigo/30 rounded-xl px-2 py-2.5 outline-none focus:border-indigo text-center text-indigo font-bold" />
                <button onClick={() => removeMonthly(item.id)} className="text-text-secondary hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={addMonthly} className="flex items-center gap-2 text-indigo text-sm font-semibold hover:opacity-70 transition-opacity">
              <Plus className="w-4 h-4" /> Post toevoegen
            </button>
          </div>
        );

      case 'disclaimer':
        return (
          <div>
            <Label>Voorwaarden (één punt per regel)</Label>
            <Textarea value={data.customDisclaimer} onChange={v => upd('customDisclaimer', v)} rows={8}
              placeholder={'Alle bedragen exclusief BTW\nAdvertentiebudget is extra\nOpzegtermijn 2 maanden'} />
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-5">
            <div>
              <Label>CTA tagline (na de bedrijfsnaam)</Label>
              <TextInput value={data.ctaText} onChange={v => upd('ctaText', v)} placeholder="is aan jou" />
              <p className="text-xs text-text-secondary mt-1.5">
                Wordt: "<strong>{data.clientName || 'De Next Play'}</strong> {data.ctaText || 'is aan jou'}"
              </p>
            </div>
          </div>
        );
    }
  };

  // ── Full Preview Modal ───────────────────────────────────────────────────────
  if (showFullPreview) {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-dark/90 backdrop-blur border border-white/10 px-6 py-3 rounded-full">
          <button onClick={() => setShowFullPreview(false)} className="text-white/70 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Terug naar editor
          </button>
          <div className="w-[1px] h-4 bg-white/20"></div>
          <button onClick={() => window.print()} className="bg-indigo text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-indigo-light transition-colors">
            <Download className="w-4 h-4" /> Download als PDF
          </button>
        </div>
        <div className="pt-20 pb-10 px-10 space-y-4">
          {SECTIONS.map(s => (
            <div key={s.id} className="pdf-slide">
              {renderSlide(data, s.slideIndex)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Split screen editor ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Top bar */}
      <header className="h-14 border-b border-warm-grey bg-white flex items-center px-6 gap-4 shrink-0 z-30 sticky top-0">
        <button onClick={() => navigate('/agensea-admin')} className="mr-3 flex items-center gap-1.5 px-3 py-1.5 hover:bg-warm-grey rounded-full transition-colors text-text-secondary hover:text-dark font-medium text-sm">
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </button>
        <div className="w-[1px] h-5 bg-warm-grey shrink-0 mr-3"></div>
        <div className="font-display font-bold text-lg tracking-tight text-dark flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-indigo text-white rounded-md flex items-center justify-center text-xs font-bold">Ag</div>
          Proposal Tool
        </div>
        <div className="w-[1px] h-5 bg-warm-grey shrink-0"></div>
        <span className="text-sm text-text-secondary font-medium truncate">{data.clientName || 'Nieuw voorstel'} — {data.proposalType}</span>
        <div className="ml-auto flex items-center gap-3 shrink-0">
          <div className="text-[11px] font-medium text-text-secondary flex items-center gap-1.5 mr-2">
            {isSaving ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Opslaan...</>
            ) : lastSaved ? (
              <><Check className="w-3.5 h-3.5 text-green-500" /> Opgeslagen om {lastSaved.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</>
            ) : null}
          </div>
          <button
            onClick={() => setShowFullPreview(true)}
            className="flex items-center gap-2 bg-white border border-warm-grey px-4 py-2 rounded-full text-sm font-semibold text-dark hover:border-indigo transition-colors"
          >
            <Eye className="w-4 h-4" /> Volledig voorstel
          </button>
          <button
            onClick={() => { setShowFullPreview(true); setTimeout(() => window.print(), 300); }}
            className="flex items-center gap-2 bg-indigo text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-light transition-colors shadow-lg shadow-indigo/20"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Left: Slide nav */}
        <aside className="w-52 shrink-0 border-r border-warm-grey bg-white overflow-y-auto py-4 hidden lg:block">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={clsx(
                'w-full text-left px-4 py-2.5 text-sm font-medium transition-colors border-l-2',
                activeSection === s.id
                  ? 'border-indigo text-indigo bg-indigo/5'
                  : 'border-transparent text-text-secondary hover:text-dark hover:bg-cream'
              )}
            >
              <span className="text-[10px] uppercase tracking-wider opacity-80 block mb-0.5">{s.slideLabel}</span>
              {s.title.replace(/^\d+\.\s*/, '')}
            </button>
          ))}
        </aside>

        {/* Center: Form */}
        <div className="flex-1 overflow-y-auto p-6 max-w-lg">
          {/* Mobile nav */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 lg:hidden">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={clsx(
                  'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                  activeSection === s.id ? 'bg-indigo text-white border-indigo' : 'bg-white border-warm-grey text-dark'
                )}
              >{s.slideLabel}</button>
            ))}
          </div>

          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-indigo font-bold mb-1">Slide {currentSection.slideIndex + 1} van {SECTIONS.length}</p>
            <h2 className="text-2xl font-display font-bold text-dark">{currentSection.title.replace(/^\d+\.\s*/, '')}</h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {renderForm()}
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next nav */}
          <div className="flex justify-between mt-10 pt-6 border-t border-warm-grey">
            {currentSection.slideIndex > 0 ? (
              <button
                onClick={() => setActiveSection(SECTIONS[currentSection.slideIndex - 1].id)}
                className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-dark transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Vorige
              </button>
            ) : <div />}
            {currentSection.slideIndex < SECTIONS.length - 1 ? (
              <button
                onClick={() => setActiveSection(SECTIONS[currentSection.slideIndex + 1].id)}
                className="flex items-center gap-2 bg-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-black transition-colors"
              >
                Volgende <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowFullPreview(true)}
                className="flex items-center gap-2 bg-indigo text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-light transition-colors"
              >
                Bekijk voorstel <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Live Slide Preview */}
        <div className="flex-1 bg-[#F7F6F3] border-l border-warm-grey overflow-y-auto p-8 hidden md:flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase tracking-widest text-text-secondary font-bold">
              Live Preview — Slide {currentSlideIndex + 1}: {currentSection.slideLabel}
            </p>
          </div>
          <SlideFrame>
            {renderSlide(data, currentSlideIndex)}
          </SlideFrame>

          {/* Thumbnail strip */}
          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-3">Alle slides</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={clsx(
                    'shrink-0 relative',
                    activeSection === s.id ? 'ring-2 ring-indigo rounded-lg' : 'opacity-80 hover:opacity-100 transition-opacity'
                  )}
                  style={{ width: '128px' }}
                >
                  <div className="relative rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                    <div className="absolute inset-0">
                      <div
                        className="absolute origin-top-left"
                        style={{ width: '1280px', height: '720px', transform: 'scale(0.1)', transformOrigin: 'top left' }}
                      >
                        <div className="w-[1280px] h-[720px]">
                          {renderSlide(data, s.slideIndex)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[9px] font-bold text-text-secondary text-center mt-1 uppercase tracking-wider">{s.slideLabel}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Print styles hidden HUD */}
      <style>{`
        @media print {
          header, aside, .no-print { display: none !important; }
          body { background: white; }
          .pdf-slide { 
            width: 297mm; 
            height: 210mm; 
            page-break-after: always; 
            page-break-inside: avoid;
            display: flex;
            flex-direction: column;
            position: relative;
          }
        }
      `}</style>
    </div>
  );
}
