import { Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Medecin, getMedecinInitials } from '../../../core/models/medecin.model';

@Component({
  selector: 'app-medecin-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './medecin-card.component.html',
  styleUrl: './medecin-card.component.scss'
})
export class MedecinCardComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly canBook = computed(() => this.authService.hasRole('PATIENT'));

  readonly medecin = input.required<Medecin>();
  readonly selectionMode = input(false);
  readonly selected = input(false);
  readonly medecinSelect = output<Medecin>();

  readonly initials = computed(() => getMedecinInitials(this.medecin().nom));

  readonly availabilityLabel = computed(() => {
    const value = this.medecin().disponibilite?.trim();
    return value && value.length > 0 ? value : 'Disponibilité non renseignée';
  });

  onCardClick(): void {
    if (this.selectionMode()) {
      this.medecinSelect.emit(this.medecin());
    }
  }

  prendreRdv(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/rendez-vous/nouveau'], {
      queryParams: { medecinId: this.medecin().idMedecin }
    });
  }
}
