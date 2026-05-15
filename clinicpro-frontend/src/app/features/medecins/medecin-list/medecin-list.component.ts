import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipListboxChange } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MedecinService } from '../../../core/services/medecin.service';
import { AuthService } from '../../../core/services/auth.service';
import { Medecin } from '../../../core/models/medecin.model';
import { MedecinCardComponent } from '../medecin-card/medecin-card.component';

@Component({
  selector: 'app-medecin-list',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MedecinCardComponent
  ],
  templateUrl: './medecin-list.component.html',
  styleUrl: './medecin-list.component.scss'
})
export class MedecinListComponent implements OnInit {
  private readonly medecinService = inject(MedecinService);
  private readonly authService = inject(AuthService);

  readonly isAdmin = computed(() => this.authService.hasRole('ADMIN'));
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly medecins = signal<Medecin[]>([]);
  readonly specialites = signal<string[]>([]);
  readonly selectedSpecialite = signal('');

  ngOnInit(): void {
    this.loadMedecins('');
  }

  onSpecialiteChange(event: MatChipListboxChange): void {
    const value = (event.value ?? '') as string;
    this.selectedSpecialite.set(value);
    this.loadMedecins(value);
  }

  private loadMedecins(specialite: string): void {
    this.loading.set(true);
    this.error.set(null);

    const request$ = specialite
      ? this.medecinService.getBySpecialite(specialite)
      : this.medecinService.getAll();

    request$.subscribe({
      next: list => {
        this.medecins.set(list);
        if (!specialite) {
          this.updateSpecialiteChips(list);
        }
        this.loading.set(false);
      },
      error: err => {
        this.error.set(this.extractError(err));
        this.loading.set(false);
      }
    });
  }

  private updateSpecialiteChips(list: Medecin[]): void {
    const unique = [
      ...new Set(
        list.map(m => m.specialite?.trim()).filter((s): s is string => !!s && s.length > 0)
      )
    ].sort((a, b) => a.localeCompare(b, 'fr'));
    this.specialites.set(unique);
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
