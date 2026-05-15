import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Patient } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/patient`;

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/tous`);
  }

  getById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/${id}`);
  }

  searchByName(nom: string): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/nom/${encodeURIComponent(nom)}`);
  }

  create(patient: Patient): Observable<string> {
    return this.http.post(`${this.baseUrl}/ajouter`, patient, {
      responseType: 'text'
    });
  }

  update(id: number, patient: Patient): Observable<string> {
    return this.http.put(`${this.baseUrl}/mettreAJour/${id}`, patient, {
      responseType: 'text'
    });
  }

  updateDossierMedical(id: number, dossierMedical: string): Observable<string> {
    return this.http.put(
      `${this.baseUrl}/dossierMedical/${id}`,
      { dossierMedical },
      { responseType: 'text' }
    );
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/supprimer/${id}`, {
      responseType: 'text'
    });
  }
}
