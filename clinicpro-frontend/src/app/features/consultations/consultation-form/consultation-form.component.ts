import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { ConsultationService } from '../../../core/services/consultation.service';
import { FactureService } from '../../../core/services/facture.service';
import { RendezVousService } from '../../../core/services/rendez-vous.service';
import { RendezVous, parseRendezVousDate } from '../../../core/models/rendez-vous.model';

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [DatePipe],
  templateUrl: './consultation-form.component.html',
  styleUrl: './consultation-form.component.scss'
})
export class ConsultationFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly consultationService = inject(ConsultationService);
  private readonly factureService = inject(FactureService);
  private readonly rendezVousService = inject(RendezVousService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly datePipe = inject(DatePipe);

  readonly rdvLoading = signal(true);
  readonly rdvError = signal<string | null>(null);
  readonly rendezVous = signal<RendezVous | null>(null);
  readonly saving = signal(false);

  private rendezVousId!: number;

  readonly form = this.fb.nonNullable.group({
    diagnostic: ['', Validators.required],
    ordonnance: [''],
    prix: ['', [Validators.required, Validators.min(0.01)]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('rendezVousId');
    if (!idParam) {
      this.rdvError.set('Rendez-vous introuvable');
      this.rdvLoading.set(false);
      return;
    }

    this.rendezVousId = Number(idParam);
    this.loadRendezVous();
  }

  formatRdvDate(value: string | number | null | undefined): string {
    const date = parseRendezVousDate(value);
    if (!date) {
      return '—';
    }
    return this.datePipe.transform(date, 'dd/MM/yyyy') ?? '—';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rdv = this.rendezVous();
    const patientId = rdv?.patient?.idPatient;
    if (!patientId) {
      this.snackBar.open('Patient introuvable pour ce rendez-vous', 'Fermer', {
        duration: 5000
      });
      return;
    }

    const raw = this.form.getRawValue();
    const payload = {
      diagnostic: raw.diagnostic.trim(),
      ordonnance: raw.ordonnance.trim() || null,
      prix: Number(raw.prix)
    };

    this.saving.set(true);

    this.consultationService
      .create(this.rendezVousId, payload)
      .pipe(
        switchMap(() => this.consultationService.getByPatient(patientId)),
        switchMap(consultations => {
          const created = consultations.find(
            c => c.rendezVous?.idRendezVous === this.rendezVousId
          );
          if (!created) {
            throw new Error('Consultation introuvable après création');
          }
          return this.factureService.getByConsultation(created.idConsultation);
        })
      )
      .subscribe({
        next: facture => {
          this.snackBar.open('Consultation enregistrée', 'Fermer', { duration: 3000 });
          this.router.navigate(['/factures', facture.idFacture]);
        },
        error: err => {
          this.saving.set(false);
          this.snackBar.open(this.extractError(err), 'Fermer', { duration: 5000 });
        },
        complete: () => this.saving.set(false)
      });
  }

  private loadRendezVous(): void {
    this.rendezVousService.getById(this.rendezVousId).subscribe({
      next: rdv => {
        this.rendezVous.set(rdv);
        this.rdvLoading.set(false);
      },
      error: err => {
        this.rdvError.set(this.extractError(err));
        this.rdvLoading.set(false);
      }
    });
  }

  private extractError(err: unknown): string {
    if (err instanceof Error && err.message) {
      return err.message;
    }
    if (err && typeof err === 'object' && 'error' in err) {
      const body = (err as { error: unknown }).error;
      if (typeof body === 'string' && body.length > 0) {
        return body;
      }
    }
    return 'Une erreur est survenue';
  }
}
