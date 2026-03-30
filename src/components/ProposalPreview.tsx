import { type ProposalData } from '../types';
import { ArrowRight, Check, Sparkles, Target, Zap, Clock, CreditCard, ChevronLeft, Download } from 'lucide-react';

interface ProposalPreviewProps {
  data: ProposalData;
  onBack: () => void;
}

export default function ProposalPreview({ data, onBack }: ProposalPreviewProps) {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full relative">
      {/* HUD - Not printed */}
      <div className="fixed top-6 left-6 right-6 flex justify-between items-center z-50 no-print">
         <button onClick={onBack} className="bg-white/80 backdrop-blur border border-warm-grey px-4 py-2 rounded-full font-medium flex items-center gap-2 shadow-sm hover:border-indigo transition-colors interactive">
             <ChevronLeft className="w-4 h-4" /> Terug naar formulier
         </button>
         <button onClick={handlePrint} className="bg-indigo text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 shadow-lg shadow-indigo/20 hover:bg-indigo-light transition-colors interactive">
             Download als PDF <Download className="w-4 h-4" />
         </button>
      </div>

      {/* Slide 1: Cover */}
      <div className="pdf-slide bg-dark text-white relative flex flex-col justify-center px-16 lg:px-32">
        <div className="absolute top-12 left-12 w-32 h-32 rounded-full border-2 border-indigo/30 p-1 flex items-center justify-center">
             {/* Fake Agensea Z or A logo */}
             <div className="w-full h-full bg-indigo rounded-full flex items-center justify-center font-display font-bold text-4xl">Ag</div>
        </div>
        
        <div className="absolute bottom-12 right-12 w-64 h-64 bg-indigo/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="space-y-6 max-w-4xl relative z-10">
           <h4 className="text-indigo-light uppercase tracking-[0.2em] font-bold text-sm">Strategisch Voorstel</h4>
           <h1 className="text-6xl md:text-8xl font-display font-bold leading-none tracking-tight">
             Visie voor <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-light to-violet">{data.clientName || 'Onze Klant'}</span>
           </h1>
           <p className="text-2xl text-white/60 font-medium max-w-2xl mt-8 border-l-2 border-indigo-light pl-6">
             {data.projectType ? `Impact maken met een scherp uitgedacht traject voor: ${data.projectType}.` : 'Een technologische oplossing voor jouw digitale ambitie.'}
           </p>
        </div>
        
        <div className="absolute bottom-12 left-16 lg:left-32 flex gap-8 text-sm font-medium opacity-50">
           <span>T.a.v: {data.contactPerson || '-'}</span>
           <span>Agensea - Web & Marketing</span>
           <span>{new Date().toLocaleDateString('nl-NL')}</span>
        </div>
      </div>

      {/* Slide 2: Doelen & Uitdagingen */}
      <div className="pdf-slide bg-cream relative flex flex-col justify-center px-16 lg:px-32">
         <div className="absolute top-0 right-0 w-[50vh] h-[100vh] bg-warm-grey/50 rounded-l-[100px]"></div>
         
         <div className="grid grid-cols-2 gap-20 relative z-10">
            <div>
              <div className="w-16 h-16 bg-white border border-warm-grey rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                 <Target className="w-8 h-8 text-indigo" />
              </div>
              <h2 className="text-5xl font-display font-bold text-dark mb-6 tracking-tight">De Uitdaging &<br/>Onze Missie</h2>
              <p className="text-xl text-text-secondary leading-relaxed font-body">
                We bouwen geen oplossing voor gisteren, maar een platform voor morgen. Voor {data.clientName} zetten wij techniek en creativiteit in om meetbare resultaten te behalen.
              </p>
            </div>
            
            <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-warm-grey/50">
               <h3 className="text-2xl font-display font-semibold mb-6 flex items-center gap-3"><Sparkles className="w-6 h-6 text-indigo" /> Kern Doelstellingen</h3>
               <ul className="space-y-4">
                 {data.goals && data.goals.length > 0 ? (
                    data.goals.map((g, i) => (
                      <li key={i} className="flex gap-4 items-start">
                         <div className="w-6 h-6 rounded-full bg-indigo/10 text-indigo flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-4 h-4" />
                         </div>
                         <span className="text-lg text-dark">{g}</span>
                      </li>
                    ))
                 ) : (
                   <li className="text-text-secondary">Doelen stelt u zelf op samen met ons.</li>
                 )}
               </ul>
            </div>
         </div>
      </div>

      {/* Slide 3: Oplossing */}
      <div className="pdf-slide bg-white relative flex flex-col justify-center px-16 lg:px-32">
         <div className="max-w-4xl">
            <h2 className="text-5xl font-display font-bold text-dark mb-4 tracking-tight">Onze Oplossing: <br/><span className="text-indigo">{data.projectType || 'Maatwerk'}</span></h2>
            <p className="text-xl text-text-secondary leading-relaxed mb-12">
               Wij verpakken jouw merk in een naadloze digitale ervaring. Snel ontworpen, schaalbaar gebouwd en perfect geoptimaliseerd voor de eindgebruiker.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
                <div className="p-8 bg-cream rounded-3xl border border-warm-grey">
                   <Zap className="w-8 h-8 text-indigo mb-4" />
                   <h4 className="text-xl font-display font-bold mb-2">Technisch Fundament</h4>
                   <p className="text-text-secondary">Moderne architectuur (zoals in dit document de Vite+React basis) zorgt voor bliksemsnelle prestaties, hoge SEO scores en veiligheid.</p>
                </div>
                <div className="p-8 bg-cream rounded-3xl border border-warm-grey">
                   <svg className="w-8 h-8 text-indigo mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                   <h4 className="text-xl font-display font-bold mb-2">Bewezen Flow</h4>
                   <p className="text-text-secondary">Van UI/UX Design slidedecks tot de livegang. We houden je aangesloten in elke fase van het project voor maximale transparantie.</p>
                </div>
            </div>
            
            {data.extraNotes && (
              <div className="mt-8 p-6 border-l-4 border-indigo bg-indigo/5 rounded-r-2xl">
                 <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-light mb-2">Specifieke Wensen</h4>
                 <p className="text-dark font-medium italic">"{data.extraNotes}"</p>
              </div>
            )}
         </div>
      </div>

      {/* Slide 4: Investering & Tijdlijn */}
      <div className="pdf-slide bg-dark text-white relative flex flex-col justify-center px-16 lg:px-32">
          <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white/10"></div>
          
          <div className="grid grid-cols-2 gap-16 relative z-10 w-full max-w-6xl">
              <div>
                 <h2 className="text-5xl font-display font-bold mb-8">De Routekaart</h2>
                 
                 <div className="space-y-12 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[2px] before:bg-white/20">
                    <div className="relative pl-12">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-dark bg-indigo z-10"></div>
                        <h4 className="text-xl font-bold font-display mb-1">Kick-off & Design</h4>
                        <p className="text-white/60">We brainstormen, schetsen de lijnen uit en ontwerpen het visuele jasje.</p>
                    </div>
                    <div className="relative pl-12">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-dark bg-indigo-light z-10"></div>
                        <h4 className="text-xl font-bold font-display mb-1">Development</h4>
                        <p className="text-white/60">Alle functionaliteiten worden pixel-perfect gebouwd.</p>
                    </div>
                    <div className="relative pl-12">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-dark bg-white z-10"></div>
                        <h4 className="text-xl font-bold font-display mb-1">Livegang & Support</h4>
                        <p className="text-white/60">We lanceren en vieren het feestje. Daarna blijven we je partner voor groei.</p>
                    </div>
                 </div>
              </div>
              
              <div className="bg-white text-dark rounded-3xl p-10 flex flex-col justify-center">
                 <div className="flex gap-4 items-center mb-8">
                     <div className="p-3 bg-cream rounded-xl"><Clock className="text-indigo" /></div>
                     <span className="text-sm uppercase tracking-widest font-bold text-text-secondary">Indicatie Geplande Start</span>
                 </div>
                 <p className="text-3xl font-display font-semibold border-b pb-8 border-warm-grey mb-8">{data.timeline || 'In overleg te bepalen'}</p>
                 
                 <div className="flex gap-4 items-center mb-8">
                     <div className="p-3 bg-cream rounded-xl"><CreditCard className="text-indigo" /></div>
                     <span className="text-sm uppercase tracking-widest font-bold text-text-secondary">Investering Range</span>
                 </div>
                 <p className="text-4xl lg:text-5xl font-display font-bold text-indigo">{data.budget || 'Op aanvraag'}</p>
                 <p className="text-sm text-text-secondary mt-4 italic">*Alle genoemde bedragen zijn exclusief BTW.</p>
              </div>
          </div>
      </div>
      
       {/* Slide 5: CTA */}
        <div className="pdf-slide bg-indigo relative flex flex-col items-center justify-center text-center px-16 lg:px-32 text-white">
          <div className="grain-overlay" />
          <h2 className="text-6xl md:text-8xl font-display font-bold mb-6 tracking-tight relative z-10">
            Klaar om te knallen?
          </h2>
          <p className="text-2xl font-medium opacity-80 mb-12 relative z-10">
            Laat ons weten of dit voorstel aansluit bij je verwachtingen. <br/> Wij staan in de startblokken voor {data.clientName}.
          </p>
          <div className="relative z-10 flex gap-4 mt-8">
             <div className="px-8 py-4 bg-white text-indigo rounded-full font-bold text-lg flex items-center gap-2">
                 Zet handtekening <ArrowRight className="w-5 h-5" />
             </div>
          </div>
        </div>

    </div>
  );
}
