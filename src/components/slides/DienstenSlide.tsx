import { type ProposalData } from '../../types';
import { MeshBackground } from './MeshBackground';

export function DienstenSlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16">
      <MeshBackground />
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Scope</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none">Wat we gaan doen.</h2>
      </div>

      <div className="flex-1 flex flex-wrap gap-4 content-start relative z-10">
        {data.services.map((s, i) => (
          <div
            key={s}
            className="flex items-center gap-4 bg-white/60 backdrop-blur-xl px-8 py-5 rounded-2xl border border-white shadow-md reveal"
            style={{ animationDelay: `${0.2 + i * 0.05}s` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-indigo shrink-0"></div>
            <span className="font-display font-bold text-dark text-xl tracking-tight">{s}</span>
          </div>
        ))}
        {data.services.length === 0 && (
          <p className="text-text-secondary text-lg self-center mx-auto opacity-70">Geen diensten geselecteerd.</p>
        )}
      </div>
    </div>
  );
}
