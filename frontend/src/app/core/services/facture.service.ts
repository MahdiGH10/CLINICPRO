import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Facture } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  constructor(private http: HttpService) {}

  getAll(): Promise<Facture[]> {
    return this.http.get<Facture[]>('/facture/toutes');
  }

  getById(id: number): Promise<Facture> {
    return this.http.get<Facture>(`/facture/${id}`);
  }

  create(facture: Facture): Promise<Facture> {
    return this.http.post<Facture>('/facture/generer/' + (facture as any)?.consultation?.idConsultation, facture, 'text');
  }

  update(id: number, facture: Facture): Promise<Facture> {
    return this.http.put<Facture>(`/facture/${id}`, facture, 'text');
  }

  delete(id: number): Promise<any> {
    return this.http.delete<any>(`/facture/${id}`, 'text');
  }

  getByConsultation(consultationId: number): Promise<Facture> {
    return this.http.get<Facture>(`/facture/consultation/${consultationId}`);
  }
}
