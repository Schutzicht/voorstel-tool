import { type ProposalData } from '../../types';
import { MeshBackground } from './MeshBackground';

export function AgencySlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16">
      <MeshBackground />

      <div className="flex justify-between items-start mb-12 relative z-10">
        <div className="reveal">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Onze Expertise</p>
          <h2 className="text-[3.5rem] font-display font-bold text-dark leading-[1.1] tracking-tight">
            Jouw agency in<br />
            <span className="text-indigo">websites, software<br />&amp; marketing.</span>
          </h2>
        </div>
        <div className="font-display text-2xl font-bold tracking-tight text-dark opacity-20">agensea.</div>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 relative z-10">
        {[
          { num: '01', label: 'Maatwerk Websites', desc: 'Websites die vertrouwen wekken, klanten overtuigen en klaar zijn voor groei.' },
          { num: '02', label: 'Online Marketing', desc: 'Strategische campagnes op de juiste kanalen, voor de juiste doelgroep. Datagedreven en altijd transparant.' },
          { num: '03', label: 'Maatwerk Software', desc: 'Wij ontwerpen praktische applicaties en AI-gedreven tools die je wekelijks uren aan tijd besparen.' },
        ].map((item, idx) => (
          <div
            key={item.label}
            className="bg-white/40 backdrop-blur-[30px] rounded-[2rem] p-8 border border-white shadow-xl flex flex-col group reveal"
            style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
          >
            <span className="text-indigo font-display font-bold text-lg mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
              {item.num}
            </span>
            <h4 className="font-display font-bold text-dark text-xl mb-3 leading-tight tracking-tight">{item.label}</h4>
            <p className="text-text-primary text-sm leading-relaxed">{item.desc}</p>
            <div className="mt-auto pt-6 flex justify-end">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-warm-grey/50 text-indigo opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all">
                ↗
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust line */}
      <div className="flex justify-between items-center pt-8 border-t border-dark/5 relative z-10 mt-8">
        <div className="flex items-center gap-8 reveal" style={{ animationDelay: '0.6s' }}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-bold">Partners & Impact</p>
          <div className="flex items-center gap-6 opacity-60">
            <img src="/logos-hero/Logo_Adrz_RGB.png" alt="Adrz" className="h-6 grayscale hover:grayscale-0 transition-all" />
            <img src="/logos-hero/hz-logo (1).jpg" alt="HZ" className="h-6 grayscale hover:grayscale-0 transition-all rounded" />
            <img src="/logos-hero/Kaap_RGB_Logo_rond_fc.svg" alt="De Kaap" className="h-6 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-bold opacity-60 reveal" style={{ animationDelay: '0.7s' }}>
          {data.clientName || 'Klant'} · focus op resultaat
        </p>
      </div>
    </div>
  );
}
