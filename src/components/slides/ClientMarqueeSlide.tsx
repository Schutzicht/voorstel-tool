import { type ProposalData } from '../../types';

export function ClientMarqueeSlide({ data }: { data: ProposalData }) {
  const logos = [
    { src: "/logos-hero/Logo_Adrz_RGB.png", alt: "ADRZ" },
    { src: "/logos-hero/Bouwgroep R&D.svg", alt: "Bouwgroep R&D" },
    { src: "/logos-hero/Widea.svg", alt: "Widea" },
    { src: "/logos-hero/Arieke van liere.svg", alt: "Arieke van Liere" },
    { src: "/logos-hero/Contemplas.svg", alt: "Contemplas" },
    { src: "/logos-hero/Fractal.svg", alt: "Fractal" },
    { src: "/logos-hero/MIM.svg", alt: "MIM" },
    { src: "/logos-hero/Zeeland podcasts.svg", alt: "Zeeland Podcasts" },
    { src: "/logos-hero/Buurtteams.svg", alt: "Buurtteams" },
    { src: "/logos-hero/omoda.svg", alt: "Omoda" },
    { src: "/logos-hero/roompot.svg", alt: "Roompot" },
    { src: "/logos-hero/zeeland.svg", alt: "Zeeland" },
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
          {[...Array(2)].map((_, i) => (
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
