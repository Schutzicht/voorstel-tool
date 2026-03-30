import { type ProposalData } from '../types';

// ── Shared Branding Components ────────────────────────────────────────────────
export function MeshBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="mesh-blob w-[600px] h-[600px] bg-indigo/10 -top-[10%] -left-[10%]" style={{ animationDelay: '0s' }}></div>
      <div className="mesh-blob w-[500px] h-[500px] bg-[#6C63FF]/10 -bottom-[10%] -right-[5%]" style={{ animationDelay: '-5s' }}></div>
      <div className="mesh-blob w-[400px] h-[400px] bg-indigo/5 top-[20%] right-[10%]" style={{ animationDelay: '-2s' }}></div>
    </div>
  );
}

// ── Slide 1: Cover ──────────────────────────────────────────────────────────
export function CoverSlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide slide-cover bg-[#FAF9F6] relative overflow-hidden flex flex-col p-16">
      <MeshBackground />
      
      {/* Top: Agensea wordmark */}
      <div className="flex justify-between items-start relative z-10">
        <div className="font-display text-3xl font-bold tracking-tight text-dark">
          agensea<span className="text-indigo">.</span>
        </div>
        {data.clientLogo && (
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-white shadow-sm transition-all">
            <img src={data.clientLogo} alt="Client logo" className="h-12 object-contain" />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center max-w-[85%] relative z-10">
        <div className="reveal" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-[5.5rem] font-display font-bold leading-[1.05] tracking-tight text-dark mb-8">
            {data.clientName || 'Onze Klant'}
          </h1>
        </div>
        <div className="reveal" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-[3.8rem] font-display font-bold leading-tight text-dark flex items-center gap-6">
            <span className="text-indigo">{data.proposalType}</span>
            <span className="text-indigo opacity-30 text-5xl">↘</span>
          </h2>
        </div>
      </div>

      {/* Bottom stamps */}
      <div className="flex justify-between items-end relative z-10">
        <div className="reveal" style={{ animationDelay: '0.5s' }}>
          <p className="text-[11px] uppercase tracking-[0.2em] text-text-secondary font-bold mb-3 opacity-80">Opgesteld door</p>
          <div className="flex items-center gap-4">
             <p className="font-display font-bold text-2xl text-dark">Agensea</p>
             <div className="w-8 h-[2px] bg-indigo opacity-50"></div>
             <p className="font-display font-bold text-2xl text-dark opacity-60">{data.clientName || 'Klant'}</p>
          </div>
        </div>
        <div className="text-right reveal" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-text-secondary font-semibold bg-white/50 backdrop-blur px-4 py-2 rounded-full border border-warm-grey/30">
            {data.proposalDate}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Slide 2: Agency Intro ────────────────────────────────────────────────────
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

// ── Slide 3: Client Marquee (Static) ─────────────────────────────────────────
export function ClientMarqueeSlide({ data }: { data: ProposalData }) {
  const logos = [
    { src: "/logos-hero/Logo_Adrz_RGB.png", alt: "Adrz" },
    { src: "/logos-hero/hz-logo (1).jpg", alt: "HZ" },
    { src: "/logos-hero/Kaap_RGB_Logo_rond_fc.svg", alt: "De Kaap" },
  ];
  
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative overflow-hidden flex flex-col justify-center items-center p-16">
      <div className="mesh-blob w-[800px] h-[800px] bg-indigo/10 top-[-20%] left-[-20%]" style={{ animationDelay: '0s' }}></div>
      <div className="relative z-10 text-center mb-16 reveal">
        <p className="text-xs uppercase tracking-[0.4em] text-indigo font-bold mb-6">Partnership & Vertrouwen</p>
        <h2 className="text-5xl font-display font-bold text-dark leading-tight">
          Samenwerken met de<br />
          <span className="text-indigo">ambitieuze organisaties.</span>
        </h2>
      </div>

      <div className="relative z-10 w-full overflow-hidden py-12">
        <div className="flex gap-20 animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-20 items-center">
              {logos.map((logo) => (
                <div key={logo.alt} className="w-48 h-24 flex items-center justify-center opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all">
                  <img key={logo.alt} src={logo.src} alt={logo.alt} className="h-12 object-contain" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="absolute bottom-6 right-8 text-[10px] uppercase tracking-widest text-dark/20 font-bold font-display">
        {data.clientName || 'Klant'} · agensea klanten
      </p>
    </div>
  );
}

// ── Slide 4: Situatie Analyse ────────────────────────────────────────────────
export function SituatieSlide({ data }: { data: ProposalData }) {
  const current = data.currentSituation || 'Geen eigen platform aanwezig\nBeperkte online zichtbaarheid\nHandmatige processen';
  const kansen = data.opportunities || 'Groeiende markt / niche\nLage concurrentie online\nSchaalbare digitale oplossing mogelijk';

  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16">
      <MeshBackground />
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Analyse</p>
        <h2 className="text-[3.2rem] font-display font-bold text-dark tracking-tight leading-none">
          Waar staan we nu?
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-8 flex-1 relative z-10">
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white shadow-xl reveal" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-dark/10 flex items-center justify-center text-dark/70 font-bold">—</div>
            <h3 className="font-display font-bold text-dark text-2xl">De Uitdaging</h3>
          </div>
          <ul className="space-y-4">
            {current.split('\n').filter(Boolean).map((line, i) => (
              <li key={i} className="flex gap-4 items-start group">
                <span className="text-indigo/50 font-bold mt-1.5 group-hover:text-indigo transition-colors opacity-0 group-hover:opacity-100">↗</span>
                <span className="text-text-primary text-base leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-indigo/5 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-indigo/10 shadow-xl reveal" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo text-white flex items-center justify-center font-bold">↗</div>
            <h3 className="font-display font-bold text-dark text-2xl">De Kansen</h3>
          </div>
          <ul className="space-y-4">
            {kansen.split('\n').filter(Boolean).map((line, i) => (
              <li key={i} className="flex gap-4 items-start group">
                <span className="text-indigo font-bold mt-1.5">↗</span>
                <span className="text-text-primary text-base leading-relaxed font-medium">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Slide 5: Concrete Doelen ─────────────────────────────────────────────────
export function DoelSlide({ data }: { data: ProposalData }) {
  const goals = data.goals.filter(g => g.text.trim());
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16 overflow-hidden text-dark">
      <div className="mesh-blob w-[700px] h-[700px] bg-indigo/10 -bottom-[20%] -right-[20%]" style={{ animationDelay: '-3s' }}></div>
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.4em] text-indigo font-bold mb-4">Succes definieren</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none">Concrete doelen.</h2>
      </div>

      <div className="flex-1 flex flex-col gap-4 relative z-10">
        {goals.map((goal, i) => (
          <div 
            key={goal.id} 
            className="flex items-center gap-8 bg-white/60 backdrop-blur-xl rounded-[2rem] px-10 py-8 border border-white shadow-lg reveal"
            style={{ animationDelay: `${0.2 + i * 0.1}s` }}
          >
            <span className="font-display text-5xl font-bold text-indigo leading-none shrink-0 w-16">{(i + 1).toString().padStart(2, '0')}</span>
            <p className="text-dark font-medium text-[1.4rem] leading-snug">{goal.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Slide 6: Over Agensea (Static Team) ──────────────────────────────────────
export function AboutTeamSlide({ data: _data }: { data: ProposalData }) {
  const team = [
    { name: 'Ruben', role: 'Account Manager', img: '/team/ruben.webp' },
    { name: 'Jorian', role: 'Technical Specialist', img: '/team/jorian.webp' },
    { name: 'Jorik', role: 'Online Marketing Specialist', img: '/team/jorik.webp' },
  ];

  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16">
      <MeshBackground />
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Wie wij zijn</p>
        <h2 className="text-[3.2rem] font-display font-bold text-dark tracking-tight leading-tight">
          Een nuchter team met<br />
          <span className="text-indigo">passie voor techniek.</span>
        </h2>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-12 relative z-10 items-center">
        {team.map((member, i) => (
          <div 
            key={member.name} 
            className="flex flex-col items-center text-center reveal"
            style={{ animationDelay: `${0.2 + i * 0.1}s` }}
          >
            <div className="w-[12rem] h-[12rem] rounded-full border-4 border-indigo p-1.5 mb-6 overflow-hidden bg-white shadow-2xl transform transition-transform hover:scale-105 duration-500">
               <div 
                 className="w-full h-full rounded-full bg-cover bg-center" 
                 style={{ backgroundImage: `url('${member.img}')` }}
               ></div>
            </div>
            <h4 className="font-display font-bold text-dark text-2xl mb-1">{member.name}</h4>
            <p className="text-indigo font-bold text-xs uppercase tracking-widest">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Slide 7: Werkwijze ───────────────────────────────────────────────────────
export function WerkwijzeSlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16">
      <MeshBackground />
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Onze Aanpak</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none">Hoe we het doen.</h2>
      </div>

      <div className="flex-1 flex items-center relative z-10">
        <div className="w-full flex gap-4">
          {data.approach.map((step, i) => (
            <div 
              key={step.id} 
              className="flex-1 bg-white/50 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-lg flex flex-col items-center text-center reveal"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-indigo text-white flex items-center justify-center font-display font-bold text-lg mb-6 shrink-0 shadow-lg shadow-indigo/20">
                {i + 1}
              </div>
              <h4 className="font-display font-bold text-dark text-xl mb-3 leading-tight tracking-tight">{step.phase}</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Slide 8: Ad Platforms ───────────────────────────────────────────────────
export function AdPlatformsSlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16 overflow-hidden">
       <div className="mesh-blob w-[600px] h-[600px] bg-indigo/10 -top-[10%] -left-[10%]" style={{ animationDelay: '0s' }}></div>
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Adverteren</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none">Kanalen & Focus.</h2>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-8 relative z-10">
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white shadow-xl flex flex-col reveal" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#1877F2]/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </div>
            <h3 className="font-display font-bold text-dark text-2xl">Meta Ads</h3>
          </div>
          <ul className="space-y-4 flex-1">
            {data.metaAdsContent.split('\n').filter(Boolean).map((line, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="text-indigo font-bold mt-1.5">↘</span>
                <span className="text-text-primary text-lg leading-snug">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white shadow-xl flex flex-col reveal" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#4285F4]/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#4285F4]" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
            </div>
            <h3 className="font-display font-bold text-dark text-2xl">Google Search</h3>
          </div>
          <ul className="space-y-4 flex-1">
            {data.googleAdsContent.split('\n').filter(Boolean).map((line, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="text-indigo font-bold mt-1.5">↘</span>
                <span className="text-text-primary text-lg leading-snug">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Slide 9: Diensten ────────────────────────────────────────────────────────
export function DienstenSlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16">
      <MeshBackground />
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Scope</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none">Wat we gaan doen.</h2>
      </div>

      <div className="flex-1 flex flex-wrap gap-4 content-start relative z-10">
        {data.services.map((s, i) => (
          <div 
            key={s} 
            className="flex items-center gap-4 bg-white/60 backdrop-blur-xl px-8 py-5 rounded-2xl border border-white shadow-md reveal"
            style={{ animationDelay: `${0.2 + i * 0.05}s` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-indigo shrink-0"></div>
            <span className="font-display font-bold text-dark text-xl tracking-tight">{s}</span>
          </div>
        ))}
        {data.services.length === 0 && (
          <p className="text-text-secondary text-lg self-center mx-auto opacity-70">Geen diensten geselecteerd.</p>
        )}
      </div>
    </div>
  );
}

// ── Slide 10: Analytics ───────────────────────────────────────────────────────
export function AnalyticsSlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16">
      <MeshBackground />
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Inzicht</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-[1.1]">
          Meten is weten.<br />
          <span className="text-indigo text-[3rem]">Data-gedreven beslissingen.</span>
        </h2>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-5 content-start relative z-10">
        {data.analyticsTools.map((tool, i) => (
          <div 
            key={tool} 
            className="flex items-center gap-6 bg-white/60 backdrop-blur-xl px-8 py-6 rounded-[2rem] border border-white shadow-lg reveal"
            style={{ animationDelay: `${0.2 + i * 0.1}s` }}
          >
            <div className="w-12 h-12 rounded-xl bg-indigo/10 flex items-center justify-center shrink-0">
               <div className="w-5 h-5 rounded-sm bg-indigo transform rotate-45"></div>
            </div>
            <span className="font-display font-bold text-dark text-2xl tracking-tight">{tool}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Slide 10b: Mockups ────────────────────────────────────────────────────────
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
          /* Web Browser Mockup */
          <div className="w-[85%] bg-white rounded-2xl shadow-2xl shadow-indigo/10 border border-warm-grey/50 overflow-hidden transform group hover:scale-[1.02] transition-transform duration-500 reveal" style={{ animationDelay: '0.2s' }}>
            {/* Browser Tab UI */}
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
            
            {/* Web Hero UI */}
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
        ) : (
          /* Ads Mockups (3 column grid) */
          <div className="grid grid-cols-3 gap-8 w-full px-6 reveal" style={{ animationDelay: '0.2s' }}>
            
            {/* 1. Google Search Ad */}
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

            {/* 2. Meta (Facebook/IG) Ad */}
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
                  {/* Abstract placeholder visual */}
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

            {/* 3. LinkedIn Ad */}
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
                   {/* Abstract LinkedIn Ad Visual */}
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
            
          </div>
        )}
      </div>
      
      <p className="absolute bottom-6 right-8 text-[10px] uppercase tracking-widest text-dark/20 font-bold font-display reveal">
        Voorbeeld / Indicatie 
      </p>
    </div>
  );
}

// ── Slide 11: Content ─────────────────────────────────────────────────────────
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

// ── Slide 12: Eenmalige Investering ──────────────────────────────────────────
export function EenmaligeInvesteringSlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16">
      <MeshBackground />
      <div className="mb-10 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo font-bold mb-4">Financieel</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none">Eenmalige investering.</h2>
      </div>

      <div className="flex-1 overflow-hidden rounded-[2.5rem] border border-white bg-white/40 backdrop-blur-3xl shadow-2xl relative z-10 reveal" style={{ animationDelay: '0.2s' }}>
        <table className="w-full">
          <thead>
            <tr className="bg-indigo text-white">
              <th className="text-left px-10 py-6 font-display font-bold text-sm uppercase tracking-widest">Onderdeel</th>
              <th className="text-right px-10 py-6 font-display font-bold text-sm uppercase tracking-widest text-white/60">Gebruikelijk</th>
              <th className="text-right px-10 py-6 font-display font-bold text-sm uppercase tracking-widest text-white">Agensea</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark/5">
            {data.oneTimeItems.map((item) => {
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

// ── Slide 13: Maandelijkse Investering ──────────────────────────────────────
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

// ── Slide 14: Disclaimer ─────────────────────────────────────────────────────
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

// ── Slide 15: CTA Afsluiting ─────────────────────────────────────────────────
export function CTASlide({ data }: { data: ProposalData }) {
  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16 overflow-hidden">
      <MeshBackground />
      
      <div className="flex justify-between items-start relative z-10 reveal">
        <div className="font-display text-3xl font-bold tracking-tight text-dark">
          agensea<span className="text-indigo">.</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="reveal" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-[6.5rem] font-display font-bold leading-none tracking-tighter text-dark mb-4">
            {data.clientName || 'De bal'}
          </h1>
        </div>
        <div className="reveal" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-[5.5rem] font-display font-bold leading-none tracking-tighter text-indigo flex items-center gap-8">
            {data.ctaText || 'is aan jou'} 
            <span className="text-6xl animate-bounce-slow">↘</span>
          </h2>
        </div>
      </div>

      <div className="flex justify-between items-end pt-12 border-t border-dark/5 mt-auto relative z-10 reveal" style={{ animationDelay: '0.6s' }}>
        <div className="grid grid-cols-3 gap-16">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-2">Email</p>
            <p className="text-lg font-display font-bold text-dark">info@agensea.nl</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-2">Telefoon</p>
            <p className="text-lg font-display font-bold text-dark">+31 6 81 38 36 01</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-2">Web</p>
            <p className="text-lg font-display font-bold text-dark">agensea.nl</p>
          </div>
        </div>
        {data.clientLogo && (
           <img src={data.clientLogo} alt="Client logo" className="h-12 object-contain opacity-40 grayscale" />
        )}
      </div>
    </div>
  );
}
