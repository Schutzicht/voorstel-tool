import { type ProposalData } from '../../types';
import { SlideFooter } from './SlideFooter';

const MAX_GOALS_PER_SLIDE = 3;

/**
 * Returns how many goal slides are needed for the given data.
 */
export function getGoalSlideCount(data: ProposalData): number {
  const goals = data.goals.filter(g => g.text.trim());
  if (goals.length === 0) return 1;
  return Math.ceil(goals.length / MAX_GOALS_PER_SLIDE);
}

/**
 * Renders a single page of goals. `page` is 0-indexed.
 */
export function DoelSlide({ data, page = 0 }: { data: ProposalData; page?: number }) {
  const allGoals = data.goals.filter(g => g.text.trim());
  const goals = allGoals.slice(page * MAX_GOALS_PER_SLIDE, (page + 1) * MAX_GOALS_PER_SLIDE);
  const totalPages = getGoalSlideCount(data);
  const globalOffset = page * MAX_GOALS_PER_SLIDE;

  return (
    <div className="pdf-slide bg-[#FAF9F6] relative flex flex-col p-16 overflow-hidden text-dark">
      <div className="mesh-blob w-[700px] h-[700px] bg-indigo/10 -bottom-[20%] -right-[20%]" style={{ animationDelay: '-3s' }}></div>
      <div className="mb-12 relative z-10 reveal">
        <p className="text-xs uppercase tracking-[0.4em] text-indigo font-bold mb-4">Succes definieren</p>
        <h2 className="text-[3.5rem] font-display font-bold text-dark tracking-tight leading-none">
          Concrete doelen.
          {totalPages > 1 && (
            <span className="text-lg text-text-secondary font-medium ml-4">({page + 1}/{totalPages})</span>
          )}
        </h2>
      </div>

      <div className="flex-1 flex flex-col gap-4 relative z-10">
        {goals.map((goal, i) => (
          <div
            key={goal.id}
            className="flex items-center gap-8 bg-white/60 backdrop-blur-xl rounded-[2rem] px-10 py-8 border border-white shadow-lg reveal"
            style={{ animationDelay: `${0.2 + i * 0.1}s` }}
          >
            <span className="font-display text-5xl font-bold text-indigo leading-none shrink-0 w-16">
              {(globalOffset + i + 1).toString().padStart(2, '0')}
            </span>
            <p className="text-dark font-medium text-[1.4rem] leading-snug">{goal.text}</p>
          </div>
        ))}
      </div>
      <SlideFooter />
    </div>
  );
}
