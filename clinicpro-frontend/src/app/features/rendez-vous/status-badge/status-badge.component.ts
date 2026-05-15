import { Component, computed, input } from '@angular/core';
import { RendezVousStatut } from '../../../core/models/rendez-vous.model';

@Component({
  selector: 'app-rdv-status-badge',
  standalone: true,
  template: `
    <span class="badge" [class]="badgeClass()">{{ label() }}</span>
  `,
  styles: `
    .badge {
      display: inline-block;
      padding: 0.125rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .badge--planifie {
      background: #dcfce7;
      color: #166534;
    }

    .badge--termine {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge--annule {
      background: #fee2e2;
      color: #991b1b;
    }

    .badge--default {
      background: #f1f5f9;
      color: #475569;
    }
  `
})
export class StatusBadgeComponent {
  readonly statut = input<string | undefined>('');

  readonly label = computed(() => this.statut() || '—');

  readonly badgeClass = computed(() => {
    switch (this.statut()?.toUpperCase()) {
      case 'PLANIFIE':
        return 'badge badge--planifie';
      case 'TERMINE':
        return 'badge badge--termine';
      case 'ANNULE':
        return 'badge badge--annule';
      default:
        return 'badge badge--default';
    }
  });
}
