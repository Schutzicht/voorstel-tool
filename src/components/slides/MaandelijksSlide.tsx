import { type ProposalData } from '../../types';
import { MeshBackground } from './MeshBackground';

export function MaandelijksSlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16">
      <MeshBackground />
      <div className="mb-10 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Financieel</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none">Maandelijkse investering.</h2>
      </div>

      <div className="flex-1 overflow-hidden rounded-[2.5rem] border border-white bg-white/40 backdrop-blur-3xl shadow-2xl relative z-10 reveal" style={{ animationDelay: '0.2s' }}>
        <table className="w-full">
          <thead>
            <tr className="bg-indigo text-white">
              <th className="text-left px-10 py-6 font-display font-bold text-sm uppercase tracking-widest">Service</th>
              <th className="text-right px-10 py-6 font-display font-bold text-sm uppercase tracking-widest text-white/60">Gebruikelijk</th>
              <th className="text-right px-10 py-6 font-display font-bold text-sm uppercase tracking-widest text-white">Agensea</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark/5">
            {data.monthlyItems.map((item) => {
              const isTotal = item.description.toLowerCase().includes('totaal');
              return (
                <tr key={item.id} className={`${isTotal ? 'bg-indigo/5' : ''} transition-colors hover:bg-indigo/[0.02]`}>
                  <td className={`px-10 py-5 text-dark text-lg ${isTotal ? 'font-display font-bold text-2xl' : 'font-medium'}`}>
                    {item.description}
                  </td>
                  <td className={`px-10 py-5 text-right text-base text-text-secondary line-through opacity-40 ${isTotal ? 'font-bold' : ''}`}>
                    {item.typicalPrice}
                  </td>
                  <td className={`px-10 py-5 text-right font-display font-bold text-indigo ${isTotal ? 'text-3xl' : 'text-xl'}`}>
                    {item.agenseaPrice}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
