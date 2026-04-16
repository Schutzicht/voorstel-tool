import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/**
 * Exports all visible slides to a compressed PDF.
 *
 * Clones each slide into an off-screen full-size container so
 * html2canvas captures at 1280×720 without any scale-transform
 * artifacts from the ScaledSlide preview wrapper.
 */
export async function exportPDF(filename: string) {
  const slideWrappers = document.querySelectorAll<HTMLElement>('[data-slide]');
  if (slideWrappers.length === 0) return;

  const pageW = 297; // A4 landscape mm
  const pageH = 210;

  // Off-screen staging area at native slide resolution
  const stage = document.createElement('div');
  stage.style.cssText =
    'position:fixed;left:-9999px;top:0;width:1280px;height:720px;' +
    'overflow:hidden;z-index:-1;pointer-events:none;background:#FAF9F6;';
  document.body.appendChild(stage);

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  try {
    for (let i = 0; i < slideWrappers.length; i++) {
      const slideContent = slideWrappers[i].querySelector('.pdf-slide') as HTMLElement;
      if (!slideContent) continue;

      // Clone into the off-screen stage
      const clone = slideContent.cloneNode(true) as HTMLElement;

      // Reset any transform that ScaledSlide may have inherited
      clone.style.transform = 'none';
      clone.style.position = 'relative';

      // Force all .reveal elements to their final visible state —
      // cloned nodes don't have the IntersectionObserver trigger,
      // so without this they stay at opacity:0 / translateY(30px).
      clone.querySelectorAll('.reveal').forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.classList.add('visible');
        htmlEl.style.opacity = '1';
        htmlEl.style.transform = 'none';
        htmlEl.style.animation = 'none';
      });

      // Also ensure the clone itself is fully opaque if it has .reveal
      if (clone.classList.contains('reveal')) {
        clone.classList.add('visible');
        clone.style.opacity = '1';
        clone.style.transform = 'none';
        clone.style.animation = 'none';
      }

      // Remove any backdrop-filter / blur that may cause rendering issues
      clone.querySelectorAll('[class*="backdrop"]').forEach((el) => {
        (el as HTMLElement).style.backdropFilter = 'none';
        (el as HTMLElement).style.setProperty('-webkit-backdrop-filter', 'none');
      });

      stage.innerHTML = '';
      stage.appendChild(clone);

      // Brief paint delay for fonts / images
      await new Promise((r) => setTimeout(r, 80));

      const canvas = await html2canvas(clone, {
        width: 1280,
        height: 720,
        scale: 2,
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
    document.body.removeChild(stage);
  }

  const safeName = filename.replace(/[^a-zA-Z0-9\s-]/g, '').trim() || 'Voorstel';
  pdf.save(`Agensea - ${safeName}.pdf`);
}
