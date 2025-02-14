import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../interfaces/note';

@Component({
  selector: 'app-note-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-detail.component.html'
})
export class NoteDetailComponent {
  @Input() note!: Note;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<string>();

  onClose() {
    this.close.emit();
  }

  onEdit() {
    this.edit.emit(this.note);
  }

  onDelete() {
    this.delete.emit(this.note.notesId);
  }
}
