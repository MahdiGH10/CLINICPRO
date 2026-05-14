import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { RendezVous } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  constructor(private http: HttpService) {}

  getAll(): Promise<RendezVous[]> {
    return this.http.get<RendezVous[]>('/rendezVous/tous');
  }

  getById(id: number): Promise<RendezVous> {
    return this.http.get<RendezVous>(`/rendezVous/${id}`);
  }

  create(rendezVous: RendezVous): Promise<RendezVous> {
    const patientId = (rendezVous as any)?.patient?.idPatient ?? (rendezVous as any)?.patientId ?? 0;
    const medecinId = (rendezVous as any)?.medecin?.idMedecin ?? (rendezVous as any)?.medecinId ?? 0;
    return this.http.post<RendezVous>(`/rendezVous/prendre/${patientId}/${medecinId}`, rendezVous, 'text');
  }

  update(id: number, rendezVous: RendezVous): Promise<RendezVous> {
    return this.http.put<RendezVous>(`/rendezVous/statut/${id}/${(rendezVous as any)?.statut ?? 'PLANIFIE'}`, rendezVous, 'text');
  }

  delete(id: number): Promise<any> {
    return this.http.delete<any>(`/rendezVous/supprimer/${id}`, 'text');
  }

  cancel(id: number, motif: string): Promise<any> {
    return this.http.put<any>(`/rendezVous/annuler/${id}`, motif, 'text');
  }

  getByPatient(patientId: number): Promise<RendezVous[]> {
    return this.http.get<RendezVous[]>(`/rendezVous/patient/${patientId}`);
  }

  getByMedecin(medecinId: number): Promise<RendezVous[]> {
    return this.http.get<RendezVous[]>(`/rendezVous/medecin/${medecinId}`);
  }
}
