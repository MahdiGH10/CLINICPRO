import { Component, OnInit } from '@angular/core';
import { RendezVous } from '../../core/models';
import { RendezVousService } from '../../core/services';

@Component({
  selector: 'app-rendez-vous-list',
  templateUrl: './rendez-vous-list.component.html',
  styleUrls: ['./rendez-vous-list.component.scss']
})
export class RendezVousListComponent implements OnInit {
  appointments: RendezVous[] = [];
  loading = true;
  error: string | null = null;

  constructor(private rendezVousService: RendezVousService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.rendezVousService.getAll()
      .then(data => {
        this.appointments = data;
        this.loading = false;
      })
      .catch(err => {
        this.error = 'Failed to load appointments: ' + err.message;
        this.loading = false;
      });
  }
}
