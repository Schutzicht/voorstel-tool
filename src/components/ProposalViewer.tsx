import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Copy, Check, Loader2 } from 'lucide-react';
import type { ProposalData } from '../types';
import { migrateProposalData } from '../types';
import { getProposal, incrementViewCount, supabase } from '../lib/supabase';
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

  useEffect(() => {
    async function fetch() {
      if (!id) return;
      try {
        const saved = await getProposal(id);
        if (saved) {
          setData(migrateProposalData(saved.data));
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
      </div>

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
