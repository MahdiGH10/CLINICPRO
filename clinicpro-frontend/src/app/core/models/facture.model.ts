import { Consultation } from './consultation.model';

export interface Facture {
  idFacture: number;
  dateFacture?: string | number | null;
  montant: number;
  consultation?: Consultation;
}

export function parseFactureDate(
  value: string | number | null | undefined
): Date | null {
  if (value == null || value === '') {
    return null;
  }
  const date = typeof value === 'number' ? new Date(value) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isCurrentMonth(value: string | number | null | undefined): boolean {
  const date = parseFactureDate(value);
  if (!date) {
    return false;
  }
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export function formatMontantTnd(montant: number | null | undefined): string {
  if (montant == null || Number.isNaN(montant)) {
    return '—';
  }
  return `${montant.toLocaleString('fr-TN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TND`;
}
