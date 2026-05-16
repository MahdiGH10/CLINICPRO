import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../core/services/auth.service';
import { UserContextService } from '../core/services/user-context.service';
import { getHomeRouteForRole } from '../core/config/role.config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userContext = inject(UserContextService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isLoading = false;
  hidePassword = true;
  authMode: 'patient' | 'professional' = 'patient';
  loginForm: FormGroup;

  get pageTitle(): string {
    return this.authMode === 'professional' ? 'Authentification Professionnelle' : 'Authentification Patient';
  }

  get pageSubtitle(): string {
    return this.authMode === 'professional'
      ? 'Accédez à votre espace médecin ou administrateur'
      : 'Accédez à votre espace patient sécurisé';
  }

  get emailControl() {
    return this.loginForm.get('email')!;
  }

  get passwordControl() {
    return this.loginForm.get('password')!;
  }

  constructor() {
    const mode = this.route.snapshot.queryParamMap.get('role');
    if (mode === 'professional' || mode === 'medecin' || mode === 'admin') {
      this.authMode = 'professional';
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    try {
      const credentials = this.loginForm.value;
      this.userContext.reset();
      const response = await this.authService.login(credentials);
      await this.userContext.ensureResolved();

      const message = response.mustChangePassword
        ? 'Connexion réussie, veuillez changer votre mot de passe'
        : `Bienvenue (${response.role})`;

      this.snackBar.open(message, 'Fermer', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });

      if (response.mustChangePassword) {
        await this.router.navigate(['/auth/change-password']);
      } else {
        await this.router.navigate([getHomeRouteForRole(response.role)]);
      }
    } catch (error: any) {
      const errorMessage = error?.error?.message || 'Erreur de connexion';
      this.snackBar.open(errorMessage, 'Fermer', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'error-snackbar'
      });
    } finally {
      this.isLoading = false;
    }
  }

  setAuthMode(mode: 'patient' | 'professional'): void {
    this.authMode = mode;
  }
}
