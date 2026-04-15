/**
 * Shared slide footer — small tagline pinned bottom-right on every slide.
 * Styling matches the previous per-slide footers (uppercase tracking,
 * dark/20 font-display) so it reads as a subtle watermark.
 */
export function SlideFooter() {
  return (
    <p className="absolute bottom-6 right-8 text-[10px] uppercase tracking-[0.2em] text-dark/25 font-bold font-display z-20">
      Agensea · AI-first digital agency
    </p>
  );
}
