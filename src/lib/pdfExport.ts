import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/**
 * Exports all visible slides to a compressed PDF.
 * Finds all elements with [data-slide] attribute and renders them.
 */
export async function exportPDF(filename: string) {
  const slideWrappers = document.querySelectorAll<HTMLElement>('[data-slide]');
  if (slideWrappers.length === 0) return;

  // A4 Landscape dimensions in mm
  const pageW = 297;
  const pageH = 210;

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  for (let i = 0; i < slideWrappers.length; i++) {
    // Find the actual 1280x720 slide content inside
    const slideContent = slideWrappers[i].querySelector('.pdf-slide') as HTMLElement;
    if (!slideContent) continue;

    const canvas = await html2canvas(slideContent, {
      width: 1280,
      height: 720,
      scale: 2, // 2x for quality, but JPEG compression keeps size down
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FAF9F6',
      logging: false,
    });

    // Convert to JPEG at 85% quality — massively reduces file size vs PNG
    const imgData = canvas.toDataURL('image/jpeg', 0.85);

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, pageW, pageH);
  }

  const safeName = filename.replace(/[^a-zA-Z0-9\s-]/g, '').trim() || 'Voorstel';
  pdf.save(`Agensea - ${safeName}.pdf`);
}
