import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { PatientService } from '../../core/services/patient.service';
import { RendezVousService } from '../../core/services/rendez-vous.service';
import { FactureService } from '../../core/services/facture.service';
import {
  RendezVous,
  compareRendezVous,
  isToday,
  isUpcomingDate,
  parseRendezVousDate
} from '../../core/models/rendez-vous.model';
import { formatMontantTnd, isCurrentMonth } from '../../core/models/facture.model';
import { StatusBadgeComponent } from '../rendez-vous/status-badge/status-badge.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    StatusBadgeComponent
  ],
  providers: [DatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private readonly patientService = inject(PatientService);
  private readonly rendezVousService = inject(RendezVousService);
  private readonly factureService = inject(FactureService);
  private readonly datePipe = inject(DatePipe);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly totalPatients = signal(0);
  readonly plannedAppointments = signal<RendezVous[]>([]);
  readonly monthlyRevenue = signal(0);

  readonly todayAppointmentsCount = computed(() => this.todayAppointments().length);

  readonly todayAppointments = computed(() =>
    this.plannedAppointments()
      .filter(rdv => isToday(rdv.date))
      .sort((a, b) => (a.heure ?? '').localeCompare(b.heure ?? ''))
  );

  readonly upcoming = computed(() =>
    this.plannedAppointments()
      .filter(rdv => isUpcomingDate(rdv.date))
      .sort(compareRendezVous)
      .slice(0, 3)
  );

  readonly monthlyRevenueLabel = computed(() => formatMontantTnd(this.monthlyRevenue()));

  readonly todayColumns = ['heure', 'patient', 'medecin', 'statut'];
  readonly todayDataSource = new MatTableDataSource<RendezVous>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  formatShortDate(value: string | number | null | undefined): string {
    const date = parseRendezVousDate(value);
    if (!date) {
      return '—';
    }
    return this.datePipe.transform(date, 'dd/MM') ?? '—';
  }

  private loadDashboardData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      patients: this.patientService.getAll(),
      planned: this.rendezVousService.getByStatut('PLANIFIE'),
      factures: this.factureService.getAll()
    }).subscribe({
      next: ({ patients, planned, factures }) => {
        this.totalPatients.set(patients.length);
        this.plannedAppointments.set(planned);

        const revenue = factures
          .filter(f => isCurrentMonth(f.dateFacture))
          .reduce((sum, f) => sum + (f.montant ?? 0), 0);
        this.monthlyRevenue.set(revenue);

        this.todayDataSource.data = planned
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
    return 'Impossible de charger le tableau de bord';
  }
}
