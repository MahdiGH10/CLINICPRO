import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { PatientService } from './patient.service';
import { MedecinService } from './medecin.service';
import { Patient } from '../models/patient.model';
import { Medecin } from '../models/medecin.model';

/**
 * Lie le compte connecté au profil métier Patient ou Médecin.
 */
@Injectable({ providedIn: 'root' })
export class UserContextService {
  private readonly authService = inject(AuthService);
  private readonly patientService = inject(PatientService);
  private readonly medecinService = inject(MedecinService);

  private readonly patientProfile = signal<Patient | null>(null);
  private readonly medecinProfile = signal<Medecin | null>(null);
  private readonly resolved = signal(false);

  readonly currentPatient = this.patientProfile.asReadonly();
  readonly currentMedecin = this.medecinProfile.asReadonly();
  readonly isResolved = this.resolved.asReadonly();

  async ensureResolved(force = false): Promise<void> {
    if (this.resolved() && !force) {
      return;
    }

    const email = this.authService.currentUser().email;
    const role = this.authService.currentUser().role;

    if (!email || !role || !this.authService.isLoggedIn()) {
      this.resolved.set(true);
      return;
    }

    try {
      const me = await firstValueFrom(this.authService.getMe());

      if (me.idPatient != null) {
        try {
          this.patientProfile.set(await firstValueFrom(this.patientService.getById(me.idPatient)));
        } catch {
          this.patientProfile.set({ idPatient: me.idPatient } as Patient);
        }
      }

      if (me.idMedecin != null) {
        try {
          this.medecinProfile.set(await firstValueFrom(this.medecinService.getById(me.idMedecin)));
        } catch {
          this.medecinProfile.set({ idMedecin: me.idMedecin } as Medecin);
        }
      }

      if (role === 'PATIENT' && !this.patientProfile()) {
        await this.resolvePatientByEmail(email);
      }

      if (role === 'MEDECIN' && !this.medecinProfile()) {
        await this.resolveMedecinByEmail(email);
      }
    } catch {
      if (role === 'PATIENT') {
        await this.resolvePatientByEmail(email);
      }
      if (role === 'MEDECIN') {
        await this.resolveMedecinByEmail(email);
      }
    } finally {
      this.resolved.set(true);
    }
  }

  reset(): void {
    this.patientProfile.set(null);
    this.medecinProfile.set(null);
    this.resolved.set(false);
  }

  private async resolvePatientByEmail(email: string): Promise<void> {
    const patients = await firstValueFrom(this.patientService.getAll());
    const match = patients.find(p => p.email?.toLowerCase() === email.toLowerCase());
    this.patientProfile.set(match ?? null);
  }

  private async resolveMedecinByEmail(email: string): Promise<void> {
    const medecins = await firstValueFrom(this.medecinService.getAll());
    const match = medecins.find(m => m.email?.toLowerCase() === email.toLowerCase());
    this.medecinProfile.set(match ?? null);
  }
}
