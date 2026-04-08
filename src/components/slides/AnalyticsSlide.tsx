import { type ProposalData } from '../../types';
import { MeshBackground } from './MeshBackground';

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
      </div>

      <div className="flex-1 grid grid-cols-2 gap-5 content-start relative z-10">
        {data.analyticsTools.map((tool, i) => (
          <div
            key={tool}
            className="flex items-center gap-6 bg-white/60 backdrop-blur-xl px-8 py-6 rounded-[2rem] border border-white shadow-lg reveal"
            style={{ animationDelay: `${0.2 + i * 0.1}s` }}
          >
            <div className="w-12 h-12 rounded-xl bg-indigo/10 flex items-center justify-center shrink-0">
               <div className="w-5 h-5 rounded-sm bg-indigo transform rotate-45"></div>
            </div>
            <span className="font-display font-bold text-dark text-2xl tracking-tight">{tool}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
