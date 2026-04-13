import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Copy, Check, Loader2, PenLine, CheckCircle2, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProposalData, ProposalSignature } from '../types';
import { migrateProposalData } from '../types';
import { getProposal, incrementViewCount, signProposal, supabase } from '../lib/supabase';
import { generateSlides } from './renderSlide';
import { ScaledSlide } from './ScaledSlide';
import { SlideErrorBoundary } from './SlideErrorBoundary';
import { SignaturePad } from './SignaturePad';
import { exportPDF } from '../lib/pdfExport';

export default function ProposalViewer() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [signature, setSignature] = useState<ProposalSignature | null>(null);
  const [signName, setSignName] = useState('');
  const [signAgreed, setSignAgreed] = useState(false);
  const [signImage, setSignImage] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [isSigning, setIsSigning] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetch() {
      if (!id) return;
      try {
        const saved = await getProposal(id);
        if (saved) {
          setData(migrateProposalData(saved.data));
          if (saved.signature) { setSignature(saved.signature); setSignSuccess(true); }
          incrementViewCount(id).catch(console.error);
        } else {
          setError(true);
        }
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetch();

    if (id) {
      const channel = supabase.channel(`proposal_${id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'proposals', filter: `id=eq.${id}` }, (payload) => {
          if (payload.new && payload.new.data) {
             setData(migrateProposalData(payload.new.data as ProposalData));
          }
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [id]);

  useEffect(() => {
    if (expandedIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedIndex(null);
      if (e.key === 'ArrowRight') setExpandedIndex(i => (i !== null ? i + 1 : i));
      if (e.key === 'ArrowLeft') setExpandedIndex(i => (i !== null && i > 0 ? i - 1 : i));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [expandedIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="animate-pulse w-16 h-16 bg-indigo/10 rounded-2xl flex items-center justify-center">
          <div className="font-display font-bold text-indigo text-xl">Ag</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-center p-8">
        <h1 className="text-3xl font-display font-bold text-dark mb-4">Voorstel niet gevonden.</h1>
        <p className="text-text-secondary">De link kan ongeldig zijn of het voorstel is verwijderd door Agensea.</p>
      </div>
    );
  }

  const slides = generateSlides(data, signature);

  const hasOptions = data?.hasInvestmentOptions && (data?.investmentOptions?.length ?? 0) > 0;

  const handleSign = async () => {
    if (!id || !signName.trim() || !signAgreed || !signImage) return;
    if (hasOptions && !selectedOptionId) return;
    setIsSigning(true);
    try {
      const chosenOption = hasOptions ? data?.investmentOptions.find(o => o.id === selectedOptionId) : null;
      const sig: ProposalSignature = {
        name: signName.trim(),
        date: new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }),
        agreed: true,
        signatureImage: signImage,
        ...(chosenOption ? { selectedOptionId: chosenOption.id, selectedOptionName: chosenOption.name + (chosenOption.subtitle ? ` — ${chosenOption.subtitle}` : '') } : {}),
      };
      await signProposal(id, sig);
      setSignature(sig);
      setSignSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSigning(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportPDF(data.clientName || 'Voorstel');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative">
      {/* Client HUD */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 sm:gap-3 bg-dark/90 backdrop-blur border border-white/10 px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-2xl no-print max-w-[calc(100vw-1rem)]">
        <div className="flex items-center bg-white/10 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 shadow-inner min-w-0">
           <span className="font-display font-bold text-white text-sm sm:text-base shrink-0">Agensea</span>
           <span className="text-white/40 mx-1.5 sm:mx-2 shrink-0">/</span>
           <span className="font-medium text-white/80 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px]">{data.clientName || 'Voorstel'}</span>
        </div>
        <div className="w-[1px] h-4 bg-white/20 hidden sm:block"></div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="text-white/70 hover:text-white p-2 sm:px-3 sm:py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors shrink-0"
          title="Link delen"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          <span className="hidden sm:inline">{copied ? 'Gekopieerd' : 'Link delen'}</span>
        </button>
        <div className="w-[1px] h-4 bg-white/20 hidden sm:block"></div>
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="bg-indigo text-white p-2 sm:px-5 sm:py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-indigo-light transition-colors disabled:opacity-50 shrink-0"
          title="Opslaan als PDF"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span className="hidden sm:inline">{isExporting ? 'Exporteren...' : 'PDF'}</span>
        </button>
      </div>

      {/* Slides */}
      <div className="pt-20 sm:pt-24 pb-24 sm:pb-16 px-3 sm:px-8 md:px-12 lg:px-20 space-y-6 sm:space-y-12 max-w-7xl mx-auto flex flex-col items-center">
        {slides.map((slide, i) => (
          <SlideErrorBoundary key={slide.key} slideIndex={i}>
            <div className="relative w-full group">
              <ScaledSlide className="shadow-2xl rounded-2xl overflow-hidden print-w-auto print-shadow-none" data-slide>
                {slide.node}
              </ScaledSlide>
              <button
                onClick={() => setExpandedIndex(i)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-dark/70 hover:bg-dark backdrop-blur text-white p-2 rounded-full shadow-lg transition-all sm:opacity-0 sm:group-hover:opacity-100 no-print z-10"
                title="Vergroten"
                aria-label="Slide vergroten"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </SlideErrorBoundary>
        ))}

        {/* Ondertekenen */}
        <div id="ondertekenen" className="w-full max-w-2xl no-print scroll-mt-32">
          {signSuccess && signature ? (
            <div className="bg-green-500/10 border border-green-500/20 backdrop-blur rounded-2xl p-6 sm:p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-display font-bold text-white text-2xl mb-2">Voorstel ondertekend</h3>
              <p className="text-white/60 text-sm mb-2">
                Ondertekend door <span className="text-white font-medium">{signature.name}</span> op {signature.date}
              </p>
              {signature.selectedOptionName && (
                <p className="text-white/60 text-sm mb-4">
                  Gekozen pakket: <span className="text-indigo font-medium">{signature.selectedOptionName}</span>
                </p>
              )}
              {signature.signatureImage && (
                <div className="bg-white/5 rounded-xl p-4 inline-block">
                  <img src={signature.signatureImage} alt="Handtekening" className="h-20 object-contain" />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <PenLine className="w-6 h-6 text-indigo" />
                <h3 className="font-display font-bold text-white text-2xl">Akkoord? Teken hier.</h3>
              </div>
              <p className="text-white/50 text-sm mb-6">
                Door te ondertekenen ga je akkoord met het voorstel en de genoemde voorwaarden.
              </p>
              <div className="space-y-4">
                {hasOptions && (
                  <div className="space-y-2">
                    <p className="text-white/60 text-xs uppercase tracking-widest font-bold">Kies je pakket</p>
                    <div className="grid gap-2">
                      {data.investmentOptions.map((opt, idx) => {
                        const active = selectedOptionId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedOptionId(opt.id)}
                            className={`text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${active ? 'border-indigo bg-indigo/15' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                          >
                            <span className={`w-7 h-7 rounded-lg font-display font-bold text-sm flex items-center justify-center shrink-0 ${active ? 'bg-indigo text-white' : 'bg-white/10 text-white/70'}`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="text-white text-sm font-bold truncate">{opt.name}</div>
                              {opt.subtitle && <div className="text-white/50 text-xs truncate">{opt.subtitle}</div>}
                            </div>
                            {active && <Check className="w-4 h-4 text-indigo shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <input
                  type="text"
                  value={signName}
                  onChange={e => setSignName(e.target.value)}
                  placeholder="Je volledige naam"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-indigo transition-colors"
                />
                <SignaturePad onChange={setSignImage} />
                <label className="flex items-start gap-3 cursor-pointer group">
                  <button
                    onClick={() => setSignAgreed(!signAgreed)}
                    className={`w-5 h-5 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-all ${signAgreed ? 'bg-indigo border-indigo' : 'border-white/20 group-hover:border-white/40'}`}
                  >
                    {signAgreed && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <span className="text-white/70 text-sm leading-relaxed">
                    Ik ga akkoord met dit voorstel en de bijbehorende voorwaarden van Agensea.
                  </span>
                </label>
                <button
                  onClick={handleSign}
                  disabled={!signName.trim() || !signAgreed || !signImage || (hasOptions && !selectedOptionId) || isSigning}
                  className="w-full py-3.5 rounded-xl bg-indigo text-white font-display font-bold text-base hover:bg-indigo-light transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSigning ? <><Loader2 className="w-4 h-4 animate-spin" /> Ondertekenen...</> : 'Voorstel ondertekenen'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen slide modal */}
      {expandedIndex !== null && slides[expandedIndex] && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col no-print" onClick={() => setExpandedIndex(null)}>
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 text-white shrink-0" onClick={e => e.stopPropagation()}>
            <div className="text-sm font-medium text-white/60">
              Slide <span className="text-white font-bold">{expandedIndex + 1}</span> / {slides.length}
              <span className="hidden sm:inline text-white/40 ml-2">— {slides[expandedIndex].label}</span>
            </div>
            <button
              onClick={() => setExpandedIndex(null)}
              className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors"
              aria-label="Sluiten"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Slide */}
          <div className="flex-1 min-h-0 flex items-center justify-center px-2 sm:px-16 pb-4" onClick={e => e.stopPropagation()}>
            <div className="w-full max-w-[min(100%,calc((100vh-10rem)*1.7778))]">
              <ScaledSlide className="shadow-2xl rounded-xl overflow-hidden">
                {slides[expandedIndex].node}
              </ScaledSlide>
            </div>
          </div>

          {/* Nav bar */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 px-4 py-4 shrink-0" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setExpandedIndex(i => (i !== null && i > 0 ? i - 1 : i))}
              disabled={expandedIndex === 0}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Vorige slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-white/60 text-xs sm:text-sm font-medium min-w-[80px] text-center">
              {expandedIndex + 1} / {slides.length}
            </div>
            <button
              onClick={() => setExpandedIndex(i => (i !== null && i < slides.length - 1 ? i + 1 : i))}
              disabled={expandedIndex === slides.length - 1}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Volgende slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Sticky onderteken knop */}
      {!signSuccess && (
        <button
          onClick={() => document.getElementById('ondertekenen')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 bg-indigo text-white px-5 py-3 sm:px-6 sm:py-4 rounded-full font-display font-bold text-sm sm:text-base shadow-2xl shadow-indigo/40 hover:bg-indigo-light active:scale-95 transition-all flex items-center gap-2 sm:gap-2.5 no-print"
        >
          <PenLine className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Voorstel ondertekenen</span>
          <span className="sm:hidden">Ondertekenen</span>
        </button>
      )}

      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body, html {
            background: #FAF9F6 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
          .min-h-screen { min-height: auto !important; background: transparent !important; }
          .pt-24.pb-16.px-4 { padding: 0 !important; margin: 0 !important; max-width: none !important; }
          .space-y-12 > * + * { margin-top: 0 !important; }

          .print-w-auto {
            width: 297mm !important;
            height: 210mm !important;
            padding-bottom: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            break-after: always;
            break-inside: avoid;
            page-break-after: always;
            page-break-inside: avoid;
          }

          .print-w-auto > div.absolute {
            position: relative !important;
            width: 297mm !important;
            height: 210mm !important;
          }

          .print-w-auto [style*="scale"] {
            transform: scale(0.877) !important;
            transform-origin: top left !important;
            width: 1280px !important;
            height: 720px !important;
           }

          .pdf-slide {
            width: 1280px !important;
            height: 720px !important;
          }
        }
      `}</style>
    </div>
  );
}
