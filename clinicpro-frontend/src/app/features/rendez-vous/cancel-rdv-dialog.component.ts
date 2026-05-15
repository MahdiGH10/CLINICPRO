import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface CancelRdvDialogData {
  patientNom?: string;
  heure?: string;
}

@Component({
  selector: 'app-cancel-rdv-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>Annuler le rendez-vous</h2>
    <mat-dialog-content>
      @if (data.patientNom) {
        <p class="dialog__hint">
          Rendez-vous de <strong>{{ data.patientNom }}</strong>
          @if (data.heure) {
            à {{ data.heure }}
          }
        </p>
      }
      <mat-form-field appearance="outline" class="dialog__field">
        <mat-label>Motif d'annulation</mat-label>
        <textarea matInput [formControl]="motifCtrl" rows="3"></textarea>
        @if (motifCtrl.hasError('required') && motifCtrl.touched) {
          <mat-error>Le motif est obligatoire</mat-error>
        }
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close()">Retour</button>
      <button
        mat-flat-button
        color="warn"
        type="button"
        [disabled]="motifCtrl.invalid"
        (click)="confirm()"
      >
        Confirmer l'annulation
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .dialog__hint {
      margin: 0 0 1rem;
      color: #475569;
    }

    .dialog__field {
      width: 100%;
      min-width: 18rem;
    }
  `
})
export class CancelRdvDialogComponent {
  readonly data = inject<CancelRdvDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CancelRdvDialogComponent, string>);

  readonly motifCtrl = new FormControl('', {
    nonNullable: true,
    validators: Validators.required
  });

  confirm(): void {
    if (this.motifCtrl.invalid) {
      this.motifCtrl.markAsTouched();
      return;
    }
    this.dialogRef.close(this.motifCtrl.value.trim());
  }
}
