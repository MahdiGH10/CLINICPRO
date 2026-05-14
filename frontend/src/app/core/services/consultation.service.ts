import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Consultation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  constructor(private http: HttpService) {}

  getAll(): Promise<Consultation[]> {
    return this.http.get<Consultation[]>('/consultation/toutes');
  }

  getById(id: number): Promise<Consultation> {
    return this.http.get<Consultation>(`/consultation/${id}`);
  }

  create(consultation: Consultation): Promise<Consultation> {
    const rendezVousId = (consultation as any)?.rendezVous?.idRendezVous ?? (consultation as any)?.rendezVousId ?? 0;
    return this.http.post<Consultation>(`/consultation/ajouter/${rendezVousId}`, consultation, 'text');
  }

  update(id: number, consultation: Consultation): Promise<Consultation> {
    return this.http.put<Consultation>(`/consultation/mettreAJour/${id}`, consultation, 'text');
  }

  delete(id: number): Promise<any> {
    return this.http.delete<any>(`/consultation/supprimer/${id}`, 'text');
  }

  getByPatient(patientId: number): Promise<Consultation[]> {
    return this.http.get<Consultation[]>(`/consultation/patient/${patientId}`);
  }

  getByMedecin(medecinId: number): Promise<Consultation[]> {
    return this.http.get<Consultation[]>(`/consultation/medecin/${medecinId}`);
  }
}
