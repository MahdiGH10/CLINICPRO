import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RendezVousService } from '../../core/services/rendez-vous.service';
import { UserContextService } from '../../core/services/user-context.service';
import {
  RendezVous,
  compareRendezVous,
  isUpcomingDate,
  parseRendezVousDate
} from '../../core/models/rendez-vous.model';
import { StatusBadgeComponent } from '../rendez-vous/status-badge/status-badge.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    StatusBadgeComponent
  ],
  providers: [DatePipe],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class PatientDashboardComponent implements OnInit {
  private readonly rendezVousService = inject(RendezVousService);
  private readonly userContext = inject(UserContextService);
  private readonly datePipe = inject(DatePipe);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly appointments = signal<RendezVous[]>([]);

  readonly upcoming = computed(() =>
    this.appointments()
      .filter(rdv => isUpcomingDate(rdv.date) && rdv.statut === 'PLANIFIE')
      .sort(compareRendezVous)
      .slice(0, 3)
  );

  readonly plannedCount = computed(
    () => this.appointments().filter(r => r.statut === 'PLANIFIE').length
  );

  ngOnInit(): void {
    void this.load();
  }

  formatDate(value: string | number | null | undefined): string {
    const date = parseRendezVousDate(value);
    if (!date) {
      return '—';
    }
    return this.datePipe.transform(date, 'EEEE d MMMM', '', 'fr') ?? '—';
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    await this.userContext.ensureResolved();
    const patient = this.userContext.currentPatient();

    if (!patient?.idPatient) {
      this.error.set(
        'Profil patient introuvable. Votre compte doit être lié à un dossier patient (même email).'
      );
      this.loading.set(false);
      return;
    }

    this.rendezVousService.getByPatient(patient.idPatient).subscribe({
      next: list => {
        this.appointments.set(list);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(this.extractError(err));
        this.loading.set(false);
      }
    });
  }

  private extractError(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const body = (err as { error: unknown }).error;
      if (typeof body === 'string' && body.length > 0) {
        return body;
      }
    }
    return 'Impossible de charger votre espace';
  }
}
