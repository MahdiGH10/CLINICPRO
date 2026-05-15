import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RendezVousService } from '../../core/services/rendez-vous.service';
import { UserContextService } from '../../core/services/user-context.service';
import {
  RendezVous,
  compareRendezVous,
  isToday,
  isUpcomingDate,
  parseRendezVousDate
} from '../../core/models/rendez-vous.model';
import { StatusBadgeComponent } from '../rendez-vous/status-badge/status-badge.component';

@Component({
  selector: 'app-medecin-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    StatusBadgeComponent
  ],
  providers: [DatePipe],
  templateUrl: './medecin-dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class MedecinDashboardComponent implements OnInit {
  private readonly rendezVousService = inject(RendezVousService);
  private readonly userContext = inject(UserContextService);
  private readonly datePipe = inject(DatePipe);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly appointments = signal<RendezVous[]>([]);

  readonly todayCount = computed(() => this.todayAppointments().length);

  readonly todayAppointments = computed(() =>
    this.appointments()
      .filter(rdv => isToday(rdv.date))
      .sort((a, b) => (a.heure ?? '').localeCompare(b.heure ?? ''))
  );

  readonly upcoming = computed(() =>
    this.appointments()
      .filter(rdv => isUpcomingDate(rdv.date))
      .sort(compareRendezVous)
      .slice(0, 5)
  );

  readonly todayColumns = ['heure', 'patient', 'motif', 'statut', 'actions'];
  readonly todayDataSource = new MatTableDataSource<RendezVous>([]);

  ngOnInit(): void {
    void this.load();
  }

  formatShortDate(value: string | number | null | undefined): string {
    const date = parseRendezVousDate(value);
    if (!date) {
      return '—';
    }
    return this.datePipe.transform(date, 'dd/MM') ?? '—';
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    await this.userContext.ensureResolved(true);
    const medecin = this.userContext.currentMedecin();

    if (!medecin?.idMedecin) {
      this.error.set(
        'Profil médecin introuvable. Vérifiez que votre email correspond à un médecin enregistré.'
      );
      this.loading.set(false);
      return;
    }

    this.rendezVousService.getByMedecin(medecin.idMedecin).subscribe({
      next: list => {
        this.appointments.set(list);
        this.todayDataSource.data = list
          .filter(rdv => isToday(rdv.date))
          .sort((a, b) => (a.heure ?? '').localeCompare(b.heure ?? ''));
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
    return 'Impossible de charger votre agenda';
  }
}
