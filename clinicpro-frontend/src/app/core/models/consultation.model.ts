import { RendezVous } from './rendez-vous.model';

export interface Consultation {
  idConsultation: number;
  diagnostic: string;
  ordonnance?: string | null;
  prix: number;
  rendezVous?: RendezVous;
}

export interface CreateConsultationRequest {
  diagnostic: string;
  ordonnance?: string | null;
  prix: number;
}
