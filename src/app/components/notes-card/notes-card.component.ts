import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../interfaces/note';

@Component({
  selector: 'app-notes-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-card.component.html'
})
export class NotesCardComponent {
  @Input() note!: Note;
  @Output() viewNote = new EventEmitter<Note>();

  onClick() {
    this.viewNote.emit(this.note);
  }
}
