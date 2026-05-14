import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-booking-wizard',
  templateUrl: './booking-wizard.component.html',
  styleUrls: ['./booking-wizard.component.scss']
})
export class BookingWizardComponent {
  // Minimal signal-based state placeholders
  patient = signal<any | null>(null);
  selectedDoctor = signal<any | null>(null);
  selectedDate = signal<Date | null>(null);
  step = signal<number>(1);

  next() { this.step.set(this.step() + 1); }
  prev() { this.step.set(Math.max(1, this.step() - 1)); }
}
