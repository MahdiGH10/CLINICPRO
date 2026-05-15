import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  switchMap,
  takeUntil
} from 'rxjs';
import { RendezVousService } from '../../../core/services/rendez-vous.service';
import { PatientService } from '../../../core/services/patient.service';
import { MedecinService } from '../../../core/services/medecin.service';
import { Patient } from '../../../core/models/patient.model';
import { Medecin } from '../../../core/models/medecin.model';
import {
  TIME_SLOTS,
  isSameCalendarDay,
  toApiDateString
} from '../../../core/models/rendez-vous.model';
import { MedecinCardComponent } from '../../medecins/medecin-card/medecin-card.component';
import { AuthService } from '../../../core/services/auth.service';
import { UserContextService } from '../../../core/services/user-context.service';

@Component({
  selector: 'app-booking-wizard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatStepperModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MedecinCardComponent
  ],
  templateUrl: './booking-wizard.component.html',
  styleUrl: './booking-wizard.component.scss'
})
export class BookingWizardComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly rendezVousService = inject(RendezVousService);
  private readonly patientService = inject(PatientService);
  private readonly medecinService = inject(MedecinService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);
  private readonly userContext = inject(UserContextService);
  private readonly destroy$ = new Subject<void>();

  readonly isPatientPortal = computed(() => this.authService.hasRole('PATIENT'));
  readonly isAdminBooking = computed(() => this.authService.hasRole('ADMIN'));

  readonly timeSlots = TIME_SLOTS;
  readonly minDate = toApiDateString(new Date());

  readonly patientSearchCtrl = new FormControl<string | Patient>('', {
    nonNullable: true
  });
  readonly patientOptions = signal<Patient[]>([]);
  readonly selectedPatient = signal<Patient | null>(null);

  readonly medecins = signal<Medecin[]>([]);
  readonly medecinsLoading = signal(false);
  readonly medecinsError = signal<string | null>(null);
  readonly selectedMedecin = signal<Medecin | null>(null);

  readonly selectedHeure = signal<string | null>(null);
  readonly bookedSlots = signal<string[]>([]);
  readonly slotsLoading = signal(false);
  readonly slotError = signal<string | null>(null);
  readonly submitting = signal(false);

  readonly bookingForm = this.fb.nonNullable.group({
    date: [this.minDate, Validators.required],
    motif: ['', Validators.required]
  });

  ngOnInit(): void {
    if (!this.isPatientPortal()) {
      this.setupPatientSearch();
    } else {
      void this.initPatientProfile();
    }
    this.loadMedecins();
    this.setupSlotLoading();

    const medecinIdParam = this.route.snapshot.queryParamMap.get('medecinId');
    if (medecinIdParam) {
      const id = Number(medecinIdParam);
      this.preselectMedecin(id);
    }
  }

  private async initPatientProfile(): Promise<void> {
    await this.userContext.ensureResolved();
    const patient = this.userContext.currentPatient();
    if (patient) {
      this.selectedPatient.set(patient);
      this.patientSearchCtrl.setValue(patient, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  displayPatient(patient: Patient | string | null): string {
    if (!patient || typeof patient === 'string') {
      return patient ?? '';
    }
    return patient.nom;
  }

  onPatientSelected(event: MatAutocompleteSelectedEvent): void {
    const patient = event.option.value as Patient;
    this.selectedPatient.set(patient);
    this.patientSearchCtrl.setValue(patient, { emitEvent: false });
  }

  selectMedecin(medecin: Medecin): void {
    this.selectedMedecin.set(medecin);
    this.selectedHeure.set(null);
    this.slotError.set(null);
    this.refreshBookedSlots();
  }

  selectSlot(slot: string): void {
    if (this.isSlotBooked(slot)) {
      return;
    }
    this.selectedHeure.set(slot);
    this.slotError.set(null);
  }

  isSlotBooked(slot: string): boolean {
    return this.bookedSlots().includes(slot);
  }

  submitBooking(): void {
    const patient = this.selectedPatient();
    const medecin = this.selectedMedecin();
    const heure = this.selectedHeure();

    if (!patient?.idPatient || !medecin || !heure || this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.slotError.set(null);

    this.rendezVousService
      .book(patient.idPatient, medecin.idMedecin, {
        date: this.bookingForm.controls.date.value,
        heure,
        motif: this.bookingForm.controls.motif.value.trim()
      })
      .subscribe({
        next: message => {
          this.snackBar.open(message, 'Fermer', { duration: 3000 });
          const target = this.isPatientPortal()
            ? '/rendez-vous/mes-rdv'
            : '/rendez-vous/planning';
          this.router.navigate([target]);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          if (err.status === 409) {
            this.slotError.set('Ce créneau est déjà pris');
            this.refreshBookedSlots();
            return;
          }
          this.snackBar.open(this.extractError(err), 'Fermer', { duration: 5000 });
        },
        complete: () => this.submitting.set(false)
      });
  }

  private setupPatientSearch(): void {
    this.patientSearchCtrl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((value): value is string => typeof value === 'string'),
        switchMap(term => {
          const query = term.trim();
          if (query.length < 2) {
            return of([] as Patient[]);
          }
          return this.patientService.searchByName(query).pipe(
            catchError(() => of([] as Patient[]))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(patients => this.patientOptions.set(patients));
  }

  private loadMedecins(): void {
    this.medecinsLoading.set(true);
    this.medecinsError.set(null);

    this.medecinService.getAll().subscribe({
      next: list => {
        this.medecins.set(list);
        this.medecinsLoading.set(false);
      },
      error: err => {
        this.medecinsError.set(this.extractError(err));
        this.medecinsLoading.set(false);
      }
    });
  }

  private preselectMedecin(idMedecin: number): void {
    this.medecinService.getById(idMedecin).subscribe({
      next: medecin => {
        this.selectedMedecin.set(medecin);
        this.refreshBookedSlots();
      },
      error: () => {
        const fromList = this.medecins().find(m => m.idMedecin === idMedecin);
        if (fromList) {
          this.selectedMedecin.set(fromList);
          this.refreshBookedSlots();
        }
      }
    });
  }

  private setupSlotLoading(): void {
    this.bookingForm.controls.date.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.selectedHeure.set(null);
        this.slotError.set(null);
        this.refreshBookedSlots();
      });
  }

  private refreshBookedSlots(): void {
    const medecin = this.selectedMedecin();
    const date = this.bookingForm.controls.date.value;
    if (!medecin || !date) {
      this.bookedSlots.set([]);
      return;
    }

    this.slotsLoading.set(true);
    this.rendezVousService.getByMedecin(medecin.idMedecin).subscribe({
      next: appointments => {
        const taken = appointments
          .filter(
            rdv =>
              isSameCalendarDay(rdv.date, date) &&
              rdv.statut !== 'ANNULE' &&
              !!rdv.heure
          )
          .map(rdv => rdv.heure as string);
        this.bookedSlots.set(taken);
        this.slotsLoading.set(false);
      },
      error: () => {
        this.bookedSlots.set([]);
        this.slotsLoading.set(false);
      }
    });
  }

  private extractError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (typeof err.error === 'string' && err.error.length > 0) {
        return err.error;
      }
    }
    if (err && typeof err === 'object' && 'error' in err) {
      const body = (err as { error: unknown }).error;
      if (typeof body === 'string' && body.length > 0) {
        return body;
      }
    }
    return 'Une erreur est survenue';
  }
}
