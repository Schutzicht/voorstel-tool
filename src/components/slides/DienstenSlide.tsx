import { type ProposalData, SERVICE_DESCRIPTIONS } from '../../types';
import { MeshBackground } from './MeshBackground';

export function DienstenSlide({ data }: { data: ProposalData }) {
  const services = data.services;
  const count = services.length;
  // 1-3 items: single column, 4+: two columns
  const useTwoColumns = count >= 4;

  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16">
      <MeshBackground />
      <div className="mb-10 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Scope</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none">Wat we gaan doen.</h2>
      </div>

      <div className={`flex-1 relative z-10 grid gap-4 content-start ${useTwoColumns ? 'grid-cols-2' : 'grid-cols-1 max-w-2xl'}`}>
        {services.map((s, i) => {
          const desc = data.serviceDescriptions?.[s] || SERVICE_DESCRIPTIONS[s];
          return (
            <div
              key={s}
              className="flex gap-4 bg-white/60 backdrop-blur-xl px-6 py-5 rounded-2xl border border-white shadow-md reveal"
              style={{ animationDelay: `${0.2 + i * 0.05}s` }}
            >
              <div className="w-8 h-8 rounded-full bg-indigo text-white flex items-center justify-center font-display font-bold text-sm shrink-0 mt-0.5 shadow-lg shadow-indigo/20">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-bold text-dark text-lg tracking-tight leading-tight">{s}</h4>
                {desc && <p className="text-text-secondary text-sm leading-relaxed mt-1">{desc}</p>}
              </div>
            </div>
          );
        })}
        {count === 0 && (
          <p className="text-text-secondary text-lg self-center mx-auto opacity-70 col-span-full">Geen diensten geselecteerd.</p>
        )}
      </div>
    </div>
  );
}
