import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs';
import { PatientService } from '../../../core/services/patient.service';
import { AuthService } from '../../../core/services/auth.service';
import { Patient, parsePatientDate } from '../../../core/models/patient.model';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../confirm-dialog.component';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [DatePipe],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss'
})
export class PatientListComponent implements OnInit, OnDestroy {
  private readonly patientService = inject(PatientService);
  private readonly authService = inject(AuthService);

  readonly isAdmin = computed(() => this.authService.hasRole('ADMIN'));
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly datePipe = inject(DatePipe);
  private readonly destroy$ = new Subject<void>();

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly displayedColumns = [
    'idPatient',
    'nom',
    'tel',
    'email',
    'dateNaissance',
    'actions'
  ];
  readonly dataSource = new MatTableDataSource<Patient>([]);

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap(term => {
          const query = term.trim();
          const request$ = query
            ? this.patientService.searchByName(query)
            : this.patientService.getAll();

          return request$.pipe(
            catchError(err => {
              this.error.set(this.extractError(err));
              return of([] as Patient[]);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(patients => {
        this.dataSource.data = patients;
        this.loading.set(false);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatDate(value: string | number | null | undefined): string {
    const date = parsePatientDate(value);
    if (!date) {
      return '—';
    }
    return this.datePipe.transform(date, 'dd/MM/yyyy') ?? '—';
  }

  deletePatient(patient: Patient): void {
    const data: ConfirmDialogData = {
      title: 'Supprimer le patient',
      message: `Voulez-vous supprimer ${patient.nom} ? Cette action est irréversible.`,
      confirmLabel: 'Supprimer'
    };

    this.dialog
      .open(ConfirmDialogComponent, { data, width: '400px' })
      .afterClosed()
      .subscribe(confirmed => {
        if (!confirmed || patient.idPatient == null) {
          return;
        }

        this.patientService.delete(patient.idPatient).subscribe({
          next: message => {
            this.snackBar.open(message, 'Fermer', { duration: 3000 });
            this.refreshList();
          },
          error: err =>
            this.snackBar.open(this.extractError(err), 'Fermer', { duration: 5000 })
        });
      });
  }

  private refreshList(): void {
    const term = this.searchControl.value.trim();
    const request$ = term
      ? this.patientService.searchByName(term)
      : this.patientService.getAll();

    request$.subscribe({
      next: patients => (this.dataSource.data = patients),
      error: err => this.error.set(this.extractError(err))
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
