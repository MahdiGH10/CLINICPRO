import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-dossier-editor',
  templateUrl: './dossier-editor.component.html',
  styleUrls: ['./dossier-editor.component.scss']
})
export class DossierEditorComponent {
  content = signal<string>('');
  saving = signal<boolean>(false);
  lastSaved = signal<Date | null>(null);

  save() {
    this.saving.set(true);
    setTimeout(() => {
      this.lastSaved.set(new Date());
      this.saving.set(false);
    }, 800);
  }
}
