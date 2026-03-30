import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import type { ProposalData } from '../types';
import { getProposal, incrementViewCount, supabase } from '../lib/supabase';
import {
  CoverSlide, AgencySlide, ClientMarqueeSlide, SituatieSlide, DoelSlide, AboutTeamSlide, WerkwijzeSlide,
  AdPlatformsSlide, DienstenSlide, AnalyticsSlide, ContentSlide, EenmaligeInvesteringSlide,
  MaandelijksSlide, DisclaimerSlide, CTASlide
} from './Slides';

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
    case 10: return <ContentSlide data={data} />;
    case 11: return <EenmaligeInvesteringSlide data={data} />;
    case 12: return <MaandelijksSlide data={data} />;
    case 13: return <DisclaimerSlide data={data} />;
    case 14: return <CTASlide data={data} />;
    default: return null;
  }
}

export default function ProposalViewer() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetch() {
      if (!id) return;
      try {
        const saved = await getProposal(id);
        if (saved) {
          setData(saved.data);
          // Increment view count in the background
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

    // Set up realtime sync for changes
    if (id) {
      const channel = supabase.channel(`proposal_${id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'proposals', filter: `id=eq.${id}` }, (payload) => {
          if (payload.new && payload.new.data) {
             setData(payload.new.data as ProposalData);
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

  const slidesCount = 15; // Total number of slides

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
          onClick={() => window.print()} 
          className="bg-indigo text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-indigo-light transition-colors transform hover:scale-105 active:scale-95 duration-200"
        >
          <Download className="w-4 h-4" /> Opslaan als PDF
        </button>
      </div>

      {/* Slide Container automatically formats to A4 Landscape in print */}
      <div className="pt-24 pb-16 px-4 md:px-12 lg:px-20 space-y-12 max-w-7xl mx-auto flex flex-col items-center">
        {Array.from({ length: slidesCount }).map((_, i) => (
          <div 
            key={i} 
            className="w-full relative shadow-2xl rounded-2xl overflow-hidden print-w-auto print-shadow-none"
            style={{ paddingBottom: '56.25%' }} // 16:9 Aspect Ratio
          >
            <div className="absolute inset-0 bg-[#FAF9F6]">
              {/* Internal scaling container */}
              <div 
                className="w-[1280px] h-[720px] origin-top-left absolute"
                ref={(el) => {
                  if (el && el.parentElement) {
                    const updateScale = () => {
                      const container = el.parentElement;
                      if (!container) return;
                      const scale = container.offsetWidth / 1280;
                      el.style.transform = `scale(${scale})`;
                      el.style.width = `1280px`;
                      el.style.height = `720px`;
                    };
                    updateScale();
                    // Attach resize observer natively
                    const ro = new ResizeObserver(updateScale);
                    ro.observe(el.parentElement);
                  }
                }}
              >
                <div className="pdf-slide w-full h-full relative" style={{ width: '1280px', height: '720px' }}>
                  {renderSlide(data, i)}
                </div>
              </div>
            </div>
          </div>
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
          
          /* Target the wrapper that has paddingBottom 56.25% */
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

          /* Force exact dimensions on inner containers */
          .print-w-auto > div.absolute {
            position: relative !important;
            width: 297mm !important;
            height: 210mm !important;
          }

          /* Scale content precisely to fit A4 Landscape */
          .print-w-auto [style*="scale"] {
            transform: scale(0.877) !important; /* 297mm ≈ 1122px. 1122 / 1280 ≈ 0.877 */
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
