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

interface Props {
  data: ProposalData;
  /** Render only a specific option as a full-width slide (A, B, …) */
  optionIndex: number;
}

export function InvestmentOptionsSlide({ data, optionIndex }: Props) {
  const options = data.investmentOptions;
  const option: InvestmentOption | undefined = options[optionIndex];
  const total = options.length;

  if (!option) {
    return (
      <div className="pdf-slide bg-[#FAF9F6] relative flex items-center justify-center p-14 overflow-hidden">
        <MeshBackground />
        <p className="text-text-secondary text-lg opacity-70 relative z-10">Nog geen pakket toegevoegd.</p>
      </div>
    );
  }

  const letter = String.fromCharCode(65 + optionIndex);
  const oneTimeTotal = calcSum(option.oneTimeItems);
  const monthlyTotal = calcSum(option.monthlyItems);

  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-14 overflow-hidden">
      <MeshBackground />

      {/* Hero — side-by-side eyebrow + package meta */}
      <header className="relative z-10 reveal shrink-0 mb-10">
        <div className="flex items-end justify-between gap-10 flex-wrap">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-3">
              Financieel · Pakket {letter} van {total}
            </p>
            <h2 className="text-6xl font-display font-bold text-dark tracking-tight leading-[0.95]">
              {option.name}
            </h2>
            {option.subtitle && (
              <p className="text-xl text-text-secondary mt-4 font-medium">{option.subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-indigo text-white font-display font-bold text-5xl flex items-center justify-center">
              {letter}
            </div>
          </div>
        </div>

        {option.description && (
          <p className="text-text-secondary text-lg leading-relaxed mt-8 max-w-3xl">
            {option.description}
          </p>
        )}
      </header>

      {/* Body — eenmalig | maandelijks in twee kolommen + totaal-footer */}
      <div className="flex-1 min-h-0 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 reveal" style={{ animationDelay: '0.2s' }}>
        {option.oneTimeItems.length > 0 && (
          <section className="bg-white/70 backdrop-blur-xl border-2 border-white/90 rounded-3xl p-8 shadow-[0_24px_60px_-20px_rgba(13,13,13,0.15)] flex flex-col min-h-0">
            <div className="flex items-baseline justify-between mb-6 shrink-0">
              <p className="text-[11px] uppercase tracking-[0.25em] text-indigo font-bold">Eenmalig</p>
              {oneTimeTotal && (
                <span className="font-display font-bold text-indigo text-2xl">{oneTimeTotal}</span>
              )}
            </div>
            <ul className="space-y-3 flex-1 min-h-0 overflow-hidden">
              {option.oneTimeItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-baseline gap-4 text-[15px] leading-snug pb-2 border-b border-warm-grey/60 last:border-b-0 last:pb-0"
                >
                  <span className="text-dark/85 min-w-0 break-words">{item.description}</span>
                  <span className="font-display font-bold text-dark shrink-0 whitespace-nowrap">
                    {item.agenseaPrice}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {option.monthlyItems.length > 0 && (
          <section className="bg-white/70 backdrop-blur-xl border-2 border-white/90 rounded-3xl p-8 shadow-[0_24px_60px_-20px_rgba(13,13,13,0.15)] flex flex-col min-h-0">
            <div className="flex items-baseline justify-between mb-6 shrink-0">
              <p className="text-[11px] uppercase tracking-[0.25em] text-indigo font-bold">Maandelijks</p>
              {monthlyTotal && (
                <span className="font-display font-bold text-indigo text-2xl">{monthlyTotal}</span>
              )}
            </div>
            <ul className="space-y-3 flex-1 min-h-0 overflow-hidden">
              {option.monthlyItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-baseline gap-4 text-[15px] leading-snug pb-2 border-b border-warm-grey/60 last:border-b-0 last:pb-0"
                >
                  <span className="text-dark/85 min-w-0 break-words">{item.description}</span>
                  <span className="font-display font-bold text-dark shrink-0 whitespace-nowrap">
                    {item.agenseaPrice}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* If only one of the two is filled, render an empty spacer so the grid stays balanced */}
        {option.oneTimeItems.length === 0 && option.monthlyItems.length > 0 && (
          <div className="hidden md:block"></div>
        )}
        {option.monthlyItems.length === 0 && option.oneTimeItems.length > 0 && (
          <div className="hidden md:block"></div>
        )}
      </div>
    </div>
  );
}
