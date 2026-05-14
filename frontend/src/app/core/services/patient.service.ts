import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Patient } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private http: HttpService) {}

  getAll(): Promise<Patient[]> {
    return this.http.get<Patient[]>('/patient/tous');
  }

  getById(id: number): Promise<Patient> {
    return this.http.get<Patient>(`/patient/${id}`);
  }

  create(patient: Patient): Promise<Patient> {
    return this.http.post<Patient>('/patient/ajouter', patient, 'text');
  }

  update(id: number, patient: Patient): Promise<Patient> {
    return this.http.put<Patient>(`/patient/mettreAJour/${id}`, patient, 'text');
  }

  delete(id: number): Promise<any> {
    return this.http.delete<any>(`/patient/supprimer/${id}`, 'text');
  }

  getDossier(id: number): Promise<any> {
    return this.http.get<any>(`/patient/${id}`);
  }

  updateDossier(id: number, dossier: string): Promise<any> {
    return this.http.put<any>(`/patient/dossierMedical/${id}`, { dossierMedical: dossier }, 'text');
  }
}
