import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Consultation,
  CreateConsultationRequest
} from '../models/consultation.model';

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/consultation`;

  getByPatient(idPatient: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.baseUrl}/patient/${idPatient}`);
  }

  getByMedecin(idMedecin: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.baseUrl}/medecin/${idMedecin}`);
  }

  getById(idConsultation: number): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.baseUrl}/${idConsultation}`);
  }

  create(
    idRendezVous: number,
    request: CreateConsultationRequest
  ): Observable<string> {
    return this.http.post(`${this.baseUrl}/ajouter/${idRendezVous}`, request, {
      responseType: 'text'
    });
  }
}
