import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MedecinService } from '../../../core/services/medecin.service';
import { CreateMedecinRequest } from '../../../core/models/medecin.model';

@Component({
  selector: 'app-medecin-form',
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
  templateUrl: './medecin-form.component.html',
  styleUrl: './medecin-form.component.scss'
})
export class MedecinFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly medecinService = inject(MedecinService);
  private readonly snackBar = inject(MatSnackBar);

  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    specialite: ['', Validators.required],
    disponibilite: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: CreateMedecinRequest = {
      nom: raw.nom.trim(),
      specialite: raw.specialite.trim(),
      disponibilite: raw.disponibilite.trim() || null,
      email: raw.email.trim(),
      password: raw.password
    };

    this.saving.set(true);
    this.medecinService.create(payload).subscribe({
      next: response => {
        const detail = response.motDePasseTemporaire
          ? `${response.message} — Mot de passe : ${response.motDePasseTemporaire}`
          : response.message;
        this.snackBar.open(detail, 'Fermer', { duration: 8000 });
        this.router.navigate(['/medecins/list']);
      },
      error: err => {
        this.saving.set(false);
        this.snackBar.open(this.extractError(err), 'Fermer', { duration: 5000 });
      },
      complete: () => this.saving.set(false)
    });
  }

  private extractError(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const body = (err as { error: unknown }).error;
      if (typeof body === 'string' && body.length > 0) {
        return body;
      }
      if (body && typeof body === 'object' && 'message' in body) {
        const message = (body as { message: unknown }).message;
        if (typeof message === 'string') {
          return message;
        }
      }
    }
    return 'Une erreur est survenue';
  }
}
