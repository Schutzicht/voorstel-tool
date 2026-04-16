import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/**
 * Exports all visible slides to a compressed PDF.
 *
 * The slides in the DOM are rendered inside ScaledSlide wrappers that
 * apply a CSS `transform: scale(...)` to fit the preview panel. If we
 * capture them in-place, html2canvas picks up the scaled version and
 * text looks crunched/overlapping. Instead, we clone each slide into a
 * temporary full-size (1280×720) off-screen container with NO transform,
 * capture THAT, then clean up.
 */
export async function exportPDF(filename: string) {
  const slideWrappers = document.querySelectorAll<HTMLElement>('[data-slide]');
  if (slideWrappers.length === 0) return;

  // A4 Landscape dimensions in mm
  const pageW = 297;
  const pageH = 210;

  // Create an off-screen staging area at full slide resolution
  const stage = document.createElement('div');
  stage.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 1280px;
    height: 720px;
    overflow: hidden;
    z-index: -1;
    pointer-events: none;
    background: #FAF9F6;
  `;
  document.body.appendChild(stage);

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  try {
    for (let i = 0; i < slideWrappers.length; i++) {
      const slideContent = slideWrappers[i].querySelector('.pdf-slide') as HTMLElement;
      if (!slideContent) continue;

      // Clone the slide into the off-screen stage (full size, no transform)
      const clone = slideContent.cloneNode(true) as HTMLElement;
      clone.style.cssText = `
        width: 1280px;
        height: 720px;
        position: relative;
        transform: none !important;
        overflow: hidden;
      `;
      stage.innerHTML = '';
      stage.appendChild(clone);

      // Small delay to let the clone paint (fonts, images)
      await new Promise((r) => setTimeout(r, 50));

      const canvas = await html2canvas(clone, {
        width: 1280,
        height: 720,
        scale: 2, // 2x for quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FAF9F6',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.85);

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, pageW, pageH);
    }
  } finally {
    // Clean up
    document.body.removeChild(stage);
  }

  const safeName = filename.replace(/[^a-zA-Z0-9\s-]/g, '').trim() || 'Voorstel';
  pdf.save(`Agensea - ${safeName}.pdf`);
}
