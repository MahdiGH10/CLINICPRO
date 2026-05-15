import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { MedecinDashboardComponent } from './medecin-dashboard.component';
import { PatientDashboardComponent } from './patient-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AdminDashboardComponent,
    MedecinDashboardComponent,
    PatientDashboardComponent
  ],
  template: `
    @switch (role()) {
      @case ('ADMIN') {
        <app-admin-dashboard />
      }
      @case ('MEDECIN') {
        <app-medecin-dashboard />
      }
      @case ('PATIENT') {
        <app-patient-dashboard />
      }
      @default {
        <p class="dashboard__error">Rôle non reconnu. Reconnectez-vous.</p>
      }
    }
  `,
  styles: [
    `
      .dashboard__error {
        padding: 2rem;
        color: #dc2626;
      }
    `
  ]
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  readonly role = computed(() => this.authService.currentUser().role);
}
