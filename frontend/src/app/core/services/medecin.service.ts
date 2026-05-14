import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Medecin } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  constructor(private http: HttpService) {}

  getAll(): Promise<Medecin[]> {
    return this.http.get<Medecin[]>('/medecin/tous');
  }

  getById(id: number): Promise<Medecin> {
    return this.http.get<Medecin>(`/medecin/${id}`);
  }

  create(medecin: Medecin): Promise<Medecin> {
    return this.http.post<Medecin>('/medecin/ajouter', medecin, 'text');
  }

  update(id: number, medecin: Medecin): Promise<Medecin> {
    return this.http.put<Medecin>(`/medecin/mettreAJour/${id}`, medecin, 'text');
  }

  delete(id: number): Promise<any> {
    return this.http.delete<any>(`/medecin/supprimer/${id}`, 'text');
  }

  getBySpecialty(specialty: string): Promise<Medecin[]> {
    return this.http.get<Medecin[]>(`/medecin/specialite/${specialty}`);
  }
}
