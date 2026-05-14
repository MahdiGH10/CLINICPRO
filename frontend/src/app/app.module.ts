import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PatientsListComponent } from './pages/patients-list/patients-list.component';
import { MedecinsListComponent } from './pages/medecins-list/medecins-list.component';
import { RendezVousListComponent } from './pages/rendez-vous-list/rendez-vous-list.component';
import { BookingWizardComponent } from './features/rendez-vous/booking-wizard/booking-wizard.component';
import { DossierEditorComponent } from './features/patients/dossier-editor/dossier-editor.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    PatientsListComponent,
    MedecinsListComponent,
    RendezVousListComponent,
    BookingWizardComponent,
    DossierEditorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
