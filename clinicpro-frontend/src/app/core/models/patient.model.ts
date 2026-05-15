export interface Patient {
  idPatient?: number;
  nom: string;
  dossierMedical?: string | null;
  dateNaissance?: string | number | null;
  tel: string;
  email?: string | null;
}

export function parsePatientDate(
  value: string | number | null | undefined
): Date | null {
  if (value == null || value === '') {
    return null;
  }
  const date = typeof value === 'number' ? new Date(value) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateForInput(
  value: string | number | null | undefined
): string {
  const date = parsePatientDate(value);
  if (!date) {
    return '';
  }
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
