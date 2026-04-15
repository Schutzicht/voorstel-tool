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

function OptionCard({ option, index, total }: { option: InvestmentOption; index: number; total: number }) {
  const oneTimeTotal = calcSum(option.oneTimeItems);
  const monthlyTotal = calcSum(option.monthlyItems);
  // When there's only one option: take the full width; otherwise 2–3 columns share
  const widthBasis = total === 1 ? 'max-w-xl mx-auto w-full' : 'flex-1';

  return (
    <div
      className={`${widthBasis} min-h-0 flex flex-col bg-white/70 backdrop-blur-xl rounded-[1.75rem] border border-white/80 shadow-[0_24px_48px_-24px_rgba(13,13,13,0.18)] overflow-hidden reveal`}
      style={{ animationDelay: `${0.2 + index * 0.12}s` }}
    >
      {/* Header */}
      <div className="bg-indigo text-white px-8 py-6 shrink-0 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
        <div className="relative flex items-center gap-4">
          <span className="w-11 h-11 rounded-xl bg-white/20 font-display font-bold text-xl flex items-center justify-center shrink-0">
            {String.fromCharCode(65 + index)}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-bold text-2xl tracking-tight leading-tight truncate">{option.name}</h3>
            {option.subtitle && (
              <p className="text-white/75 text-sm font-medium mt-0.5 truncate">{option.subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 p-8 flex flex-col overflow-hidden">
        {option.description && (
          <p className="text-text-secondary text-sm leading-relaxed mb-5 pb-5 border-b border-warm-grey line-clamp-4">
            {option.description}
          </p>
        )}

        <div className="flex-1 min-h-0 overflow-hidden space-y-5">
          {option.oneTimeItems.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-indigo font-bold mb-3">Eenmalig</p>
              <ul className="space-y-2.5">
                {option.oneTimeItems.map((item) => (
                  <li key={item.id} className="flex justify-between items-baseline gap-4 text-[13px] leading-snug">
                    <span className="text-dark/85 min-w-0 break-words">{item.description}</span>
                    <span className="font-display font-bold text-dark shrink-0 whitespace-nowrap">{item.agenseaPrice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {option.monthlyItems.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-indigo font-bold mb-3">Maandelijks</p>
              <ul className="space-y-2.5">
                {option.monthlyItems.map((item) => (
                  <li key={item.id} className="flex justify-between items-baseline gap-4 text-[13px] leading-snug">
                    <span className="text-dark/85 min-w-0 break-words">{item.description}</span>
                    <span className="font-display font-bold text-dark shrink-0 whitespace-nowrap">{item.agenseaPrice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="mt-6 pt-5 border-t-2 border-indigo/15 space-y-2 shrink-0">
          {oneTimeTotal && (
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-bold">Eenmalig totaal</span>
              <span className="font-display font-bold text-indigo text-2xl leading-none">{oneTimeTotal}</span>
            </div>
          )}
          {monthlyTotal && (
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-bold">Per maand</span>
              <span className="font-display font-bold text-indigo text-2xl leading-none">{monthlyTotal}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function InvestmentOptionsSlide({ data }: { data: ProposalData }) {
  const options = data.investmentOptions;
  const count = options.length;

  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-14 overflow-hidden">
      <MeshBackground />

      <div className="mb-10 relative z-10 reveal shrink-0">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Financieel</p>
        <h2 className="text-6xl font-display font-bold text-dark tracking-tight leading-[0.95]">Kies je pakket.</h2>
        <p className="text-text-secondary text-lg leading-relaxed mt-5 max-w-2xl">
          Vergelijk de pakketten en kies wat het beste past. Bij ondertekenen geef je
          aan welke optie je kiest.
        </p>
      </div>

      <div className="flex-1 min-h-0 flex gap-10 relative z-10">
        {count === 0 ? (
          <p className="text-text-secondary text-lg self-center mx-auto opacity-70">
            Nog geen opties toegevoegd.
          </p>
        ) : (
          options.map((opt, i) => (
            <OptionCard key={opt.id} option={opt} index={i} total={count} />
          ))
        )}
      </div>
    </div>
  );
}
