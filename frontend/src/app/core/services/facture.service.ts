import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Facture } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  constructor(private http: HttpService) {}

  getAll(): Promise<Facture[]> {
    return this.http.get<Facture[]>('/factures');
  }

  getById(id: number): Promise<Facture> {
    return this.http.get<Facture>(`/factures/${id}`);
  }

  create(facture: Facture): Promise<Facture> {
    return this.http.post<Facture>('/factures', facture);
  }

  update(id: number, facture: Facture): Promise<Facture> {
    return this.http.put<Facture>(`/factures/${id}`, facture);
  }

  delete(id: number): Promise<any> {
    return this.http.delete<any>(`/factures/${id}`);
  }

  getByConsultation(consultationId: number): Promise<Facture> {
    return this.http.get<Facture>(`/factures/consultation/${consultationId}`);
  }
}
