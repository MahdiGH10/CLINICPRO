import { Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PatientService } from '../../../core/services/patient.service';
import { Patient, formatDateForInput } from '../../../core/models/patient.model';

@Component({
  selector: 'app-patient-form',
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
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss'
})
export class PatientFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly patientService = inject(PatientService);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly isEditMode = signal(false);

  private patientId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    tel: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    email: ['', [optionalEmailValidator]],
    dateNaissance: [''],
    dossierMedical: ['']
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.patientId = Number(idParam);
      this.loadPatient(this.patientId);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    this.saving.set(true);

    const request$ =
      this.isEditMode() && this.patientId != null
        ? this.patientService.update(this.patientId, payload)
        : this.patientService.create(payload);

    request$.subscribe({
      next: message => {
        this.snackBar.open(message, 'Fermer', { duration: 3000 });
        this.router.navigate(['/patients/list']);
      },
      error: err => {
        this.saving.set(false);
        this.snackBar.open(this.extractError(err), 'Fermer', { duration: 5000 });
      },
      complete: () => this.saving.set(false)
    });
  }

  private loadPatient(id: number): void {
    this.loading.set(true);
    this.patientService.getById(id).subscribe({
      next: patient => {
        this.form.patchValue({
          nom: patient.nom,
          tel: patient.tel,
          email: patient.email ?? '',
          dateNaissance: formatDateForInput(patient.dateNaissance),
          dossierMedical: patient.dossierMedical ?? ''
        });
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.snackBar.open(this.extractError(err), 'Fermer', { duration: 5000 });
        this.router.navigate(['/patients/list']);
      }
    });
  }

  private buildPayload(): Patient {
    const raw = this.form.getRawValue();
    return {
      nom: raw.nom.trim(),
      tel: raw.tel.trim(),
      email: raw.email.trim() || null,
      dateNaissance: raw.dateNaissance || null,
      dossierMedical: raw.dossierMedical.trim() || null
    };
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

function optionalEmailValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value as string)?.trim();
  if (!value) {
    return null;
  }
  return Validators.email(control);
}
