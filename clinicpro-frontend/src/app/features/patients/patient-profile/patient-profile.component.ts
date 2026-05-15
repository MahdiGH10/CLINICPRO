import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
  tap
} from 'rxjs';
import { PatientService } from '../../../core/services/patient.service';
import { RendezVousService } from '../../../core/services/rendez-vous.service';
import { Patient, parsePatientDate } from '../../../core/models/patient.model';
import { RendezVous } from '../../../core/models/rendez-vous.model';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  providers: [DatePipe],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.scss'
})
export class PatientProfileComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly patientService = inject(PatientService);
  private readonly rendezVousService = inject(RendezVousService);
  private readonly datePipe = inject(DatePipe);
  private readonly destroy$ = new Subject<void>();

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly patient = signal<Patient | null>(null);

  readonly rdvLoading = signal(false);
  readonly rdvError = signal<string | null>(null);
  readonly rdvColumns = ['date', 'heure', 'medecin', 'statut', 'motif'];
  readonly rdvDataSource = new MatTableDataSource<RendezVous>([]);

  readonly dossierForm = new FormGroup({
    antecedents: new FormControl('', { nonNullable: true }),
    allergies: new FormControl('', { nonNullable: true }),
    traitements: new FormControl('', { nonNullable: true }),
    observations: new FormControl('', { nonNullable: true }),
    diagnostic: new FormControl('', { nonNullable: true }),
    examens: new FormControl('', { nonNullable: true }),
    conduite: new FormControl('', { nonNullable: true })
  });
  readonly dossierSaving = signal(false);
  readonly dossierSaved = signal(false);
  readonly dossierError = signal<string | null>(null);

  private patientId!: number;
  private dossierReady = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error.set('Patient introuvable');
      this.loading.set(false);
      return;
    }

    this.patientId = Number(idParam);
    this.loadPatient();
    this.loadRendezVous();
    this.setupDossierAutoSave();
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

  private loadPatient(): void {
    this.patientService.getById(this.patientId).subscribe({
      next: patient => {
        this.patient.set(patient);
        this.dossierForm.setValue(this.parseDossierMedical(patient.dossierMedical), {
          emitEvent: false
        });
        this.dossierReady = true;
        this.loading.set(false);
      },
      error: err => {
        this.error.set(this.extractError(err));
        this.loading.set(false);
      }
    });
  }

  private loadRendezVous(): void {
    this.rdvLoading.set(true);
    this.rdvError.set(null);

    this.rendezVousService.getByPatient(this.patientId).subscribe({
      next: rdvs => {
        this.rdvDataSource.data = rdvs;
        this.rdvLoading.set(false);
      },
      error: err => {
        this.rdvError.set(this.extractError(err));
        this.rdvLoading.set(false);
      }
    });
  }

  private setupDossierAutoSave(): void {
    this.dossierForm.valueChanges
      .pipe(
        filter(() => this.dossierReady),
        debounceTime(2000),
        distinctUntilChanged(
          (previous, current) =>
            this.serializeDossierMedical(previous) === this.serializeDossierMedical(current)
        ),
        tap(() => {
          this.dossierSaving.set(true);
          this.dossierSaved.set(false);
          this.dossierError.set(null);
        }),
        switchMap(value =>
          this.patientService.updateDossierMedical(
            this.patientId,
            this.serializeDossierMedical(value)
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.dossierSaving.set(false);
          this.dossierSaved.set(true);
        },
        error: err => {
          this.dossierSaving.set(false);
          this.dossierError.set(this.extractError(err));
        }
      });
  }

  private parseDossierMedical(value: string | null | undefined): DossierMedicalFormValue {
    const dossier = value?.trim() ?? '';

    if (!dossier) {
      return this.emptyDossierMedical();
    }

    const parsed = {
      antecedents: this.extractSection(dossier, 'ANTECEDENTS'),
      allergies: this.extractSection(dossier, 'ALLERGIES'),
      traitements: this.extractSection(dossier, 'TRAITEMENTS'),
      observations: this.extractSection(dossier, 'OBSERVATIONS CLINIQUES'),
      diagnostic: this.extractSection(dossier, 'DIAGNOSTIC'),
      examens: this.extractSection(dossier, 'EXAMENS ET RESULTATS'),
      conduite: this.extractSection(dossier, 'CONDUITE A TENIR')
    };

    const hasStructuredContent = Object.values(parsed).some(section => section.length > 0);
    return hasStructuredContent
      ? parsed
      : { ...this.emptyDossierMedical(), observations: dossier };
  }

  private emptyDossierMedical(): DossierMedicalFormValue {
    return {
      antecedents: '',
      allergies: '',
      traitements: '',
      observations: '',
      diagnostic: '',
      examens: '',
      conduite: ''
    };
  }

  private serializeDossierMedical(value: Partial<DossierMedicalFormValue>): string {
    const sections: Array<[string, string | undefined]> = [
      ['ANTECEDENTS', value.antecedents],
      ['ALLERGIES', value.allergies],
      ['TRAITEMENTS', value.traitements],
      ['OBSERVATIONS CLINIQUES', value.observations],
      ['DIAGNOSTIC', value.diagnostic],
      ['EXAMENS ET RESULTATS', value.examens],
      ['CONDUITE A TENIR', value.conduite]
    ];

    return sections
      .map(([title, content]) => `## ${title}\n${(content ?? '').trim() || '-'}`)
      .join('\n\n');
  }

  private extractSection(dossier: string, section: string): string {
    const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `##\\s*${escaped}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`,
      'i'
    );
    const match = dossier.match(pattern);
    const content = match?.[1]?.trim() ?? '';
    return content === '-' ? '' : content;
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

interface DossierMedicalFormValue {
  antecedents: string;
  allergies: string;
  traitements: string;
  observations: string;
  diagnostic: string;
  examens: string;
  conduite: string;
}
