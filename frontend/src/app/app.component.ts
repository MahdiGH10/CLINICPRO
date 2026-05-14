import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ClinicPRO';
  currentView = 'dashboard';

  setView(view: string) {
    this.currentView = view;
  }
}
