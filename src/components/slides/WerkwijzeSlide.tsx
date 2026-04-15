import { type ProposalData } from '../../types';
import { MeshBackground } from './MeshBackground';
import { SlideFooter } from './SlideFooter';

export function WerkwijzeSlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16">
      <MeshBackground />
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Onze Aanpak</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none">Hoe we het doen.</h2>
      </div>

      <div className="flex-1 flex items-center relative z-10">
        <div className="w-full flex gap-4">
          {data.approach.map((step, i) => (
            <div
              key={step.id}
              className="flex-1 bg-white/50 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-lg flex flex-col items-center text-center reveal"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-indigo text-white flex items-center justify-center font-display font-bold text-lg mb-6 shrink-0 shadow-lg shadow-indigo/20">
                {i + 1}
              </div>
              <h4 className="font-display font-bold text-dark text-xl mb-3 leading-tight tracking-tight">{step.phase}</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter />
    </div>
  );
}
