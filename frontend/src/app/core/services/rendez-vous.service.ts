import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { RendezVous } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  constructor(private http: HttpService) {}

  getAll(): Promise<RendezVous[]> {
    return this.http.get<RendezVous[]>('/rendez-vous');
  }

  getById(id: number): Promise<RendezVous> {
    return this.http.get<RendezVous>(`/rendez-vous/${id}`);
  }

  create(rendezVous: RendezVous): Promise<RendezVous> {
    return this.http.post<RendezVous>('/rendez-vous', rendezVous);
  }

  update(id: number, rendezVous: RendezVous): Promise<RendezVous> {
    return this.http.put<RendezVous>(`/rendez-vous/${id}`, rendezVous);
  }

  delete(id: number): Promise<any> {
    return this.http.delete<any>(`/rendez-vous/${id}`);
  }

  cancel(id: number, motif: string): Promise<any> {
    return this.http.put<any>(`/rendez-vous/annuler/${id}`, { motifAnnulation: motif });
  }

  getByPatient(patientId: number): Promise<RendezVous[]> {
    return this.http.get<RendezVous[]>(`/rendez-vous/patient/${patientId}`);
  }

  getByMedecin(medecinId: number): Promise<RendezVous[]> {
    return this.http.get<RendezVous[]>(`/rendez-vous/medecin/${medecinId}`);
  }
}
