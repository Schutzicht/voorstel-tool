import { type ProposalData } from '../../types';
import { MeshBackground } from './MeshBackground';

export function ContentSlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16">
      <MeshBackground />
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Samenwerking</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none">Wie levert wat aan?</h2>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-8 relative z-10">
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white shadow-xl reveal" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-dark/10 flex items-center justify-center font-display font-bold text-sm text-dark/60">
              {data.clientName ? data.clientName[0] : 'K'}
            </div>
            <h3 className="font-display font-bold text-dark text-2xl">{data.clientName || 'Klant'}</h3>
          </div>
          <ul className="space-y-4">
            {data.contentByClient.split('\n').filter(Boolean).map((line, i) => (
              <li key={i} className="flex gap-4 items-start group">
                <span className="text-dark/20 font-bold mt-1.5">—</span>
                <span className="text-text-primary text-base leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-indigo/20 shadow-xl reveal" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo flex items-center justify-center font-display font-bold text-sm text-white">
              Ag
            </div>
            <h3 className="font-display font-bold text-indigo text-2xl">Agensea</h3>
          </div>
          <ul className="space-y-4 font-medium">
            {data.contentByAgensea.split('\n').filter(Boolean).map((line, i) => (
              <li key={i} className="flex gap-4 items-start group">
                <span className="text-indigo font-bold mt-1.5">↗</span>
                <span className="text-text-primary text-base leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
