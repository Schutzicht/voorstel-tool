import { type ProposalData } from '../../types';
import { MeshBackground } from './MeshBackground';
import { SlideFooter } from './SlideFooter';

export function MaandelijksSlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-12 overflow-hidden">
      <MeshBackground />
      <div className="mb-6 relative z-10 reveal shrink-0">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-3">Financieel</p>
        <h2 className="text-5xl font-display font-bold text-dark tracking-tight leading-none">Maandelijkse investering.</h2>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-white bg-white/40 backdrop-blur-3xl shadow-2xl relative z-10 reveal flex flex-col" style={{ animationDelay: '0.2s' }}>
        <table className="w-full">
          <thead className="shrink-0">
            <tr className="bg-indigo text-white">
              <th className="text-left px-8 py-4 font-display font-bold text-xs uppercase tracking-widest">Service</th>
              <th className="text-right px-8 py-4 font-display font-bold text-xs uppercase tracking-widest">Prijs /mnd</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark/5">
            {data.monthlyItems.map((item) => {
              const isTotal = item.description.toLowerCase().includes('totaal');
              return (
                <tr key={item.id} className={`${isTotal ? 'bg-indigo/5' : ''} transition-colors hover:bg-indigo/[0.02]`}>
                  <td className={`px-8 py-3 text-dark ${isTotal ? 'font-display font-bold text-xl' : 'text-base font-medium'}`}>
                    {item.description}
                  </td>
                  <td className={`px-8 py-3 text-right font-display font-bold text-indigo ${isTotal ? 'text-2xl' : 'text-lg'}`}>
                    {item.agenseaPrice}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <SlideFooter />
    </div>
  );
}
