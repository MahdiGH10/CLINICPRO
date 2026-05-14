import { Component, OnInit } from '@angular/core';
import { Medecin } from '../../core/models';
import { MedecinService } from '../../core/services';

@Component({
  selector: 'app-medecins-list',
  templateUrl: './medecins-list.component.html',
  styleUrls: ['./medecins-list.component.scss']
})
export class MedecinsListComponent implements OnInit {
  medecins: Medecin[] = [];
  loading = true;
  error: string | null = null;

  constructor(private medecinService: MedecinService) {}

  ngOnInit(): void {
    this.loadMedecins();
  }

  loadMedecins(): void {
    this.medecinService.getAll()
      .then(data => {
        this.medecins = data;
        this.loading = false;
      })
      .catch(err => {
        this.error = 'Failed to load doctors: ' + err.message;
        this.loading = false;
      });
  }
}
