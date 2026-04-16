import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/**
 * Exports all visible slides to a compressed PDF.
 *
 * Uses the same technique as the ORganized report tool:
 * - Clones each slide off-screen at full native size
 * - Adds a `pdf-rendering` body class for print-specific CSS
 * - html2canvas uses windowWidth/windowHeight from the element's
 *   own scroll dimensions (no forced viewport override)
 * - Result: text renders at its natural proportions, no stretching
 */
export async function exportPDF(filename: string) {
  const slideWrappers = document.querySelectorAll<HTMLElement>('[data-slide]');
  if (slideWrappers.length === 0) return;

  const pageW = 297; // A4 landscape mm
  const pageH = 210;

  // Signal to CSS that we're rendering for PDF
  document.body.classList.add('pdf-rendering');

  // Off-screen staging area — no fixed dimensions, let the slide's
  // own .pdf-slide class (1280×720) determine the size.
  const stage = document.createElement('div');
  stage.style.cssText =
    'position:fixed;left:-9999px;top:0;' +
    'overflow:visible;z-index:-1;pointer-events:none;';
  document.body.appendChild(stage);

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  try {
    for (let i = 0; i < slideWrappers.length; i++) {
      const slideContent = slideWrappers[i].querySelector('.pdf-slide') as HTMLElement;
      if (!slideContent) continue;

      // Clone into the off-screen stage
      const clone = slideContent.cloneNode(true) as HTMLElement;
      clone.style.transform = 'none';

      // Force all .reveal elements to their final visible state
      clone.querySelectorAll('.reveal').forEach((el) => {
        const h = el as HTMLElement;
        h.classList.add('visible');
        h.style.opacity = '1';
        h.style.transform = 'none';
        h.style.animation = 'none';
      });
      if (clone.classList.contains('reveal')) {
        clone.classList.add('visible');
        clone.style.opacity = '1';
        clone.style.transform = 'none';
        clone.style.animation = 'none';
      }

      // Disable backdrop-filter (html2canvas can't render it)
      clone.querySelectorAll('*').forEach((el) => {
        const h = el as HTMLElement;
        const bf = getComputedStyle(h).backdropFilter;
        if (bf && bf !== 'none') {
          h.style.backdropFilter = 'none';
          h.style.setProperty('-webkit-backdrop-filter', 'none');
        }
      });

      stage.innerHTML = '';
      stage.appendChild(clone);

      // Let the clone paint (fonts, images)
      await new Promise((r) => setTimeout(r, 100));

      // Capture at the element's own natural scroll dimensions
      // — no forced width/height, matches the ORganized technique
      const canvas = await html2canvas(clone, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FAF9F6',
        logging: false,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.78);
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, pageW, pageH, undefined, 'FAST');
    }
  } finally {
    document.body.removeChild(stage);
    document.body.classList.remove('pdf-rendering');
  }

  const safeName = filename.replace(/[^a-zA-Z0-9\s-]/g, '').trim() || 'Voorstel';
  pdf.save(`Agensea - ${safeName}.pdf`);
}
