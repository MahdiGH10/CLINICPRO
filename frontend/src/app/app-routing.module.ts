import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PatientsListComponent } from './pages/patients-list/patients-list.component';
import { MedecinsListComponent } from './pages/medecins-list/medecins-list.component';
import { RendezVousListComponent } from './pages/rendez-vous-list/rendez-vous-list.component';
import { BookingWizardComponent } from './features/rendez-vous/booking-wizard/booking-wizard.component';
import { DossierEditorComponent } from './features/patients/dossier-editor/dossier-editor.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'patients', component: PatientsListComponent },
  { path: 'patients/:id/dossier-medical', component: DossierEditorComponent },
  { path: 'medecins', component: MedecinsListComponent },
  { path: 'rendez-vous', component: RendezVousListComponent },
  { path: 'rendez-vous/booking', component: BookingWizardComponent },
  // fallback
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
