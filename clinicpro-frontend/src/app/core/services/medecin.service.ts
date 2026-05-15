import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateMedecinRequest,
  Medecin,
  UserCreationResponse
} from '../models/medecin.model';

@Injectable({ providedIn: 'root' })
export class MedecinService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/medecin`;
  private readonly authUrl = `${environment.apiBaseUrl}/auth`;

  getAll(): Observable<Medecin[]> {
    return this.http.get<Medecin[]>(`${this.baseUrl}/tous`);
  }

  getById(id: number): Observable<Medecin> {
    return this.http.get<Medecin>(`${this.baseUrl}/${id}`);
  }

  getBySpecialite(specialite: string): Observable<Medecin[]> {
    return this.http.get<Medecin[]>(
      `${this.baseUrl}/specialite/${encodeURIComponent(specialite)}`
    );
  }

  getByDisponibilite(disponibilite: string): Observable<Medecin[]> {
    return this.http.get<Medecin[]>(
      `${this.baseUrl}/disponible/${encodeURIComponent(disponibilite)}`
    );
  }

  create(request: CreateMedecinRequest): Observable<UserCreationResponse> {
    return this.http.post<UserCreationResponse>(
      `${this.authUrl}/admin/medecins`,
      request
    );
  }
}
