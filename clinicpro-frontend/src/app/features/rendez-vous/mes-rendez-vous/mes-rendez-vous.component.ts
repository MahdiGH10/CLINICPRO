import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RendezVousService } from '../../../core/services/rendez-vous.service';
import { UserContextService } from '../../../core/services/user-context.service';
import { RendezVous, compareRendezVous, parseRendezVousDate } from '../../../core/models/rendez-vous.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-mes-rendez-vous',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    StatusBadgeComponent
  ],
  providers: [DatePipe],
  templateUrl: './mes-rendez-vous.component.html',
  styleUrl: '../planning-list/planning-list.component.scss'
})
export class MesRendezVousComponent implements OnInit {
  private readonly rendezVousService = inject(RendezVousService);
  private readonly userContext = inject(UserContextService);
  private readonly datePipe = inject(DatePipe);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly columns = ['date', 'heure', 'medecin', 'motif', 'statut'];
  readonly dataSource = new MatTableDataSource<RendezVous>([]);

  ngOnInit(): void {
    void this.load();
  }

  formatDate(value: string | number | null | undefined): string {
    const date = parseRendezVousDate(value);
    if (!date) {
      return '—';
    }
    return this.datePipe.transform(date, 'dd/MM/yyyy') ?? '—';
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    await this.userContext.ensureResolved();
    const patient = this.userContext.currentPatient();

    if (!patient?.idPatient) {
      this.error.set('Profil patient introuvable pour ce compte.');
      this.loading.set(false);
      return;
    }

    this.rendezVousService.getByPatient(patient.idPatient).subscribe({
      next: list => {
        this.dataSource.data = [...list].sort(compareRendezVous).reverse();
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
    return 'Impossible de charger vos rendez-vous';
  }
}
