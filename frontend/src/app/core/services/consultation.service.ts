import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Consultation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  constructor(private http: HttpService) {}

  getAll(): Promise<Consultation[]> {
    return this.http.get<Consultation[]>('/consultations');
  }

  getById(id: number): Promise<Consultation> {
    return this.http.get<Consultation>(`/consultations/${id}`);
  }

  create(consultation: Consultation): Promise<Consultation> {
    return this.http.post<Consultation>('/consultations', consultation);
  }

  update(id: number, consultation: Consultation): Promise<Consultation> {
    return this.http.put<Consultation>(`/consultations/${id}`, consultation);
  }

  delete(id: number): Promise<any> {
    return this.http.delete<any>(`/consultations/${id}`);
  }

  getByPatient(patientId: number): Promise<Consultation[]> {
    return this.http.get<Consultation[]>(`/consultations/patient/${patientId}`);
  }

  getByMedecin(medecinId: number): Promise<Consultation[]> {
    return this.http.get<Consultation[]>(`/consultations/medecin/${medecinId}`);
  }
}
