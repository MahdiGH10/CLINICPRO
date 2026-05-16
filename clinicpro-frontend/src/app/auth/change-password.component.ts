import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-page auth-page--change-password">
      <main class="auth-page__main">
        <mat-card class="auth-form auth-form--change-password">
          <header class="auth-form__header">
            <span class="auth-form__eyebrow">Sécurité du compte</span>
            <h2 class="auth-form__title">Changer le mot de passe</h2>
            <p class="auth-form__subtitle">
              Lors de votre première connexion, choisissez votre propre mot de passe.
            </p>
          </header>

          <form class="auth-form__body" [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field class="auth-form__field" appearance="outline">
              <mat-label>Mot de passe actuel</mat-label>
              <input matInput [type]="hideCurrent ? 'password' : 'text'" formControlName="currentPassword" />
              <button mat-icon-button matSuffix type="button" (click)="hideCurrent = !hideCurrent">
                <i class="ti" [class.ti-eye]="hideCurrent" [class.ti-eye-off]="!hideCurrent" aria-hidden="true"></i>
              </button>
              @if (currentPasswordControl.hasError('required') && currentPasswordControl.touched) {
                <mat-error>Le mot de passe actuel est requis</mat-error>
              }
            </mat-form-field>

            <mat-form-field class="auth-form__field" appearance="outline">
              <mat-label>Nouveau mot de passe</mat-label>
              <input matInput [type]="hideNew ? 'password' : 'text'" formControlName="newPassword" />
              <button mat-icon-button matSuffix type="button" (click)="hideNew = !hideNew">
                <i class="ti" [class.ti-eye]="hideNew" [class.ti-eye-off]="!hideNew" aria-hidden="true"></i>
              </button>
              @if (newPasswordControl.hasError('required') && newPasswordControl.touched) {
                <mat-error>Le nouveau mot de passe est requis</mat-error>
              }
              @if (newPasswordControl.hasError('minlength') && newPasswordControl.touched) {
                <mat-error>Au moins 8 caractères</mat-error>
              }
            </mat-form-field>

            <mat-form-field class="auth-form__field" appearance="outline">
              <mat-label>Confirmer le nouveau mot de passe</mat-label>
              <input matInput [type]="hideConfirm ? 'password' : 'text'" formControlName="confirmPassword" />
              <button mat-icon-button matSuffix type="button" (click)="hideConfirm = !hideConfirm">
                <i class="ti" [class.ti-eye]="hideConfirm" [class.ti-eye-off]="!hideConfirm" aria-hidden="true"></i>
              </button>
              @if (confirmPasswordControl.hasError('required') && confirmPasswordControl.touched) {
                <mat-error>Confirmation requise</mat-error>
              }
              @if (confirmPasswordControl.hasError('mismatch') && confirmPasswordControl.touched) {
                <mat-error>Les mots de passe ne correspondent pas</mat-error>
              }
            </mat-form-field>

            <div class="auth-form__password-rules">
              <strong>Règles du mot de passe</strong>
              <ul>
                <li>Au moins 8 caractères</li>
                <li>Choisissez un mot de passe unique</li>
              </ul>
            </div>

            @if (serverError) {
              <p class="auth-form__server-error" role="alert">{{ serverError }}</p>
            }

            <button class="auth-form__submit" type="submit" [disabled]="isLoading || form.invalid">
              @if (isLoading) {
                <mat-spinner diameter="22" class="auth-form__spinner" />
              } @else {
                Enregistrer
              }
            </button>
          </form>

          <p class="auth-form__switch">
            <a routerLink="/dashboard">Retour au tableau de bord</a>
          </p>
        </mat-card>
      </main>
    </div>
  `
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;
  isLoading = false;
  serverError: string | null = null;

  form = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });

  get currentPasswordControl() {
    return this.form.get('currentPassword')!;
  }

  get newPasswordControl() {
    return this.form.get('newPassword')!;
  }

  get confirmPasswordControl() {
    return this.form.get('confirmPassword')!;
  }

  constructor() {
    this.form.valueChanges.subscribe(() => {
      const newPwd = this.form.get('newPassword')?.value;
      const confirm = this.form.get('confirmPassword')?.value;
      const confirmControl = this.form.get('confirmPassword');
      if (!confirmControl) return;
      const mismatch = !!newPwd && !!confirm && newPwd !== confirm;
      const errors = { ...(confirmControl.errors ?? {}) };
      if (mismatch) {
        errors['mismatch'] = true;
      } else {
        delete errors['mismatch'];
      }
      confirmControl.setErrors(Object.keys(errors).length ? errors : null);
    });
  }

  async onSubmit(): Promise<void> {
    this.serverError = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const currentPassword = this.currentPasswordControl.value;
    const newPassword = this.newPasswordControl.value;
    if (!currentPassword || !newPassword) return;

    this.isLoading = true;
    try {
      await this.authService.changePassword({ currentPassword, newPassword });
      this.snackBar.open('Mot de passe mis à jour', 'Fermer', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      await this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.serverError = error?.error?.message || 'Impossible de modifier le mot de passe';
    } finally {
      this.isLoading = false;
    }
  }
}
