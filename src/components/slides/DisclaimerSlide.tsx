import { type ProposalData } from '../../types';

export function DisclaimerSlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16 overflow-hidden">
      <div className="mesh-blob w-[600px] h-[600px] bg-indigo/10 -top-[10%] -left-[10%]" style={{ animationDelay: '0s' }}></div>
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.4em] text-indigo font-bold mb-4">Voorwaarden</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none">De kleine letters.</h2>
      </div>

      <div className="flex-1 relative z-10 grid grid-cols-2 gap-3 content-start reveal" style={{ animationDelay: '0.2s' }}>
        {data.customDisclaimer.split('\n').filter(Boolean).map((line, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-xl pl-5 pr-5 py-4 rounded-2xl border border-white shadow-md border-l-[3px] border-l-indigo">
            <span className="text-text-primary text-sm leading-relaxed">{line}</span>
          </div>
        ))}
      </div>

      <p className="absolute bottom-6 right-8 text-[10px] uppercase tracking-widest text-dark/20 font-bold font-display reveal">
        Agensea Media B.V. · {new Date().getFullYear()}
      </p>
    </div>
  );
}
