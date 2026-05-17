ClinicPRO Frontend Design — Angular 19 + Standalone Architecture
1. Architecture Overview
Stack: Angular 19 · TypeScript 5.4 · RxJS 7 · Angular Material 19 · Tailwind CSS
Pattern: Smart Container / Presentational Components
State: Angular Signals + lightweight RxJS for async streams
HTTP: Angular HttpClient with interceptors
Icons: Material Symbols / FontAwesome
Charts: ApexCharts (dashboard metrics)
2. Design System & UX Principles
Color Palette (Medical/Trust Theme)
plain
Copy
Primary:    #0D7377 (Teal — medical trust)
Secondary:  #14919B (Light teal)
Accent:     #FF6B6B (Alert/cancel)
Success:    #2ECC71 (Confirm/available)
Warning:    #F39C12 (Pending)
Background: #F8FAFC (Slate-50)
Surface:    #FFFFFF
Text:       #1E293B (Slate-800)
Muted:      #64748B (Slate-500)
Typography
Headings: Inter, 600 weight
Body: Inter, 400 weight
Medical data: Roboto Mono for numbers/IDs
Layout Grid
12-column grid, 24px gutters
Max container: 1440px
Sidebar: 260px fixed (desktop) / bottom nav (mobile)
Content padding: 32px
Accessibility (WCAG 2.1 AA)
All medical records marked with aria-label="Dossier médical confidentiel"
Color not sole indicator (icons + text for status)
Focus rings on all interactive elements
Reduced motion support for animations
3. Application Structure
Route Architecture
plain
Copy
/clinic
├── /auth
│   └── /login                    (Public)
├── /dashboard                    (Role-based widgets)
├── /patients
│   ├── /list                     (Table + filters)
│   ├── /nouveau                  (Stepper form)
│   └── /:id
│       ├── /profile              (Tabs: Info, Rendez-vous, Dossier)
│       └── /dossier-medical      (Rich text + history timeline)
├── /medecins
│   ├── /list                     (Cards + specialty chips)
│   ├── /nouveau                  (Form)
│   └── /:id/agenda               (Weekly calendar view)
├── /rendez-vous
│   ├── /planning                 (Full calendar view)
│   ├── /nouveau                  (Wizard: Patient → Médecin → Créneau)
│   └── /:id                      (Detail + cancel action)
├── /consultations
│   ├── /en-attente               (List of today's appointments)
│   └── /:rendezVousId
│       └── /saisir               (Diagnostic + ordonnance + prix)
├── /factures
│   ├── /list                     (Table + payment status)
│   └── /:id                      (Printable invoice view)
└── /notifications                (Toast center + settings)
4. Component Hierarchy
Shell Components
TypeScript
Copy
// app.component.ts
@Component({
  selector: 'app-root',
  template: `
    <app-shell>
      <app-sidebar [menuItems]="menuItems()" />
      <main class="content-area">
        <app-header [user]="currentUser()" [notifications]="unreadCount()" />
        <router-outlet />
      </main>
    </app-shell>
  `
})
Core Presentational Components
Table
Component	Location	Props/Inputs	Outputs
PatientCard	/patients/components	patient: Patient	edit, viewDossier
DoctorCard	/medecins/components	medecin: Medecin	bookRdv, viewAgenda
AppointmentCalendar	/rendez-vous/components	events: RdvEvent[], view: 'day'|'week'	slotSelect, eventClick
AvailabilityGrid	/rendez-vous/components	slots: TimeSlot[], doctorId: number	slotSelect
MedicalRecordEditor	/patients/components	dossier: string	save
ConsultationForm	/consultations/components	rendezVousId: number	submit, generateInvoice
InvoicePreview	/factures/components	facture: Facture	print, download
StatusBadge	/shared/components	status: 'PLANIFIE' | 'ANNULE' | 'TERMINE'	—
5. Data Models (Frontend DTOs)
TypeScript
Copy
// core/models/patient.model.ts
export interface Patient {
  idPatient: number;
  nom: string;
  dossierMedical: string;
  dateNaissance: Date;
  tel: string;
  email: string;
  age?: number; // computed
}

// core/models/rendez-vous.model.ts
export interface RendezVous {
  idRendezVous: number;
  date: Date;
  heure: string; // "14:00"
  motif: string;
  statut: 'PLANIFIE' | 'ANNULE' | 'TERMINE';
  motifAnnulation?: string;
  patient: Patient;
  medecin: Medecin;
  consultation?: Consultation;
}

// core/models/consultation.model.ts
export interface Consultation {
  idConsultation: number;
  diagnostic: string;
  ordonnance: string;
  prix: number;
  rendezVous: RendezVous;
  facture?: Facture;
}

// core/models/facture.model.ts
export interface Facture {
  idFacture: number;
  dateFacture: Date;
  montant: number;
  consultation: Consultation;
}
6. Service Layer Design
API Services (HttpClient)
TypeScript
Copy
// core/services/patient.service.ts
@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/patient';

  getAll(): Observable<<Patient[]> {
    return this.http.get<<Patient[]>(`${this.apiUrl}/tous`);
  }

  getById(id: number): Observable<<Patient> {
    return this.http.get<<Patient>(`${this.apiUrl}/${id}`);
  }

  updateDossierMedical(id: number, dossier: string): Observable<string> {
    return this.http.put(`${this.apiUrl}/dossierMedical/${id}`, { dossierMedical: dossier }, 
      { responseType: 'text' });
  }
}

// core/services/rendez-vous.service.ts
@Injectable({ providedIn: 'root' })
export class RendezVousService {
  private http = inject(HttpClient);

  prendreRendezVous(patientId: number, medecinId: number, rdv: Partial<RendezVous>): Observable<RendezVous> {
    return this.http.post<RendezVous>(
      `http://localhost:8081/rendezVous/prendre/${patientId}/${medecinId}`, 
      rdv
    );
  }

  annuler(id: number, motif: string): Observable<string> {
    return this.http.put(`${this.apiUrl}/annuler/${id}`, motif, { 
      headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
      responseType: 'text' 
    });
  }
}
State Services (Signals-based)
TypeScript
Copy
// core/state/appointment.store.ts
@Injectable({ providedIn: 'root' })
export class AppointmentStore {
  private rdvService = inject(RendezVousService);
  
  // State signals
  appointments = signal<RendezVous[]>([]);
  selectedDate = signal<Date>(new Date());
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Computed
  todaysAppointments = computed(() => 
    this.appointments().filter(r => isSameDay(r.date, this.selectedDate()))
  );

  cancelledCount = computed(() => 
    this.appointments().filter(r => r.statut === 'ANNULE').length
  );

  async loadByMedecin(medecinId: number) {
    this.isLoading.set(true);
    try {
      const data = await firstValueFrom(this.rdvService.getByMedecin(medecinId));
      this.appointments.set(data);
    } catch (e) {
      this.error.set('Erreur chargement rendez-vous');
    } finally {
      this.isLoading.set(false);
    }
  }
}
7. Key Feature Implementations
Feature 1: Appointment Booking Wizard (3 Steps)
UX Flow:
Patient Search — Autocomplete with nom + tel masking (privacy)
Doctor Selection — Cards with specialty chips + availability indicator
Slot Picker — Visual grid showing free/busy slots, conflicts blocked
TypeScript
Copy
// features/rendez-vous/booking-wizard/booking-wizard.component.ts
@Component({
  selector: 'app-booking-wizard',
  template: `
    <mat-stepper [linear]="true" orientation="vertical">
      
      <!-- Step 1: Patient -->
      <mat-step [stepControl]="patientForm">
        <app-patient-search 
          (selected)="patient.set($event)" />
        <form [formGroup]="patientForm">
          <ng-container *ngIf="patient() as p">
            <div class="patient-summary">
              <h3>{{ p.nom }}</h3>
              <p>Tel: {{ p.tel | maskPhone }}</p>
            </div>
          </ng-container>
        </form>
      </mat-step>

      <!-- Step 2: Doctor -->
      <mat-step [stepControl]="doctorForm">
        <div class="doctor-grid">
          @for (doc of medecins(); track doc.idMedecin) {
            <app-doctor-card 
              [medecin]="doc" 
              [isAvailable]="hasAvailability(doc.idMedecin)"
              (select)="selectDoctor(doc)" />
          }
        </div>
      </mat-step>

      <!-- Step 3: Time Slot -->
      <mat-step [stepControl]="slotForm">
        <app-availability-grid
          [doctorId]="selectedDoctorId()"
          [date]="selectedDate()"
          [busySlots]="busySlots()"
          (slotSelect)="bookAppointment($event)" />
        
        @if (conflictError()) {
          <mat-error class="conflict-alert">
            <mat-icon>error</mat-icon>
            Ce créneau est déjà réservé. Veuillez en choisir un autre.
          </mat-error>
        }
      </mat-step>
    </mat-stepper>
  `
})
export class BookingWizardComponent {
  private rdvService = inject(RendezVousService);
  
  patient = signal<<Patient | null>(null);
  selectedDoctor = signal<<Medecin | null>(null);
  selectedDate = signal<Date>(new Date());
  conflictError = signal<boolean>(false);

  async bookAppointment(slot: TimeSlot) {
    try {
      await firstValueFrom(this.rdvService.prendreRendezVous(
        this.patient()!.idPatient,
        this.selectedDoctor()!.idMedecin,
        {
          date: this.selectedDate(),
          heure: slot.time,
          motif: 'Consultation générale'
        }
      ));
      // Success: navigate to confirmation
    } catch (error: any) {
      if (error.status === 409) {
        this.conflictError.set(true);
      }
    }
  }
}
Visual Design:
Stepper with icons: person_search → medical_services → schedule
Doctor cards: Avatar (initials), specialty chip, next available slot badge
Slot grid: Morning (8h-12h) / Afternoon (14h-18h), green = free, red = booked, gray = passed
Feature 2: Medical Record Editor (HIPAA-conscious)
UX Considerations:
Warning banner: "Données médicales sensibles — Accès réservé"
Auto-save with debounce (2s)
Audit trail sidebar (who modified, when)
Read-only mode for non-doctors
TypeScript
Copy
// features/patients/dossier-medical/dossier-editor.component.ts
@Component({
  template: `
    <div class="dossier-container" role="region" aria-label="Dossier médical électronique">
      
      <mat-toolbar class="confidential-banner">
        <mat-icon>security</mat-icon>
        <span>DONNÉES SENSIBLES — Accès médical autorisé uniquement</span>
      </mat-toolbar>

      <div class="editor-layout">
        <div class="main-editor">
          <quill-editor 
            [(ngModel)]="content"
            (onContentChanged)="onContentChanged($event)"
            [modules]="editorModules"
            placeholder="Saisir le dossier médical..." />
          
          <div class="save-status">
            @if (saving()) {
              <mat-spinner diameter="20" />
              <span>Sauvegarde automatique...</span>
            } @else if (lastSaved()) {
              <mat-icon>check_circle</mat-icon>
              <span>Sauvegardé à {{ lastSaved() | date:'HH:mm' }}</span>
            }
          </div>
        </div>

        <aside class="history-panel">
          <h4>Historique des modifications</h4>
          <mat-list>
            @for (entry of history(); track entry.date) {
              <mat-list-item>
                <span matListItemTitle>{{ entry.date | date:'short' }}</span>
                <span matListItemLine>Dr. {{ entry.medecin }}</span>
              </mat-list-item>
            }
          </mat-list>
        </aside>
      </div>
    </div>
  `
})
export class DossierEditorComponent implements OnInit {
  private patientService = inject(PatientService);
  private destroyRef = inject(DestroyRef);
  
  content = signal<string>('');
  saving = signal<boolean>(false);
  lastSaved = signal<Date | null>(null);
  history = signal<<HistoryEntry[]>([]);

  ngOnInit() {
    // Auto-save with debounce
    toObservable(this.content)
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.save());
  }

  private save() {
    this.saving.set(true);
    this.patientService.updateDossierMedical(this.patientId(), this.content())
      .subscribe({
        next: () => {
          this.lastSaved.set(new Date());
          this.saving.set(false);
        },
        error: () => this.saving.set(false)
      });
  }
}
Feature 3: Doctor Agenda (Weekly Calendar)
Design:
FullCalendar.io or custom Angular calendar
Color coding:
Blue: Planned appointments
Red: Cancelled (strikethrough)
Green: Completed (consultation done)
Gray: Past slots
TypeScript
Copy
// features/medecins/agenda/agenda.component.ts
@Component({
  template: `
    <div class="agenda-header">
      <h2>Agenda — Dr. {{ medecin()?.nom }}</h2>
      <div class="legend">
        <span class="badge planifie">Planifié</span>
        <span class="badge annule">Annulé</span>
        <span class="badge termine">Terminé</span>
      </div>
    </div>

    <div class="calendar-container">
      @for (day of weekDays(); track day.date) {
        <div class="day-column" [class.today]="day.isToday">
          <header>
            <span class="day-name">{{ day.name }}</span>
            <span class="day-number">{{ day.number }}</span>
          </header>
          
          <div class="slots">
            @for (slot of day.slots; track slot.time) {
              <div class="time-slot" 
                   [class.occupied]="slot.rendezVous"
                   [class.cancelled]="slot.rendezVous?.statut === 'ANNULE'"
                   (click)="slot.rendezVous ? viewRdv(slot.rendezVous) : openBooking(day.date, slot.time)">
                
                @if (slot.rendezVous; as rdv) {
                  <div class="rdv-card">
                    <span class="rdv-time">{{ rdv.heure }}</span>
                    <span class="rdv-patient">{{ rdv.patient.nom }}</span>
                    <mat-chip [class]="rdv.statut.toLowerCase()">
                      {{ rdv.statut }}
                    </mat-chip>
                  </div>
                } @else {
                  <span class="empty-slot">+</span>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .day-column { width: 20%; border-right: 1px solid #e2e8f0; }
    .time-slot { height: 60px; border-bottom: 1px solid #f1f5f9; cursor: pointer; }
    .time-slot:hover:not(.occupied) { background: #f0fdf4; }
    .rdv-card { padding: 8px; background: #e0f2fe; border-radius: 6px; }
    .rdv-card.cancelled { background: #fee2e2; text-decoration: line-through; opacity: 0.7; }
  `]
})
Feature 4: Invoice Generation & Preview
Flow: After consultation save → auto-redirect to invoice preview
TypeScript
Copy
// features/factures/invoice-preview/invoice-preview.component.ts
@Component({
  template: `
    <div class="invoice-page" id="invoice-print">
      <header class="invoice-header">
        <div class="clinic-info">
          <h1>ClinicPRO</h1>
          <p>Système de Gestion Médicale</p>
        </div>
        <div class="invoice-meta">
          <h2>FACTURE</h2>
          <p>N° {{ facture()?.idFacture }}</p>
          <p>Date: {{ facture()?.dateFacture | date:'longDate' }}</p>
        </div>
      </header>

      <section class="billing-info">
        <div class="patient-block">
          <h4>Patient</h4>
          <p>{{ consultation()?.rendezVous?.patient?.nom }}</p>
          <p>Tel: {{ consultation()?.rendezVous?.patient?.tel }}</p>
        </div>
        <div class="doctor-block">
          <h4>Médecin traitant</h4>
          <p>Dr. {{ consultation()?.rendezVous?.medecin?.nom }}</p>
          <p>{{ consultation()?.rendezVous?.medecin?.specialite }}</p>
        </div>
      </section>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Consultation médicale</strong><br>
              <small>Diagnostic: {{ consultation()?.diagnostic }}</small><br>
              <small>Ordonnance: {{ consultation()?.ordonnance }}</small>
            </td>
            <td class="amount">{{ consultation()?.prix | currency:'TND' }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <th class="amount">{{ facture()?.montant | currency:'TND' }}</th>
          </tr>
        </tfoot>
      </table>

      <div class="actions">
        <button mat-raised-button color="primary" (click)="print()">
          <mat-icon>print</mat-icon> Imprimer
        </button>
        <button mat-stroked-button (click)="downloadPDF()">
          <mat-icon>download</mat-icon> PDF
        </button>
      </div>
    </div>
  `
})
export class InvoicePreviewComponent {
  private route = inject(ActivatedRoute);
  private factureService = inject(FactureService);
  
  facture = signal<<Facture | null>(null);
  consultation = computed(() => this.facture()?.consultation ?? null);

  print() {
    window.print();
  }

  downloadPDF() {
    // Integration with html2pdf.js or backend PDF generation
  }
}
Feature 5: Notification Center (Simulation)
TypeScript
Copy
// core/services/notification.service.ts
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private toasts = signal<<Toast[]>([]);

  showRappelRdv(rendezVous: RendezVous) {
    const toast: Toast = {
      id: crypto.randomUUID(),
      type: 'info',
      title: `Rappel: Rendez-vous demain`,
      message: `Dr. ${rendezVous.medecin.nom} — ${rendezVous.heure}`,
      action: 'Voir',
      data: rendezVous
    };
    this.toasts.update(t => [...t, toast]);
    
    // Auto-dismiss after 8 seconds
    setTimeout(() => this.dismiss(toast.id), 8000);
  }

  // Scheduled reminder simulation
  simulateDailyReminders(rendezVousList: RendezVous[]) {
    const tomorrow = addDays(new Date(), 1);
    const rdvsTomorrow = rendezVousList.filter(r => 
      isSameDay(r.date, tomorrow) && r.statut === 'PLANIFIE'
    );
    
    rdvsTomorrow.forEach(rdv => this.showRappelRdv(rdv));
  }
}
Toast Component:
Position: top-right
Icons: event for appointments, warning for cancellations
Sound effect: subtle beep for critical alerts (optional)
8. Dashboard Design (Role-Based)
Admin Dashboard
plain
Copy
┌─────────────────────────────────────────┐
│  KPI Cards                              │
│  [Total Patients] [RDV Aujourd'hui]     │
│  [Consultations] [Revenus Journée]      │
├─────────────────────────────────────────┤
│  [Weekly Calendar Heatmap]  [Top Doctors]│
│  [Recent Invoices]          [Alerts]    │
└─────────────────────────────────────────┘
Doctor Dashboard
plain
Copy
┌─────────────────────────────────────────┐
│  [Prochain RDV] [Patients en attente]   │
├─────────────────────────────────────────┤
│  [Today's Agenda - Timeline]            │
│  09:00 ━━ Patient A ━━ Terminé          │
│  10:00 ━━ Patient B ━━ En salle         │
│  11:00 ━━ Patient C ━━ Planifié         │
├─────────────────────────────────────────┤
│  [Quick Actions]                        │
│  [Saisir Consultation] [Modifier Agenda]  │
└─────────────────────────────────────────┘
9. Security & Privacy Frontend Measures
TypeScript
Copy
// core/guards/role.guard.ts
export const roleGuard = (allowedRoles: UserRole[]) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    const user = authService.currentUser();
    if (!user || !allowedRoles.includes(user.role)) {
      return router.createUrlTree(['/unauthorized']);
    }
    return true;
  };
};

// Route config
{
  path: 'patients/:id/dossier-medical',
  component: DossierEditorComponent,
  canActivate: [() => roleGuard(['MEDECIN', 'ADMIN'])]
}
Privacy Features:
Medical record pages: *ngIf="hasMedicalAccess()"
Patient phone masking: 2123****7 in list views
Auto-lock after 5min inactivity on sensitive pages
Print watermark: "CONFIDENTIEL — ClinicPRO" on dossier printouts
10. Folder Structure
plain
Copy
src/app/
├── core/
│   ├── models/              # TypeScript interfaces
│   ├── services/            # API services
│   ├── state/               # Signal stores
│   ├── guards/              # Route guards
│   ├── interceptors/        # HTTP interceptors (auth, error, loading)
│   └── utils/               # Date helpers, formatters, validators
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── patients/
│   │   ├── components/
│   │   ├── pages/
│   │   └── patients.routes.ts
│   ├── medecins/
│   ├── rendez-vous/
│   ├── consultations/
│   └── factures/
│
├── shared/
│   ├── components/          # Reusable UI (status-badge, loading-spinner)
│   ├── directives/          # Permission directives
│   └── pipes/               # Phone mask, date-french, currency-tnd
│
└── app.config.ts            # Standalone app config (provideRouter, etc.)
11. API Integration Map
Table
Frontend Action	Backend Endpoint	Error Handling
Load patients	GET /patient/tous	404 → Empty state
Search patient	GET /patient/nom/{nom}	Debounce 300ms
Book appointment	POST /rendezVous/prendre/{pId}/{mId}	409 → Conflict toast
Cancel appointment	PUT /rendezVous/annuler/{id}	Confirm dialog first
Save consultation	POST /consultation/enregistrer/{rdvId}	400 → Field errors
View invoice	GET /facture/consultation/{id}	404 → "Not yet generated"
12. Responsive Breakpoints
Table
Device	Width	Layout Changes
Mobile	< 768px	Bottom nav, stacked cards, full-width modals
Tablet	768-1024px	Collapsible sidebar, 2-col grids
Desktop	> 1024px	Full sidebar, multi-pane views, calendar week view
13. Implementation Priority
Sprint 1 — Foundation
[ ] Project setup (Angular 19 + Material + Tailwind)
[ ] Core models + API services
[ ] Shell layout (sidebar + header)
[ ] Patient CRUD pages
Sprint 2 — Scheduling
[ ] Doctor list + cards
[ ] Booking wizard (3-step)
[ ] Availability checking UI
[ ] Agenda calendar view
Sprint 3 — Medical Workflow
[ ] Consultation form
[ ] Medical record editor (rich text)
[ ] Invoice auto-preview
[ ] Status management (planifie/annule)
Sprint 4 — Polish
[ ] Dashboard with charts
[ ] Notification center
[ ] Print styles for invoices
[ ] Role-based access UI
[ ] Mobile responsiveness
