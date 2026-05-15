import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FactureService } from '../../../core/services/facture.service';
import { Facture, formatMontantTnd, parseFactureDate } from '../../../core/models/facture.model';

@Component({
  selector: 'app-facture-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  providers: [DatePipe],
  templateUrl: './facture-list.component.html',
  styleUrl: './facture-list.component.scss'
})
export class FactureListComponent implements OnInit {
  private readonly factureService = inject(FactureService);
  private readonly datePipe = inject(DatePipe);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly displayedColumns = [
    'idFacture',
    'dateFacture',
    'patient',
    'medecin',
    'montant',
    'actions'
  ];
  readonly dataSource = new MatTableDataSource<Facture>([]);

  ngOnInit(): void {
    this.loadFactures();
  }

  formatDate(value: string | number | null | undefined): string {
    const date = parseFactureDate(value);
    if (!date) {
      return '—';
    }
    return this.datePipe.transform(date, 'dd/MM/yyyy') ?? '—';
  }

  formatMontant(value: number | null | undefined): string {
    return formatMontantTnd(value);
  }

  private loadFactures(): void {
    this.loading.set(true);
    this.error.set(null);

    this.factureService.getAll().subscribe({
      next: factures => {
        this.dataSource.data = factures.sort((a, b) => b.idFacture - a.idFacture);
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
    return 'Une erreur est survenue';
  }
}
