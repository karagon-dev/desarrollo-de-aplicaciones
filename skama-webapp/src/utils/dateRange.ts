import type { IDateRangeParams } from '../types';

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getDefaultDateRange(days = 30): IDateRangeParams {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return {
    startDate: toDateInputValue(startDate),
    endDate: toDateInputValue(endDate),
  };
}

export function formatDisplayDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('es-CO');
}
