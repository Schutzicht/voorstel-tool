import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Copy, Check, Loader2, PenLine, CheckCircle2 } from 'lucide-react';
import type { ProposalData, ProposalSignature } from '../types';
import { migrateProposalData } from '../types';
import { getProposal, incrementViewCount, signProposal, supabase } from '../lib/supabase';
import { generateSlides } from './renderSlide';
import { ScaledSlide } from './ScaledSlide';
import { SlideErrorBoundary } from './SlideErrorBoundary';
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
  const [isSigning, setIsSigning] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);

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

  const slides = generateSlides(data);

  const handleSign = async () => {
    if (!id || !signName.trim() || !signAgreed) return;
    setIsSigning(true);
    try {
      const sig: ProposalSignature = {
        name: signName.trim(),
        date: new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }),
        agreed: true,
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
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-dark/90 backdrop-blur border border-white/10 px-6 py-3 rounded-full shadow-2xl no-print">
        <div className="flex bg-white/10 rounded-full px-4 py-1.5 shadow-inner">
           <span className="font-display font-bold text-white text-base">Agensea</span>
           <span className="text-white/40 mx-2">/</span>
           <span className="font-medium text-white/80 text-sm truncate max-w-[150px]">{data.clientName || 'Voorstel'}</span>
        </div>
        <div className="w-[1px] h-4 bg-white/20"></div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="text-white/70 hover:text-white px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
        >
          {copied ? <><Check className="w-4 h-4 text-green-400" /> Gekopieerd</> : <><Copy className="w-4 h-4" /> Link delen</>}
        </button>
        <div className="w-[1px] h-4 bg-white/20"></div>
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="bg-indigo text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-indigo-light transition-colors transform hover:scale-105 active:scale-95 duration-200 disabled:opacity-50 disabled:transform-none"
        >
          {isExporting ? <><Loader2 className="w-4 h-4 animate-spin" /> Exporteren...</> : <><Download className="w-4 h-4" /> Opslaan als PDF</>}
        </button>
      </div>

      {/* Slides */}
      <div className="pt-24 pb-16 px-4 md:px-12 lg:px-20 space-y-12 max-w-7xl mx-auto flex flex-col items-center">
        {slides.map((slide, i) => (
          <SlideErrorBoundary key={slide.key} slideIndex={i}>
            <ScaledSlide className="shadow-2xl rounded-2xl overflow-hidden print-w-auto print-shadow-none" data-slide>
              {slide.node}
            </ScaledSlide>
          </SlideErrorBoundary>
        ))}

        {/* Ondertekenen */}
        <div id="ondertekenen" className="w-full max-w-2xl no-print scroll-mt-32">
          {signSuccess && signature ? (
            <div className="bg-green-500/10 border border-green-500/20 backdrop-blur rounded-2xl p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-display font-bold text-white text-2xl mb-2">Voorstel ondertekend</h3>
              <p className="text-white/60 text-sm">
                Ondertekend door <span className="text-white font-medium">{signature.name}</span> op {signature.date}
              </p>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <PenLine className="w-6 h-6 text-indigo" />
                <h3 className="font-display font-bold text-white text-2xl">Akkoord? Teken hier.</h3>
              </div>
              <p className="text-white/50 text-sm mb-6">
                Door te ondertekenen ga je akkoord met het voorstel en de genoemde voorwaarden.
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  value={signName}
                  onChange={e => setSignName(e.target.value)}
                  placeholder="Je volledige naam"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-indigo transition-colors"
                />
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
                  disabled={!signName.trim() || !signAgreed || isSigning}
                  className="w-full py-3.5 rounded-xl bg-indigo text-white font-display font-bold text-base hover:bg-indigo-light transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSigning ? <><Loader2 className="w-4 h-4 animate-spin" /> Ondertekenen...</> : 'Voorstel ondertekenen'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky onderteken knop */}
      {!signSuccess && (
        <button
          onClick={() => document.getElementById('ondertekenen')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          className="fixed bottom-8 right-8 z-50 bg-indigo text-white px-6 py-4 rounded-full font-display font-bold text-base shadow-2xl shadow-indigo/40 hover:bg-indigo-light hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 no-print"
        >
          <PenLine className="w-5 h-5" />
          Voorstel ondertekenen
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
