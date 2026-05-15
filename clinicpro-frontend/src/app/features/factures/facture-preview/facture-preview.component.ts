import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FactureService } from '../../../core/services/facture.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  Facture,
  formatMontantTnd,
  parseFactureDate
} from '../../../core/models/facture.model';

@Component({
  selector: 'app-facture-preview',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [DatePipe],
  templateUrl: './facture-preview.component.html',
  styleUrl: './facture-preview.component.scss'
})
export class FacturePreviewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly factureService = inject(FactureService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly datePipe = inject(DatePipe);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly facture = signal<Facture | null>(null);
  readonly backLink = computed(() =>
    this.authService.currentUser().role === 'PATIENT'
      ? '/factures/mes-factures'
      : '/factures/list'
  );

  readonly dashboardLink = computed(() => '/dashboard');

  readonly patientName = computed(
    () => this.facture()?.consultation?.rendezVous?.patient?.nom ?? '—'
  );

  readonly patientPhone = computed(
    () => this.facture()?.consultation?.rendezVous?.patient?.tel ?? '---'
  );

  readonly doctorName = computed(
    () => this.facture()?.consultation?.rendezVous?.medecin?.nom ?? '—'
  );

  readonly doctorSpecialty = computed(
    () => this.facture()?.consultation?.rendezVous?.medecin?.specialite ?? '—'
  );

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error.set('Facture introuvable');
      this.loading.set(false);
      return;
    }

    this.factureService.getById(Number(idParam)).subscribe({
      next: facture => {
        this.facture.set(facture);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(this.extractError(err));
        this.loading.set(false);
      }
    });
  }

  formatDate(value: string | number | null | undefined): string {
    const date = parseFactureDate(value);
    if (!date) {
      return '—';
    }
    return this.datePipe.transform(date, 'dd/MM/yyyy') ?? '—';
  }

  formatMontant(value: number | null | undefined): string {
    return formatMontantTnd(value);
  }

  invoiceNumber(facture: Facture): string {
    const date = parseFactureDate(facture.dateFacture) ?? new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const id = String(facture.idFacture).padStart(3, '0');
    return `FAC-${year}-${month}-${id}`;
  }

  formatLongDate(value: string | number | null | undefined): string {
    const date = parseFactureDate(value);
    if (!date) {
      return '---';
    }
    const day = date.getDate();
    const month = [
      'Janvier',
      'Fevrier',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Aout',
      'Septembre',
      'Octobre',
      'Novembre',
      'Decembre'
    ][date.getMonth()];
    return `${day} ${month} ${date.getFullYear()}`;
  }

  consultationNote(facture: Facture): string {
    return facture.consultation?.diagnostic || facture.consultation?.ordonnance || 'Consultation medicale';
  }

  print(): void {
    window.print();
  }

  downloadPdfPlaceholder(): void {
    this.snackBar.open('Téléchargement PDF — fonctionnalité à venir', 'Fermer', {
      duration: 4000
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
