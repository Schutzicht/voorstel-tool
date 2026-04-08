import { type ProposalData } from '../../types';

export function DisclaimerSlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16 overflow-hidden">
      <div className="mesh-blob w-[600px] h-[600px] bg-indigo/10 -top-[10%] -left-[10%]" style={{ animationDelay: '0s' }}></div>
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.4em] text-indigo font-bold mb-4">Voorwaarden</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none">De kleine letters.</h2>
      </div>

      <div className="flex-1 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-12 border border-white shadow-xl flex flex-col justify-center relative z-10 reveal" style={{ animationDelay: '0.2s' }}>
        <ul className="grid grid-cols-2 gap-x-12 gap-y-6">
          {data.customDisclaimer.split('\n').filter(Boolean).map((line, i) => (
            <li key={i} className="flex gap-4 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo mt-2.5 shrink-0"></div>
              <span className="text-text-primary text-lg leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="absolute bottom-6 right-8 text-[10px] uppercase tracking-widest text-dark/20 font-bold font-display reveal">
        Agensea Media B.V. · {new Date().getFullYear()}
      </p>
    </div>
  );
}
