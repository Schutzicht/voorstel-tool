import { type ProposalData } from '../../types';
import { MeshBackground } from './MeshBackground';
import { SlideFooter } from './SlideFooter';

export function AnalyticsSlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16">
      <MeshBackground />
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Inzicht</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-[1.1]">
          Meten is weten.<br />
          <span className="text-indigo text-[3rem]">Data-gedreven beslissingen.</span>
        </h2>
        <p className="text-text-secondary text-lg leading-relaxed mt-4 max-w-xl">We koppelen de juiste tools zodat je precies kunt zien wat werkt en waar de kansen liggen. Geen onderbuikgevoel, maar heldere cijfers.</p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 content-start relative z-10">
        {data.analyticsTools.map((tool, i) => (
          <div
            key={tool}
            className="bg-white/60 backdrop-blur-xl pl-6 pr-6 py-5 rounded-2xl border border-white shadow-md border-l-[3px] border-l-indigo reveal"
            style={{ animationDelay: `${0.2 + i * 0.1}s` }}
          >
            <span className="font-display font-bold text-dark text-xl tracking-tight">{tool}</span>
          </div>
        ))}
      </div>
      <SlideFooter />
    </div>
  );
}
