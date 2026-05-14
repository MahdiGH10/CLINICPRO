import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Medecin } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  constructor(private http: HttpService) {}

  getAll(): Promise<Medecin[]> {
    return this.http.get<Medecin[]>('/medecins');
  }

  getById(id: number): Promise<Medecin> {
    return this.http.get<Medecin>(`/medecins/${id}`);
  }

  create(medecin: Medecin): Promise<Medecin> {
    return this.http.post<Medecin>('/medecins', medecin);
  }

  update(id: number, medecin: Medecin): Promise<Medecin> {
    return this.http.put<Medecin>(`/medecins/${id}`, medecin);
  }

  delete(id: number): Promise<any> {
    return this.http.delete<any>(`/medecins/${id}`);
  }

  getBySpecialty(specialty: string): Promise<Medecin[]> {
    return this.http.get<Medecin[]>(`/medecins/specialty/${specialty}`);
  }
}
