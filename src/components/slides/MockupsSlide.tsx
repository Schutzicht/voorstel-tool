import { type ProposalData } from '../../types';
import { SlideFooter } from './SlideFooter';

export function MockupsSlide({ data }: { data: ProposalData }) {
  const isWebsite = data.proposalType.toLowerCase().includes('website') || data.proposalType.toLowerCase().includes('software') || data.proposalType.toLowerCase().includes('webshop');
  const name = data.clientName || 'Jouw Bedrijf';
  const urlSafe = name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jouwbedrijf';

  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16 overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo/5 rounded-full blur-[100px]" />
      <div className="mb-4 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.4em] text-indigo font-bold mb-4">Visueel Concept</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none mb-4">
          Een blik op {isWebsite ? 'de toekomst' : 'het resultaat'}.
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl">
          {isWebsite
            ? 'Een abstracte preview van hoe een snelle, moderne web-omgeving eruit kan komen te zien op maat en afgestemd op jouw identiteit.'
            : 'Zo zou jouw bedrijf direct in het oog springen bij je doelgroep op de belangrijkste digitale kanalen.'}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 w-full">
        {isWebsite ? (
          <WebsiteMockup name={name} urlSafe={urlSafe} />
        ) : (
          <AdsMockup name={name} urlSafe={urlSafe} />
        )}
      </div>
    </div>
  );
}

function WebsiteMockup({ name, urlSafe }: { name: string; urlSafe: string }) {
  return (
    <div className="w-[85%] bg-white rounded-2xl shadow-2xl shadow-indigo/10 border border-warm-grey/50 overflow-hidden transform group hover:scale-[1.02] transition-transform duration-500 reveal" style={{ animationDelay: '0.2s' }}>
      <div className="bg-[#f2f2f2] px-4 py-3 flex items-center border-b border-warm-grey">
        <div className="flex gap-1.5 absolute">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm"></div>
        </div>
        <div className="mx-auto flex bg-white px-6 py-1.5 rounded-md shadow-sm items-center gap-2">
          <span className="text-[10px] text-text-secondary">🔒</span>
          <span className="text-[11px] font-medium text-dark tracking-wider">www.{urlSafe}.nl</span>
        </div>
      </div>

      <div className="h-[340px] bg-gradient-to-br from-[#FAFAFA] to-[#F1F0EC] relative flex items-center p-12 overflow-hidden">
          <div className="absolute right-[-5%] top-[10%] w-[50%] h-[120%] bg-indigo/10 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
          <div className="absolute right-[5%] bottom-[-10%] w-[30%] h-[80%] bg-[#D4AF37]/10 rounded-full blur-2xl opacity-40 mix-blend-multiply"></div>

          <div className="max-w-[60%] relative z-10 flex flex-col items-start gap-4">
            <div className="font-display font-bold text-indigo tracking-widest text-[10px] uppercase bg-white px-3 py-1 rounded-full shadow-sm">
              {name}
            </div>
            <h1 className="text-5xl font-display font-bold text-dark leading-[1.1] tracking-tight">
              Digitaal impact maken <br/>begint hier.
            </h1>
            <p className="text-text-secondary text-base leading-relaxed mt-2 max-w-[85%]">
              Een innovatief platform ontworpen om doelen te bereiken. Pijlsnel, schaalbaar en feilloos op zowel mobiel als desktop.
            </p>
            <div className="mt-4 flex gap-4">
              <div className="px-6 py-2.5 bg-dark text-white rounded-full text-[11px] font-bold uppercase tracking-wider">Start Nu</div>
              <div className="px-6 py-2.5 bg-white text-dark rounded-full text-[11px] font-bold uppercase tracking-wider border border-warm-grey shadow-sm">Lees Meer</div>
            </div>
          </div>
      </div>
    </div>
  );
}

function AdsMockup({ name, urlSafe }: { name: string; urlSafe: string }) {
  return (
    <div className="grid grid-cols-3 gap-8 w-full px-6 reveal" style={{ animationDelay: '0.2s' }}>
      {/* Google Search Ad */}
      <div className="bg-white rounded-xl shadow-xl shadow-black/5 p-6 border border-warm-grey flex flex-col relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#f1f3f4] border border-[#e8eaed] flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-[#202124] text-xs">{name.charAt(0)}</span>
          </div>
          <div className="leading-tight">
            <div className="text-[12px] font-medium text-[#202124]">{name}</div>
            <div className="text-[10px] text-[#202124] opacity-70">Gesponsord</div>
          </div>
          <div className="ml-auto">
              <svg className="w-4 h-4 text-[#5f6368]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
          </div>
        </div>
        <h3 className="text-[#1a0dab] text-[18px] mb-1 font-medium leading-[1.3] truncate block">
          {name} | Dé Expert In Jouw Regio
        </h3>
        <div className="flex gap-2 mb-2 items-center">
          <span className="text-[12px] font-bold text-[#006621]">Ad · </span>
          <span className="text-[12px] text-[#006621]">www.{urlSafe}.nl/</span>
        </div>
        <p className="text-[#4d5156] text-[13px] leading-[1.58] mb-4 flex-1">
          Ontdek onze aanpak en start vandaag nog met groeien. Neem contact op voor een persoonlijke kennismaking of vraag direct online aan.
        </p>
        <div className="flex flex-wrap gap-2 pt-3 border-t border-[#ebebeb]">
          <span className="text-[#1a0dab] text-[12px] hover:underline cursor-pointer">Onze Aanpak</span>
          <span className="text-[#1a0dab] text-[12px] hover:underline cursor-pointer">Contact</span>
        </div>
      </div>

      {/* Meta Ad */}
      <div className="bg-white rounded-xl shadow-xl shadow-black/5 flex flex-col relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 border border-warm-grey">
         <div className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo to-dark flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-inner">
              {name.charAt(0)}
            </div>
            <div className="leading-none">
              <div className="text-[13px] font-bold text-[#050505] mb-0.5">{name}</div>
              <div className="text-[11px] text-[#65676B]">Gesponsord · 🌎</div>
            </div>
            <div className="ml-auto text-[#65676B] font-bold tracking-widest pb-2">...</div>
         </div>
         <div className="px-4 pb-3 text-[13px] text-[#050505] leading-snug">
           Tijd voor de volgende stap? Bij {name} helpen we je direct vooruit met de slimste oplossingen. 🚀
         </div>
         <div className="h-40 w-full bg-[#f0f2f5] relative overflow-hidden group-hover:bg-[#e4e6eb] transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo/5 to-white/10 mix-blend-overlay"></div>
            <div className="absolute top-[20%] left-[20%] w-16 h-16 rounded-lg bg-indigo/20 rotate-12"></div>
            <div className="absolute bottom-[20%] right-[20%] w-20 h-20 rounded-full bg-dark/10"></div>
            <div className="absolute w-full h-full flex items-center justify-center font-display font-medium text-dark/30 tracking-widest text-lg uppercase opacity-80 backdrop-blur-sm">Visuals</div>
         </div>
         <div className="p-4 bg-[#f0f2f5] flex justify-between items-center">
            <div className="flex-1 truncate pr-2">
              <div className="text-[10px] uppercase text-[#65676B] tracking-wide">{urlSafe}.nl</div>
              <div className="text-[13px] font-bold text-[#050505] truncate">Plan je afspraak in</div>
            </div>
            <div className="bg-[#E4E6EB] px-4 py-1.5 rounded text-[13px] font-bold text-[#050505]">
              Meer
            </div>
         </div>
      </div>

      {/* LinkedIn Ad */}
      <div className="bg-white rounded-xl shadow-xl shadow-black/5 flex flex-col relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 border border-warm-grey">
          <div className="p-4 flex items-start gap-3 border-b border-[#00000014]">
            <div className="w-10 h-10 rounded bg-[#f3f2ef] flex items-center justify-center shrink-0">
              <span className="font-display font-bold text-dark text-sm">{name.charAt(0)}</span>
            </div>
            <div className="leading-tight flex-1">
              <div className="text-[14px] font-bold text-dark/90 hover:text-[#0a66c2] cursor-pointer inline-flex items-center gap-1">
                {name} <span className="text-[#0a66c2] text-xs">✓</span>
              </div>
              <div className="text-[12px] text-dark/60 mt-0.5">10.492 volgers</div>
              <div className="text-[11px] text-dark/50 mt-0.5">Promoted</div>
            </div>
             <div className="text-dark/40 font-bold tracking-widest pb-2">...</div>
          </div>
          <div className="px-4 py-3 text-[13px] text-dark/80 leading-relaxed">
            Klaar om te professionaliseren? Wij bouwen aan de toekomst van jouw bedrijf met ijzersterk design en data. Bereid je voor op rendement. 📈
          </div>
          <div className="h-32 w-full bg-[#f3f2ef] relative flex border-t border-b border-[#00000014]">
             <div className="w-1/2 p-4">
                <div className="w-full h-full bg-indigo/10 rounded border border-indigo/20 flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
             </div>
             <div className="w-1/2 p-4 pt-6">
                <div className="h-2 w-3/4 bg-dark/10 rounded mb-2"></div>
                <div className="h-2 w-1/2 bg-dark/10 rounded mb-4"></div>
                <div className="h-3 w-1/3 bg-indigo/30 rounded"></div>
             </div>
          </div>
          <div className="p-3 bg-[#f3f2ef]/50 flex justify-between items-center text-[12px]">
             <span className="font-bold text-dark/70 hover:text-dark cursor-pointer">Reageer</span>
             <span className="font-bold text-dark/70 hover:text-dark cursor-pointer">Deel</span>
             <span className="font-bold text-dark/70 hover:text-dark cursor-pointer">Stuur in (0)</span>
          </div>
      </div>
      <SlideFooter />
    </div>
  );
}
