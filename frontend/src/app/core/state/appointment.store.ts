import { signal, computed, effect } from '@angular/core';

export class AppointmentStore {
  appointments = signal<any[]>([]);
  selectedDate = signal<Date>(new Date());
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  todaysAppointments = computed(() => this.appointments().filter(a => {
    const d = new Date(a.dateRendezVous || a.date || Date.now());
    return d.toDateString() === this.selectedDate().toDateString();
  }));

  cancelledCount = computed(() => this.appointments().filter(a => a.status === 'ANNULE' || a.statut === 'ANNULE').length);

  setAppointments(list: any[]) { this.appointments.set(list); }
  addAppointment(a: any) { this.appointments.update(arr => [...arr, a]); }
}
