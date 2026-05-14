import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PatientsListComponent } from './pages/patients-list/patients-list.component';
import { MedecinsListComponent } from './pages/medecins-list/medecins-list.component';
import { RendezVousListComponent } from './pages/rendez-vous-list/rendez-vous-list.component';

@NgModule({
  declarations: [
    AppComponent,
    PatientsListComponent,
    MedecinsListComponent,
    RendezVousListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
