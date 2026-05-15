import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FactureService } from '../../../core/services/facture.service';
import { Facture, formatMontantTnd, parseFactureDate } from '../../../core/models/facture.model';

@Component({
  selector: 'app-mes-factures',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  providers: [DatePipe],
  templateUrl: './mes-factures.component.html',
  styleUrl: '../facture-list/facture-list.component.scss'
})
export class MesFacturesComponent implements OnInit {
  private readonly factureService = inject(FactureService);
  private readonly datePipe = inject(DatePipe);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly columns = ['date', 'medecin', 'montant', 'actions'];
  readonly dataSource = new MatTableDataSource<Facture>([]);

  ngOnInit(): void {
    void this.load();
  }

  formatDate(value: string | number | null | undefined): string {
    const date = parseFactureDate(value);
    if (!date) {
      return '—';
    }
    return this.datePipe.transform(date, 'dd/MM/yyyy') ?? '—';
  }

  formatMontant(montant: number): string {
    return formatMontantTnd(montant);
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    this.factureService.getMine().subscribe({
      next: factures => {
        this.dataSource.data = factures.sort((a, b) => {
          const da = parseFactureDate(a.dateFacture)?.getTime() ?? 0;
          const db = parseFactureDate(b.dateFacture)?.getTime() ?? 0;
          return db - da;
        });
        this.loading.set(false);
      },
      error: err => {
        this.error.set(this.extractError(err));
        this.loading.set(false);
      }
    });
  }

  private extractError(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const body = (err as { error: unknown }).error;
      if (typeof body === 'string' && body.length > 0) {
        return body;
      }
    }
    return 'Impossible de charger vos factures';
  }
}
