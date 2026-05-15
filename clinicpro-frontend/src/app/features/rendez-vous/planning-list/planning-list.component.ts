import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserContextService } from '../../../core/services/user-context.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RendezVousService } from '../../../core/services/rendez-vous.service';
import {
  RendezVous,
  compareRendezVous,
  isToday,
  isUpcomingDate,
  parseRendezVousDate
} from '../../../core/models/rendez-vous.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import {
  CancelRdvDialogComponent,
  CancelRdvDialogData
} from '../cancel-rdv-dialog.component';

@Component({
  selector: 'app-planning-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    StatusBadgeComponent
  ],
  providers: [DatePipe],
  templateUrl: './planning-list.component.html',
  styleUrl: './planning-list.component.scss'
})
export class PlanningListComponent implements OnInit {
  private readonly rendezVousService = inject(RendezVousService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly datePipe = inject(DatePipe);
  private readonly authService = inject(AuthService);
  private readonly userContext = inject(UserContextService);
  private readonly notificationService = inject(NotificationService);

  readonly isMedecinView = computed(() => this.authService.hasRole('MEDECIN'));

  readonly canSaisirConsultation = computed(() =>
    this.authService.hasRole('MEDECIN')
  );

  readonly canBookForOthers = computed(() => this.authService.hasRole('ADMIN'));

  readonly pageTitle = computed(() =>
    this.authService.hasRole('MEDECIN') ? 'Mon agenda' : 'Planning des rendez-vous'
  );

  readonly pageHint = computed(() =>
    this.isMedecinView()
      ? 'Rendez-vous du jour et à venir'
      : "Rendez-vous du jour"
  );

  readonly displayedColumns = computed(() =>
    this.isMedecinView()
      ? ['date', 'heure', 'patient', 'motif', 'statut', 'actions']
      : ['heure', 'patient', 'medecin', 'motif', 'statut', 'actions']
  );

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly todayLabel = this.datePipe.transform(new Date(), 'EEEE d MMMM yyyy', '', 'fr') ?? '';

  readonly dataSource = new MatTableDataSource<RendezVous>([]);

  ngOnInit(): void {
    void this.loadAppointments();
  }

  formatDate(value: string | number | null | undefined): string {
    const date = parseRendezVousDate(value);
    if (!date) {
      return '—';
    }
    return this.datePipe.transform(date, 'dd/MM/yyyy') ?? '—';
  }

  cancelRendezVous(rdv: RendezVous): void {
    const data: CancelRdvDialogData = {
      patientNom: rdv.patient?.nom,
      heure: rdv.heure
    };

    this.dialog
      .open(CancelRdvDialogComponent, { data, width: '420px' })
      .afterClosed()
      .subscribe(motif => {
        if (!motif) {
          return;
        }

        this.rendezVousService.cancel(rdv.idRendezVous, motif).subscribe({
          next: message => {
            this.snackBar.open(message, 'Fermer', { duration: 3000 });
            this.notificationService.notifyCancellation(
              `Rendez-vous annulé : ${rdv.patient?.nom ?? 'Patient'} à ${rdv.heure ?? ''}`
            );
            void this.loadAppointments();
          },
          error: err =>
            this.snackBar.open(this.extractError(err), 'Fermer', { duration: 5000 })
        });
      });
  }

  private async loadAppointments(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    let request$ = this.rendezVousService.getAll();

    if (this.isMedecinView()) {
      await this.userContext.ensureResolved(true);
      const medecin = this.userContext.currentMedecin();
      if (!medecin?.idMedecin) {
        this.error.set(
          'Profil médecin introuvable. L\'email du compte doit correspondre au médecin créé par l\'administrateur.'
        );
        this.loading.set(false);
        return;
      }
      request$ = this.rendezVousService.getByMedecin(medecin.idMedecin);
    }

    request$.subscribe({
      next: appointments => {
        const filtered = this.isMedecinView()
          ? appointments
              .filter(
                rdv =>
                  rdv.statut !== 'ANNULE' &&
                  (isToday(rdv.date) || isUpcomingDate(rdv.date))
              )
              .sort(compareRendezVous)
          : appointments
              .filter(rdv => isToday(rdv.date))
              .sort((a, b) => (a.heure ?? '').localeCompare(b.heure ?? ''));

        this.dataSource.data = filtered;
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
    return 'Une erreur est survenue';
  }
}
