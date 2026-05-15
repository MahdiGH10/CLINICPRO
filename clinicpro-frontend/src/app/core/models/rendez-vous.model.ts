import { Patient } from './patient.model';
import { Medecin } from './medecin.model';

export type RendezVousStatut = 'PLANIFIE' | 'ANNULE' | 'TERMINE';

export interface RendezVous {
  idRendezVous: number;
  date?: string | number | null;
  heure?: string;
  motif?: string;
  statut?: RendezVousStatut | string;
  motifAnnulation?: string;
  patient?: Patient;
  medecin?: Medecin;
}

export interface BookRendezVousRequest {
  date: string;
  heure: string;
  motif: string;
}

export const TIME_SLOTS: readonly string[] = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00'
] as const;

export function parseRendezVousDate(
  value: string | number | null | undefined
): Date | null {
  if (value == null || value === '') {
    return null;
  }

  if (typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const raw = String(value).trim();
  const dateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateOnly) {
    const y = Number(dateOnly[1]);
    const m = Number(dateOnly[2]) - 1;
    const d = Number(dateOnly[3]);
    return new Date(y, m, d);
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isSameCalendarDay(
  a: string | number | Date | null | undefined,
  b: string | number | Date | null | undefined
): boolean {
  const dateA = a instanceof Date ? a : parseRendezVousDate(a as string | number);
  const dateB = b instanceof Date ? b : parseRendezVousDate(b as string | number);
  if (!dateA || !dateB) {
    return false;
  }
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function isToday(value: string | number | null | undefined): boolean {
  return isSameCalendarDay(value, new Date());
}

export function isTomorrow(value: string | number | null | undefined): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameCalendarDay(value, tomorrow);
}

export function isUpcomingDate(value: string | number | null | undefined): boolean {
  const date = parseRendezVousDate(value);
  if (!date) {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return target.getTime() >= today.getTime();
}

export function compareRendezVous(a: RendezVous, b: RendezVous): number {
  const dateA = parseRendezVousDate(a.date);
  const dateB = parseRendezVousDate(b.date);
  if (!dateA && !dateB) {
    return 0;
  }
  if (!dateA) {
    return 1;
  }
  if (!dateB) {
    return -1;
  }
  const dayDiff = dateA.getTime() - dateB.getTime();
  if (dayDiff !== 0) {
    return dayDiff;
  }
  return (a.heure ?? '').localeCompare(b.heure ?? '');
}

export function toApiDateString(date: Date | string): string {
  if (typeof date === 'string') {
    return date;
  }
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
