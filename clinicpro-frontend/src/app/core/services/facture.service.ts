import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Facture } from '../models/facture.model';

@Injectable({ providedIn: 'root' })
export class FactureService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/facture`;

  getAll(): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.baseUrl}/toutes`);
  }

  getMine(): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.baseUrl}/mes`);
  }

  getById(idFacture: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.baseUrl}/${idFacture}`);
  }

  getByConsultation(idConsultation: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.baseUrl}/consultation/${idConsultation}`);
  }

  generate(idConsultation: number): Observable<string> {
    return this.http.post(`${this.baseUrl}/generer/${idConsultation}`, null, {
      responseType: 'text'
    });
  }
}
