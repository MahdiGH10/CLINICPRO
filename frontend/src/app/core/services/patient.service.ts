import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Patient } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private http: HttpService) {}

  getAll(): Promise<Patient[]> {
    return this.http.get<Patient[]>('/patients');
  }

  getById(id: number): Promise<Patient> {
    return this.http.get<Patient>(`/patients/${id}`);
  }

  create(patient: Patient): Promise<Patient> {
    return this.http.post<Patient>('/patients', patient);
  }

  update(id: number, patient: Patient): Promise<Patient> {
    return this.http.put<Patient>(`/patients/${id}`, patient);
  }

  delete(id: number): Promise<any> {
    return this.http.delete<any>(`/patients/${id}`);
  }

  getDossier(id: number): Promise<any> {
    return this.http.get<any>(`/patients/${id}/dossier`);
  }

  updateDossier(id: number, dossier: string): Promise<any> {
    return this.http.put<any>(`/patients/${id}/dossier`, { dossierMedical: dossier });
  }
}
