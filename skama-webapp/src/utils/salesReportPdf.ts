import type { IDateRangeParams, ISalesByProductDto } from '../types';

const pageWidth = 842;
const pageHeight = 595;
const margin = 36;
const rowHeight = 18;
const textEncoder = new TextEncoder();

interface IPdfText {
  x: number;
  y: number;
  size: number;
  text: string;
  font: 'F1' | 'F2';
}

const columns = [
  { label: 'Correo', width: 210, value: (row: ISalesByProductDto) => row.customerEmail },
  { label: 'Producto', width: 240, value: (row: ISalesByProductDto) => row.productName },
  { label: 'Unidades', width: 75, value: (row: ISalesByProductDto) => String(row.totalQuantitySold) },
  { label: 'Calificacion', width: 95, value: (row: ISalesByProductDto) => formatPdfRating(row.averageRating) },
  { label: 'Ventas', width: 120, value: (row: ISalesByProductDto) => formatPdfCurrency(row.totalSales) },
] as const;

function toPdfText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function truncate(value: string, maxCharacters: number): string {
  const cleanValue = value.trim();
  if (cleanValue.length <= maxCharacters) {
    return cleanValue;
  }

  return `${cleanValue.slice(0, Math.max(maxCharacters - 3, 0))}...`;
}

function formatPdfCurrency(value: number): string {
  return `CRC ${new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 }).format(value)}`;
}

function formatPdfRating(value?: number | null): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'Sin calificacion';
  }

  const rounded = Math.round(value * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}/5 estrellas`;
}

function addText(page: IPdfText[], x: number, y: number, text: string, size = 9, font: 'F1' | 'F2' = 'F1') {
  page.push({ x, y, text, size, font });
}

function addTableHeader(page: IPdfText[], y: number) {
  let x = margin;

  for (const column of columns) {
    addText(page, x, y, column.label, 8, 'F2');
    x += column.width;
  }
}

function buildPages(rows: ISalesByProductDto[], dateRange: IDateRangeParams): IPdfText[][] {
  const pages: IPdfText[][] = [[]];
  let page = pages[0];
  let y = pageHeight - margin;

  addText(page, margin, y, 'Reporte de ventas', 16, 'F2');
  y -= 22;
  addText(page, margin, y, `Periodo: ${dateRange.startDate} a ${dateRange.endDate}`, 10);
  y -= 28;

  addTableHeader(page, y);
  y -= rowHeight;

  const reportRows = rows.length > 0 ? rows : [];

  for (const row of reportRows) {
    if (y < margin + rowHeight) {
      page = [];
      pages.push(page);
      y = pageHeight - margin;
      addTableHeader(page, y);
      y -= rowHeight;
    }

    let x = margin;

    for (const column of columns) {
      addText(page, x, y, truncate(column.value(row), Math.floor(column.width / 5.2)), 8);
      x += column.width;
    }

    y -= rowHeight;
  }

  if (rows.length === 0) {
    addText(page, margin, y, 'No hay ventas registradas en el periodo seleccionado.', 10);
  }

  return pages;
}

function buildContentStream(page: IPdfText[]): string {
  return page
    .map((entry) => `BT /${entry.font} ${entry.size} Tf ${entry.x} ${entry.y} Td (${toPdfText(entry.text)}) Tj ET`)
    .join('\n');
}

function createPdfBlob(pages: IPdfText[][]): Blob {
  const objects: string[] = [];
  const pageObjectIds: number[] = [];

  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';

  let nextObjectId = 5;

  for (const page of pages) {
    const pageObjectId = nextObjectId++;
    const contentObjectId = nextObjectId++;
    const content = buildContentStream(page);
    const contentLength = textEncoder.encode(content).length;

    pageObjectIds.push(pageObjectId);
    objects[pageObjectId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectId} 0 R >>`;
    objects[contentObjectId] = `<< /Length ${contentLength} >>\nstream\n${content}\nendstream`;
  }

  objects[2] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageObjectIds.length} >>`;

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  for (let id = 1; id < objects.length; id++) {
    offsets[id] = textEncoder.encode(pdf).length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }

  const xrefOffset = textEncoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;

  for (let id = 1; id < objects.length; id++) {
    pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

export function downloadSalesReportPdf(rows: ISalesByProductDto[], dateRange: IDateRangeParams): void {
  const pdfBlob = createPdfBlob(buildPages(rows, dateRange));
  const objectUrl = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = `reporte-ventas-${dateRange.startDate}-${dateRange.endDate}.pdf`;
  link.click();

  URL.revokeObjectURL(objectUrl);
}
