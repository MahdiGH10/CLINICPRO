import { Component, OnInit } from '@angular/core';
import { Patient } from '../../core/models';
import { PatientService } from '../../core/services';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})
export class PatientsListComponent implements OnInit {
  patients: Patient[] = [];
  loading = true;
  error: string | null = null;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAll()
      .then(data => {
        this.patients = data;
        this.loading = false;
      })
      .catch(err => {
        this.error = 'Failed to load patients: ' + err.message;
        this.loading = false;
      });
  }
}
