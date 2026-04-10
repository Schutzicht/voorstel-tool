import { type ProposalData, type InvestmentOption } from '../../types';
import { MeshBackground } from './MeshBackground';

function calcSum(items: { agenseaPrice: string }[]): string | null {
  const total = items.reduce((sum, item) => {
    const num = parseFloat(item.agenseaPrice.replace(/[^0-9,.-]/g, '').replace(',', '.'));
    return isNaN(num) ? sum : sum + num;
  }, 0);
  if (total === 0) return null;
  return `€ ${total.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })},-`;
}

function OptionCard({ option, index }: { option: InvestmentOption; index: number }) {
  const oneTimeTotal = calcSum(option.oneTimeItems);
  const monthlyTotal = calcSum(option.monthlyItems);

  return (
    <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white shadow-xl overflow-hidden reveal" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
      <div className="bg-indigo text-white px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-white/20 font-display font-bold text-base flex items-center justify-center">
            {String.fromCharCode(65 + index)}
          </span>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-xl tracking-tight leading-tight truncate">{option.name}</h3>
            {option.subtitle && <p className="text-white/70 text-xs font-medium truncate">{option.subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col">
        {option.description && (
          <p className="text-text-secondary text-xs leading-relaxed mb-4 pb-4 border-b border-warm-grey">{option.description}</p>
        )}

        {option.oneTimeItems.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-widest text-indigo font-bold mb-2">Eenmalig</p>
            <ul className="space-y-1.5">
              {option.oneTimeItems.map(item => (
                <li key={item.id} className="flex justify-between items-baseline gap-2 text-xs">
                  <span className="text-dark/80 truncate">{item.description}</span>
                  <span className="font-display font-bold text-dark shrink-0">{item.agenseaPrice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {option.monthlyItems.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-widest text-indigo font-bold mb-2">Maandelijks</p>
            <ul className="space-y-1.5">
              {option.monthlyItems.map(item => (
                <li key={item.id} className="flex justify-between items-baseline gap-2 text-xs">
                  <span className="text-dark/80 truncate">{item.description}</span>
                  <span className="font-display font-bold text-dark shrink-0">{item.agenseaPrice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-warm-grey space-y-1">
          {oneTimeTotal && (
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Eenmalig totaal</span>
              <span className="font-display font-bold text-indigo text-xl">{oneTimeTotal}</span>
            </div>
          )}
          {monthlyTotal && (
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Per maand</span>
              <span className="font-display font-bold text-indigo text-xl">{monthlyTotal}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function InvestmentOptionsSlide({ data }: { data: ProposalData }) {
  const options = data.investmentOptions;

  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16">
      <MeshBackground />
      <div className="mb-8 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Financieel</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none">Kies je pakket.</h2>
        <p className="text-text-secondary text-lg leading-relaxed mt-4 max-w-xl">Vergelijk de pakketten en kies wat het beste past. Bij ondertekenen geef je aan welke optie je kiest.</p>
      </div>

      <div className="flex-1 flex gap-5 relative z-10">
        {options.map((opt, i) => (
          <OptionCard key={opt.id} option={opt} index={i} />
        ))}
        {options.length === 0 && (
          <p className="text-text-secondary text-lg self-center mx-auto opacity-70">Nog geen opties toegevoegd.</p>
        )}
      </div>
    </div>
  );
}
