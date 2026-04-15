import { type ProposalData } from '../../types';
import { MeshBackground } from './MeshBackground';
import { SlideFooter } from './SlideFooter';

export function SituatieSlide({ data }: { data: ProposalData }) {
  const current = data.currentSituation || 'Geen eigen platform aanwezig\nBeperkte online zichtbaarheid\nHandmatige processen';
  const kansen = data.opportunities || 'Groeiende markt / niche\nLage concurrentie online\nSchaalbare digitale oplossing mogelijk';

  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16">
      <MeshBackground />
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Analyse</p>
        <h2 className="text-[3.2rem] font-display font-bold text-dark tracking-tight leading-none">
          Waar staan we nu?
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-8 flex-1 relative z-10">
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white shadow-xl reveal" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-dark/10 flex items-center justify-center text-dark/70 font-bold">—</div>
            <h3 className="font-display font-bold text-dark text-2xl">De Uitdaging</h3>
          </div>
          <ul className="space-y-4">
            {current.split('\n').filter(Boolean).map((line, i) => (
              <li key={i} className="flex gap-4 items-start group">
                <span className="text-indigo/50 font-bold mt-1.5 group-hover:text-indigo transition-colors opacity-0 group-hover:opacity-100">↗</span>
                <span className="text-text-primary text-base leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-indigo/5 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-indigo/10 shadow-xl reveal" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo text-white flex items-center justify-center font-bold">↗</div>
            <h3 className="font-display font-bold text-dark text-2xl">De Kansen</h3>
          </div>
          <ul className="space-y-4">
            {kansen.split('\n').filter(Boolean).map((line, i) => (
              <li key={i} className="flex gap-4 items-start group">
                <span className="text-indigo font-bold mt-1.5">↗</span>
                <span className="text-text-primary text-base leading-relaxed font-medium">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <SlideFooter />
    </div>
  );
}
