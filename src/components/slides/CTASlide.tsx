import { type ProposalData } from '../../types';
import { MeshBackground } from './MeshBackground';

export function CTASlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16 overflow-hidden">
      <MeshBackground />

      <div className="flex justify-between items-start relative z-10 reveal">
        <div className="font-display text-3xl font-bold tracking-tight text-dark">
          agensea<span className="text-indigo">.</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="reveal" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-[6.5rem] font-display font-bold leading-none tracking-tighter text-dark mb-4">
            {data.clientName || 'De bal'}
          </h1>
        </div>
        <div className="reveal" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-[5.5rem] font-display font-bold leading-none tracking-tighter text-indigo flex items-center gap-8">
            {data.ctaText || 'is aan jou'}
            <span className="text-6xl animate-bounce-slow">↘</span>
          </h2>
        </div>
      </div>

      <div className="flex justify-between items-end pt-12 border-t border-dark/5 mt-auto relative z-10 reveal" style={{ animationDelay: '0.6s' }}>
        <div className="grid grid-cols-3 gap-16">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-2">Email</p>
            <p className="text-lg font-display font-bold text-dark">info@agensea.nl</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-2">Telefoon</p>
            <p className="text-lg font-display font-bold text-dark">+31 6 81 38 36 01</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-2">Web</p>
            <p className="text-lg font-display font-bold text-dark">agensea.nl</p>
          </div>
        </div>
        {data.clientLogo && (
           <img src={data.clientLogo} alt="Client logo" style={{ height: `${data.logoScale ?? 48}px` }} className="object-contain opacity-40 grayscale" />
        )}
      </div>
    </div>
  );
}
