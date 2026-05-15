import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  BookRendezVousRequest,
  RendezVous,
  RendezVousStatut
} from '../models/rendez-vous.model';

@Injectable({ providedIn: 'root' })
export class RendezVousService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/rendezVous`;

  getAll(): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.baseUrl}/tous`);
  }

  getById(idRendezVous: number): Observable<RendezVous> {
    return this.http.get<RendezVous>(`${this.baseUrl}/${idRendezVous}`);
  }

  getByPatient(idPatient: number): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.baseUrl}/patient/${idPatient}`);
  }

  getByMedecin(idMedecin: number): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.baseUrl}/medecin/${idMedecin}`);
  }

  getByStatut(statut: RendezVousStatut): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.baseUrl}/statut/${statut}`);
  }

  book(
    idPatient: number,
    idMedecin: number,
    request: BookRendezVousRequest
  ): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/prendre/${idPatient}/${idMedecin}`,
      request,
      { responseType: 'text' }
    );
  }

  cancel(idRendezVous: number, motif: string): Observable<string> {
    const params = new HttpParams().set('motif', motif);
    return this.http.put(`${this.baseUrl}/annuler/${idRendezVous}`, null, {
      params,
      responseType: 'text'
    });
  }

  changeStatut(idRendezVous: number, statut: RendezVousStatut): Observable<string> {
    return this.http.put(`${this.baseUrl}/statut/${idRendezVous}/${statut}`, null, {
      responseType: 'text'
    });
  }
}
