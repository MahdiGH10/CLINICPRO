import { Component, OnInit, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { UserContextService } from '../../core/services/user-context.service';
import { getRoleDefinition } from '../../core/config/role.config';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly userContext = inject(UserContextService);

  readonly pageTitle = input<string>('Dashboard');

  readonly roleLabel = computed(() =>
    getRoleDefinition(this.authService.currentUser().role)?.label ?? ''
  );

  readonly displayName = computed(() => {
    const role = this.authService.currentUser().role;
    const patient = this.userContext.currentPatient();
    const medecin = this.userContext.currentMedecin();

    if (role === 'PATIENT' && patient?.nom) {
      return patient.nom;
    }

    if (role === 'MEDECIN' && medecin?.nom) {
      return `Dr. ${medecin.nom}`;
    }

    const email = this.authService.currentUser().email ?? 'Utilisateur';
    return this.formatEmailName(email);
  });

  ngOnInit(): void {
    void this.userContext.ensureResolved();
  }

  markAllRead(event: Event): void {
    event.stopPropagation();
    this.notificationService.markAllRead();
  }

  markRead(id: string, event: Event): void {
    event.stopPropagation();
    this.notificationService.markAsRead(id);
  }

  private formatEmailName(email: string): string {
    const localPart = email.split('@')[0] || email;
    return localPart
      .split(/[._-]+/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
