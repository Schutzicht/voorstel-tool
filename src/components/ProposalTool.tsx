import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProposal, saveProposal } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft,
  Check, Download, Eye, EyeOff, Loader2, Link, Settings2
} from 'lucide-react';
import clsx from 'clsx';
import {
  type ProposalData,
  type ProposalSignature,
  ANALYTICS_OPTIONS, getInitialData, DEFAULT_APPROACHES, migrateProposalData
} from '../types';
import { getSectionsForData } from './sections';
import { generateSlides } from './renderSlide';
import { ScaledSlide } from './ScaledSlide';
import { SlideErrorBoundary } from './SlideErrorBoundary';
import { exportPDF } from '../lib/pdfExport';
import OnboardingWizard from './OnboardingWizard';

// Forms
import { CoverForm } from './forms/CoverForm';
import { StaticSlideForm } from './forms/StaticSlideForm';
import { SituatieForm } from './forms/SituatieForm';
import { DoelenForm } from './forms/DoelenForm';
import { WerkwijzeForm } from './forms/WerkwijzeForm';
import { AdPlatformsForm } from './forms/AdPlatformsForm';
import { CheckboxGridForm } from './forms/CheckboxGridForm';
import { DienstenForm } from './forms/DienstenForm';
import { ContentForm } from './forms/ContentForm';
import { InvestmentForm } from './forms/InvestmentForm';
import { InvestmentOptionsForm } from './forms/InvestmentOptionsForm';
import { DisclaimerForm } from './forms/DisclaimerForm';
import { CTAForm } from './forms/CTAForm';

export default function ProposalTool() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<ProposalData>(getInitialData());
  const [signature, setSignature] = useState<ProposalSignature | null>(null);
  const [activeSection, setActiveSection] = useState<string>('cover');
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  const slides = useMemo(() => generateSlides(data, signature), [data, signature]);
  const sections = useMemo(() => getSectionsForData(data), [data]);

  // Fetch existing proposal
  useEffect(() => {
    if (id) {
      getProposal(id).then(res => {
        if (res) {
          setData(migrateProposalData(res.data));
          if (res.signature) setSignature(res.signature);
        }
      }).catch(console.error).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [id]);

  // Sync approach when proposal type changes
  const lastType = useRef(data.proposalType);
  if (lastType.current !== data.proposalType && data.onboardingCompleted) {
    const newApproach = DEFAULT_APPROACHES[data.proposalType] || DEFAULT_APPROACHES['Website'];
    setData(prev => ({ ...prev, approach: newApproach }));
    lastType.current = data.proposalType;
  }

  // Auto-save debounced (only after onboarding)
  useEffect(() => {
    if (!id || !data.onboardingCompleted) return;
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

  const sectionIndex = sections.findIndex(s => s.id === activeSection);
  const currentSection = sections[sectionIndex >= 0 ? sectionIndex : 0];
  const effectiveSectionIndex = sectionIndex >= 0 ? sectionIndex : 0;

  const previewSlide = slides.find(s => s.key === activeSection || s.key.startsWith(activeSection));

  const upd = useCallback(<K extends keyof ProposalData>(key: K, value: ProposalData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleService = (s: string) =>
    upd('services', data.services.includes(s) ? data.services.filter(x => x !== s) : [...data.services, s]);
  const toggleAnalytics = (s: string) =>
    upd('analyticsTools', data.analyticsTools.includes(s) ? data.analyticsTools.filter(x => x !== s) : [...data.analyticsTools, s]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      if (!showFullPreview) setShowFullPreview(true);
      await new Promise(r => setTimeout(r, 400));
      await exportPDF(data.clientName || 'Voorstel');
    } finally {
      setIsExporting(false);
    }
  };

  const handleOnboardingComplete = (generatedData: ProposalData) => {
    setData(generatedData);
    setActiveSection('cover');
    setShowWizard(false);
    if (id) {
      saveProposal(id, generatedData).then(() => setLastSaved(new Date())).catch(console.error);
    }
  };

  const toggleSlideVisibility = (slideKey: string) => {
    setData(prev => {
      const hidden = prev.hiddenSlides || [];
      const next = hidden.includes(slideKey)
        ? hidden.filter(k => k !== slideKey)
        : [...hidden, slideKey];
      return { ...prev, hiddenSlides: next };
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="animate-pulse w-16 h-16 bg-indigo/10 rounded-2xl flex items-center justify-center">
          <div className="font-display font-bold text-indigo text-xl">Ag</div>
        </div>
      </div>
    );
  }

  // Show onboarding wizard (new or reconfigure)
  if (!data.onboardingCompleted || showWizard) {
    return (
      <OnboardingWizard
        proposalId={id}
        existingData={data.onboardingCompleted ? data : undefined}
        onComplete={handleOnboardingComplete}
        onCancel={data.onboardingCompleted ? () => setShowWizard(false) : undefined}
      />
    );
  }

  // ── Form Sections ────────────────────────────────────────────────────────
  const renderForm = () => {
    switch (activeSection) {
      case 'cover':
        return <CoverForm data={data} proposalId={id} upd={upd} />;
      case 'agency':
      case 'partners':
        return <StaticSlideForm label={currentSection.slideLabel} description="Deze slide is standaard Agensea branding. Geen aanpassingen nodig." />;
      case 'team':
        return (
          <StaticSlideForm
            label="Ons Team"
            description="Deze slide toont de drie partners van Agensea. Geen aanpassingen nodig."
            icon={<svg className="w-8 h-8 text-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          />
        );
      case 'situatie':
        return <SituatieForm data={data} upd={upd} />;
      case 'doelen':
        return <DoelenForm data={data} upd={upd} />;
      case 'werkwijze':
        return <WerkwijzeForm data={data} upd={upd} />;
      case 'adplatforms':
        return <AdPlatformsForm data={data} upd={upd} />;
      case 'diensten':
        return <DienstenForm
          services={data.services}
          serviceDescriptions={data.serviceDescriptions || {}}
          onToggle={toggleService}
          onAdd={(s: string) => upd('services', [...data.services, s])}
          onRemove={(s: string) => { upd('services', data.services.filter(x => x !== s)); const descs = { ...data.serviceDescriptions }; delete descs[s]; upd('serviceDescriptions', descs); }}
          onDescriptionChange={(s: string, desc: string) => upd('serviceDescriptions', { ...data.serviceDescriptions, [s]: desc })}
        />;
      case 'analytics':
        return <CheckboxGridForm label="Tools & Tracking selecteren" options={ANALYTICS_OPTIONS} selected={data.analyticsTools} onToggle={toggleAnalytics} />;
      case 'content':
        return <ContentForm data={data} upd={upd} />;
      case 'eenmalig':
        return (
          <div className="space-y-4">
            <button
              onClick={() => {
                const next = !data.hasInvestmentOptions;
                setData(prev => ({
                  ...prev,
                  hasInvestmentOptions: next,
                  investmentOptions: next && prev.investmentOptions.length === 0
                    ? [
                        { id: 'a', name: 'Optie A', subtitle: '', description: '', oneTimeItems: [], monthlyItems: [] },
                        { id: 'b', name: 'Optie B', subtitle: '', description: '', oneTimeItems: [], monthlyItems: [] },
                      ]
                    : prev.investmentOptions,
                }));
              }}
              className="w-full text-left px-4 py-3 rounded-xl border border-warm-grey bg-white hover:border-indigo transition-colors flex items-center justify-between gap-2"
            >
              <div>
                <div className="text-sm font-bold text-dark">Bied klant 2 pakketten aan</div>
                <div className="text-xs text-text-secondary mt-0.5">Vergelijk twee opties op één slide. De klant kiest bij ondertekening.</div>
              </div>
              <div className={clsx('w-10 h-6 rounded-full transition-colors relative shrink-0', data.hasInvestmentOptions ? 'bg-indigo' : 'bg-warm-grey')}>
                <div className={clsx('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all', data.hasInvestmentOptions ? 'left-[18px]' : 'left-0.5')}></div>
              </div>
            </button>
            {!data.hasInvestmentOptions && (
              <InvestmentForm items={data.oneTimeItems} onChange={v => upd('oneTimeItems', v)} />
            )}
            {data.hasInvestmentOptions && (
              <p className="text-xs text-text-secondary italic">Opties-modus staat aan — bewerk de pakketten in het tabblad "Investering (opties)" links in het menu.</p>
            )}
          </div>
        );
      case 'maandelijks':
        return <InvestmentForm items={data.monthlyItems} onChange={v => upd('monthlyItems', v)} />;
      case 'investeringopties':
        return <InvestmentOptionsForm options={data.investmentOptions} onChange={v => upd('investmentOptions', v)} />;
      case 'disclaimer':
        return <DisclaimerForm data={data} upd={upd} />;
      case 'cta':
        return <CTAForm data={data} upd={upd} />;
      case 'mockups':
        return <StaticSlideForm label="Visueel Concept" description="Deze slide wordt automatisch gegenereerd op basis van het voorsteltype en de klantnaam." />;
    }
  };

  // ── Full Preview Modal ─────────────────────────────────────────────────────
  if (showFullPreview) {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-dark/90 backdrop-blur border border-white/10 px-6 py-3 rounded-full">
          <button onClick={() => setShowFullPreview(false)} className="text-white/70 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Terug naar editor
          </button>
          <div className="w-[1px] h-4 bg-white/20"></div>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-indigo text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-indigo-light transition-colors disabled:opacity-50"
          >
            {isExporting ? <><Loader2 className="w-4 h-4 animate-spin" /> Exporteren...</> : <><Download className="w-4 h-4" /> Download als PDF</>}
          </button>
        </div>
        <div className="pt-20 pb-10 px-4 md:px-12 lg:px-20 space-y-12 max-w-7xl mx-auto flex flex-col items-center">
          {slides.map((slide, i) => (
            <SlideErrorBoundary key={slide.key} slideIndex={i}>
              <ScaledSlide className="shadow-2xl rounded-2xl overflow-hidden" data-slide>
                {slide.node}
              </ScaledSlide>
            </SlideErrorBoundary>
          ))}
        </div>
      </div>
    );
  }

  // ── Split screen editor ─────────────────────────────────────────────────────
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
        {signature?.agreed && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-bold border border-green-500/20" title={`Ondertekend door ${signature.name} op ${signature.date}`}>
            <Check className="w-3 h-3" /> Ondertekend
          </span>
        )}
        <div className="ml-auto flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              const url = `${window.location.origin}/v/${id}`;
              navigator.clipboard.writeText(url);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-text-secondary hover:text-indigo hover:bg-indigo/5 transition-colors"
            title="Kopieer klant-link"
          >
            {copiedLink ? <><Check className="w-3.5 h-3.5 text-green-500" /> Gekopieerd</> : <><Link className="w-3.5 h-3.5" /> Deel link</>}
          </button>
          <div className="w-[1px] h-5 bg-warm-grey shrink-0"></div>
          <div className="text-[11px] font-medium text-text-secondary flex items-center gap-1.5 mr-2">
            {isSaving ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Opslaan...</>
            ) : lastSaved ? (
              <><Check className="w-3.5 h-3.5 text-green-500" /> Opgeslagen om {lastSaved.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</>
            ) : null}
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-text-secondary hover:text-indigo hover:bg-indigo/5 transition-colors"
            title="Diensten en opzet wijzigen"
          >
            <Settings2 className="w-3.5 h-3.5" /> Opzet
          </button>
          <div className="w-[1px] h-5 bg-warm-grey shrink-0"></div>
          <button
            onClick={() => setShowFullPreview(true)}
            className="flex items-center gap-2 bg-white border border-warm-grey px-4 py-2 rounded-full text-sm font-semibold text-dark hover:border-indigo transition-colors"
          >
            <Eye className="w-4 h-4" /> Volledig voorstel
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 bg-indigo text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-light transition-colors shadow-lg shadow-indigo/20 disabled:opacity-50"
          >
            {isExporting ? <><Loader2 className="w-4 h-4 animate-spin" /> Exporteren...</> : <><Download className="w-4 h-4" /> Download PDF</>}
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Left: Slide nav — dynamic based on data */}
        <aside className="w-52 shrink-0 border-r border-warm-grey bg-white overflow-y-auto py-4 hidden lg:block">
          {sections.map(s => {
            const isHidden = (data.hiddenSlides || []).includes(s.id);
            // These slides can't be hidden
            const canToggle = !['cover', 'agency', 'cta'].includes(s.id);
            return (
              <div key={s.id} className={clsx('flex items-center border-l-2 transition-colors', activeSection === s.id ? 'border-indigo bg-indigo/5' : 'border-transparent hover:bg-cream')}>
                <button
                  onClick={() => setActiveSection(s.id)}
                  className={clsx(
                    'flex-1 text-left px-4 py-2.5 text-sm font-medium transition-colors',
                    isHidden && 'opacity-40',
                    activeSection === s.id ? 'text-indigo' : 'text-text-secondary hover:text-dark'
                  )}
                >
                  <span className="text-[10px] uppercase tracking-wider opacity-80 block mb-0.5">{s.slideLabel}</span>
                  {s.title}
                </button>
                {canToggle && (
                  <button
                    onClick={() => toggleSlideVisibility(s.id)}
                    className="pr-3 text-text-secondary/40 hover:text-text-secondary transition-colors"
                    title={isHidden ? 'Slide tonen' : 'Slide verbergen'}
                  >
                    {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            );
          })}
        </aside>

        {/* Center: Form */}
        <div className="flex-1 overflow-y-auto p-6 max-w-lg">
          {/* Mobile nav */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 lg:hidden">
            {sections.map(s => (
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
            <p className="text-xs uppercase tracking-widest text-indigo font-bold mb-1">Sectie {effectiveSectionIndex + 1} van {sections.length}</p>
            <h2 className="text-2xl font-display font-bold text-dark">{currentSection.title}</h2>
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
            {effectiveSectionIndex > 0 ? (
              <button
                onClick={() => setActiveSection(sections[effectiveSectionIndex - 1].id)}
                className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-dark transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Vorige
              </button>
            ) : <div />}
            {effectiveSectionIndex < sections.length - 1 ? (
              <button
                onClick={() => setActiveSection(sections[effectiveSectionIndex + 1].id)}
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
              Live Preview — {currentSection.slideLabel}
            </p>
          </div>
          {previewSlide && (
            <ScaledSlide className="rounded-xl shadow-2xl border border-warm-grey overflow-hidden">
              {previewSlide.node}
            </ScaledSlide>
          )}

          {/* Thumbnail strip */}
          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-3">Alle slides ({slides.length})</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {slides.map(slide => (
                <button
                  key={slide.key}
                  onClick={() => {
                    const sectionId = slide.key.split('-')[0];
                    const match = sections.find(s => s.id === sectionId);
                    if (match) setActiveSection(match.id);
                  }}
                  className={clsx(
                    'shrink-0 relative',
                    activeSection === slide.key.split('-')[0] ? 'ring-2 ring-indigo rounded-lg' : 'opacity-80 hover:opacity-100 transition-opacity'
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
                          {slide.node}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[9px] font-bold text-text-secondary text-center mt-1 uppercase tracking-wider">{slide.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
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
