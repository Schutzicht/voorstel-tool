import { type ProposalData } from '../../types';
import { MeshBackground } from './MeshBackground';
import { SlideFooter } from './SlideFooter';

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
      <SlideFooter />
    </div>
  );
}
