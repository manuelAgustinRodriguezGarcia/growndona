import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function dayNumber(startDate: string, date: string): number {
  return differenceInCalendarDays(parseISO(date), parseISO(startDate)) + 1;
}

export function currentDayNumber(startDate: string, endDate?: string | null): number {
  const end = endDate ?? todayISO();
  return Math.max(1, dayNumber(startDate, end));
}

export function daysBetween(startDate: string, endDate?: string | null): number {
  const end = endDate ?? todayISO();
  return Math.max(1, differenceInCalendarDays(parseISO(end), parseISO(startDate)) + 1);
}

export function formatDate(date: string): string {
  return format(parseISO(date), "d 'de' MMMM 'de' yyyy", { locale: es });
}

export function formatShortDate(date: string): string {
  return format(parseISO(date), "d MMM", { locale: es });
}

export function formatDateTime(timestamp: string): string {
  return format(new Date(timestamp), "d MMM yyyy, HH:mm", { locale: es });
}

export function relativeDate(date: string): string {
  const diff = differenceInCalendarDays(new Date(), parseISO(date));
  if (diff <= 0) return "Hoy";
  if (diff === 1) return "Ayer";
  return `Hace ${diff} días`;
}

export function relativeTimestamp(timestamp: string): string {
  const diff = differenceInCalendarDays(new Date(), new Date(timestamp));
  if (diff <= 0) return "Hoy";
  if (diff === 1) return "Ayer";
  return `Hace ${diff} días`;
}
