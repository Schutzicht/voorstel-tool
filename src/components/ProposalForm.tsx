import { useState } from 'react';
import { initialData, PROJECT_TYPES, GOALS_OPTIONS, BUDGET_RANGES, TIMELINE_OPTIONS, type ProposalData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Download, Wand2 } from 'lucide-react';
import clsx from 'clsx';

interface ProposalFormProps {
  onCommit: (data: ProposalData) => void;
}

export default function ProposalForm({ onCommit }: ProposalFormProps) {
  const [data, setData] = useState<ProposalData>(initialData);
  const [step, setStep] = useState(0);

  const handleNext = () => setStep(s => Math.min(s + 1, 6));
  const handlePrev = () => setStep(s => Math.max(s - 1, 0));

  const handleCheckbox = (goal: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal) 
        : [...prev.goals, goal]
    }));
  };

  const steps = [
    { title: "Intro", subtitle: "Aan wie sturen we dit?" },
    { title: "Project", subtitle: "Wat gaan we bouwen?" },
    { title: "Doelen", subtitle: "Wat willen we bereiken?" },
    { title: "Kader", subtitle: "Budget & Tijdlijn" },
    { title: "Details", subtitle: "Zijn er nog extra details?" },
    { title: "Klaar", subtitle: "Genereer het slidedeck" },
  ];

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Bedrijfsnaam</label>
              <input 
                type="text" 
                autoFocus
                value={data.clientName} 
                onChange={(e) => setData({...data, clientName: e.target.value})}
                className="w-full text-2xl font-display bg-transparent border-b-2 border-warm-grey focus:border-indigo outline-none py-2 transition-colors"
                placeholder="Voorbeeld BV"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Contactpersoon</label>
              <input 
                type="text" 
                value={data.contactPerson} 
                onChange={(e) => setData({...data, contactPerson: e.target.value})}
                className="w-full text-2xl font-display bg-transparent border-b-2 border-warm-grey focus:border-indigo outline-none py-2 transition-colors"
                placeholder="Voornaam Achternaam"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid gap-3">
            {PROJECT_TYPES.map(pt => (
              <button 
                key={pt}
                onClick={() => { setData({...data, projectType: pt}); handleNext(); }}
                className={clsx(
                  "flex items-center justify-between p-4 rounded-xl border text-left transition-all interactive",
                  data.projectType === pt ? "border-indigo bg-indigo/5 ring-1 ring-indigo" : "border-warm-grey bg-white hover:border-indigo"
                )}
              >
                <span className="font-display font-medium text-lg">{pt}</span>
                {data.projectType === pt && <Check className="text-indigo" />}
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOALS_OPTIONS.map(goal => (
              <button 
                key={goal}
                onClick={() => handleCheckbox(goal)}
                className={clsx(
                  "flex items-start gap-3 p-4 rounded-xl border text-left transition-all interactive",
                  data.goals.includes(goal) ? "border-indigo bg-indigo/5 ring-1 ring-indigo" : "border-warm-grey bg-white hover:border-indigo"
                )}
              >
                <div className={clsx("w-5 h-5 rounded mt-0.5 shrink-0 flex items-center justify-center border", data.goals.includes(goal) ? "bg-indigo border-indigo" : "border-muted bg-white")}>
                  {data.goals.includes(goal) && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="font-medium text-sm text-text-primary leading-tight">{goal}</span>
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-3">Budget / Investering</label>
              <div className="flex flex-wrap gap-2">
                {BUDGET_RANGES.map(br => (
                  <button 
                    key={br}
                    onClick={() => setData({...data, budget: br})}
                    className={clsx(
                      "px-4 py-2 rounded-full border text-sm font-medium transition-colors interactive",
                      data.budget === br ? "bg-indigo text-white border-indigo" : "bg-white border-warm-grey text-text-secondary hover:border-indigo hover:text-indigo"
                    )}
                  >{br}</button>
                ))}
            </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-3">Start/Doorlooptijd</label>
              <div className="flex flex-wrap gap-2">
                {TIMELINE_OPTIONS.map(tl => (
                  <button 
                    key={tl}
                    onClick={() => setData({...data, timeline: tl})}
                    className={clsx(
                      "px-4 py-2 rounded-full border text-sm font-medium transition-colors interactive",
                      data.timeline === tl ? "bg-indigo text-white border-indigo" : "bg-white border-warm-grey text-text-secondary hover:border-indigo hover:text-indigo"
                    )}
                  >{tl}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
             <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Gewenste stijl (Tone-of-Voice)</label>
              <input 
                type="text" 
                value={data.toneOfVoice} 
                onChange={(e) => setData({...data, toneOfVoice: e.target.value})}
                className="w-full text-lg font-display bg-transparent border-b border-warm-grey focus:border-indigo outline-none py-2 transition-colors mb-6"
                placeholder="Bijv. Ambitieus, Premium, Toegankelijk"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Aanvullende opmerkingen / Focuspunten</label>
              <textarea 
                rows={4}
                value={data.extraNotes} 
                onChange={(e) => setData({...data, extraNotes: e.target.value})}
                className="w-full text-base bg-white/50 backdrop-blur-sm border border-warm-grey rounded-2xl focus:border-indigo outline-none p-4 transition-colors resize-none"
                placeholder="Wat is nog belangrijk om te benadrukken in dit specifieke voorstel?"
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="py-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-indigo/10 text-indigo rounded-full flex items-center justify-center mb-6">
               <Wand2 className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-display font-medium text-dark mb-4">Klaar om de magie te starten</h3>
            <p className="text-text-secondary max-w-sm mb-8">
              We hebben alle ingredienten voor {data.clientName || 'de klant'}. Klik hieronder om het Agensea slidedeck te genereren!
            </p>
            <button 
              onClick={() => onCommit(data)}
              className="bg-indigo text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-light transition-colors shadow-lg shadow-indigo/20 flex items-center gap-2 interactive"
            >
              Genereer Slidedeck <Download className="w-5 h-5" />
            </button>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col min-h-[500px] justify-between z-10 relative">
      <div>
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={clsx("h-1 flex-1 rounded-full bg-warm-grey transition-colors", i <= step ? "bg-indigo" : "")} />
          ))}
        </div>
        
        <div className="mb-10">
          <p className="text-sm font-bold tracking-widest uppercase text-indigo mb-2">Stap {step + 1} van {steps.length}</p>
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-dark">{steps[step].title}</h2>
          <p className="text-text-secondary text-lg mt-2">{steps[step].subtitle}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {step < 5 && (
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-warm-grey">
          <button 
            onClick={handlePrev}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2 font-medium text-text-secondary hover:text-dark disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Terug
          </button>
          
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 bg-dark text-white px-6 py-3 rounded-full font-medium hover:bg-black transition-colors shadow-xl interactive"
          >
            Volgende <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
