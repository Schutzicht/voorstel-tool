import { type ProposalData, type ProposalSignature } from '../../types';
import { MeshBackground } from './MeshBackground';

export function CTASlide({ data, signature }: { data: ProposalData; signature?: ProposalSignature | null }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16 overflow-hidden">
      <MeshBackground />

      <div className="flex justify-between items-start relative z-10 reveal">
        <img
          src="/brand/Agensea%20logo.svg"
          alt="Agensea"
          width="400"
          height="400"
          className="h-10 w-auto"
        />
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
        {signature?.agreed && signature.signatureImage ? (
          <div className="flex flex-col items-end">
            <p className="text-[10px] uppercase tracking-widest text-indigo font-bold mb-1">Akkoord — {signature.date}</p>
            <div className="bg-white/60 backdrop-blur rounded-xl px-4 py-2 border border-indigo/20">
              <img src={signature.signatureImage} alt="Handtekening" className="h-12 object-contain" style={{ filter: 'invert(1)' }} />
            </div>
            <p className="text-xs font-display font-bold text-dark mt-1">{signature.name}</p>
            {signature.selectedOptionName && (
              <p className="text-[10px] uppercase tracking-widest text-indigo font-bold mt-1">Gekozen: {signature.selectedOptionName}</p>
            )}
          </div>
        ) : data.clientLogo && (
           <img src={data.clientLogo} alt="Client logo" style={{ height: `${data.logoScale ?? 48}px` }} className="object-contain opacity-40 grayscale" />
        )}
      </div>
    </div>
  );
}
