import { type ProposalData } from '../../types';
import { MeshBackground } from './MeshBackground';
import { SlideFooter } from './SlideFooter';

export function CoverSlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide slide-cover bg-[#FAF9F6] relative overflow-hidden flex flex-col p-16">
      <MeshBackground />

      {/* Top: Agensea wordmark */}
      <div className="flex justify-between items-start relative z-10">
        <img
          src="/brand/Agensea%20logo.svg"
          alt="Agensea"
          width="400"
          height="400"
          className="h-10 w-auto"
        />
        {data.clientLogo && (
          <div className="backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-sm transition-all">
            <img src={data.clientLogo} alt="Client logo" style={{ height: `${data.logoScale ?? 48}px` }} className="object-contain" />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center max-w-[85%] relative z-10">
        <div className="reveal" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-[5.5rem] font-display font-bold leading-[1.05] tracking-tight text-dark mb-8">
            {data.clientName || 'Onze Klant'}
          </h1>
        </div>
        <div className="reveal" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-[3.8rem] font-display font-bold leading-tight text-dark flex items-center gap-6">
            <span className="text-indigo">{data.proposalType}</span>
            <span className="text-indigo opacity-30 text-5xl">↘</span>
          </h2>
        </div>
      </div>

      {/* Bottom stamps */}
      <div className="flex justify-between items-end relative z-10">
        <div className="reveal" style={{ animationDelay: '0.5s' }}>
          <p className="text-[11px] uppercase tracking-[0.2em] text-text-secondary font-bold mb-3 opacity-80">Opgesteld door</p>
          <div className="flex items-center gap-4">
             <p className="font-display font-bold text-2xl text-dark">Agensea</p>
             <div className="w-8 h-[2px] bg-indigo opacity-50"></div>
             <p className="font-display font-bold text-2xl text-dark opacity-60">{data.clientName || 'Klant'}</p>
          </div>
        </div>
        <div className="text-right reveal" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-text-secondary font-semibold bg-white/50 backdrop-blur px-4 py-2 rounded-full border border-warm-grey/30">
            {data.proposalDate}
          </p>
        </div>
      </div>
      <SlideFooter />
    </div>
  );
}
