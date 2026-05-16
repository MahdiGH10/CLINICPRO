import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../core/services/auth.service';
import { UserContextService } from '../core/services/user-context.service';
import { getHomeRouteForRole } from '../core/config/role.config';

function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) {
      return null;
    }
    const password = parent.get('password')?.value;
    const confirm = control.value;
    if (!confirm) {
      return null;
    }
    return password === confirm ? null : { passwordMismatch: true };
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly userContext = inject(UserContextService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly maxBirthDate = new Date();

  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  serverError: string | null = null;

  registerForm: FormGroup;

  get nomControl() {
    return this.registerForm.get('nom')!;
  }

  get emailControl() {
    return this.registerForm.get('email')!;
  }

  get passwordControl() {
    return this.registerForm.get('password')!;
  }

  get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword')!;
  }

  get dateNaissanceControl() {
    return this.registerForm.get('dateNaissance')!;
  }

  get telControl() {
    return this.registerForm.get('tel')!;
  }

  constructor() {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, passwordMatchValidator()]],
      dateNaissance: [null as Date | null, Validators.required],
      tel: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]]
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  async onSubmit(): Promise<void> {
    this.serverError = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { nom, email, password, dateNaissance, tel } = this.registerForm.getRawValue();
    const birthDate = dateNaissance as Date;

    this.isLoading = true;

    try {
      this.userContext.reset();
      const response = await this.authService.register({
        nom: nom.trim(),
        email: email.trim(),
        password,
        dateNaissance: this.toApiDate(birthDate),
        tel: tel.trim()
      });
      await this.userContext.ensureResolved();

      this.snackBar.open('Compte patient créé avec succès', 'Fermer', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });

      this.router.navigate([getHomeRouteForRole(response.role)]);
    } catch (error: unknown) {
      this.serverError = this.extractError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private toApiDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private extractError(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const body = (err as { error: unknown }).error;
      if (typeof body === 'string' && body.length > 0) {
        return body;
      }
      if (body && typeof body === 'object' && 'message' in body) {
        const message = (body as { message: unknown }).message;
        if (typeof message === 'string' && message.length > 0) {
          return message;
        }
      }
    }
    return 'Impossible de créer le compte. Veuillez réessayer.';
  }
}
