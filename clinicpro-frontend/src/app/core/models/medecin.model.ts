export interface Medecin {
  idMedecin: number;
  nom: string;
  specialite: string;
  disponibilite?: string | null;
  email?: string | null;
}

export interface CreateMedecinRequest {
  nom: string;
  specialite: string;
  disponibilite?: string | null;
  email: string;
  password: string;
}

export interface UserCreationResponse {
  message: string;
  email: string;
  role: string;
  motDePasseTemporaire?: string;
}

export function getMedecinInitials(nom: string): string {
  const parts = nom.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return nom.trim().slice(0, 2).toUpperCase();
}
