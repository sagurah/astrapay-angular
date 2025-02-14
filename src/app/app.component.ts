import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotesCardComponent } from './components/notes-card/notes-card.component';
import { NoteFormComponent } from './components/note-form/note-form.component';
import { NoteDetailComponent } from './components/note-detail/note-detail.component';
import { NoteService } from './services/note.service';
import { Note } from './interfaces/note';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NotesCardComponent, NoteFormComponent, NoteDetailComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  notes: Note[] = [];
  isLoading = false;
  error: string | null = null;
  showForm = false;
  selectedNote?: Note;
  selectedNoteForView?: Note;
  appTitle = 'Notes App';

  constructor(private noteService: NoteService) {}

  ngOnInit() {
    this.loadNotes();
    console.log(this.notes);
  }

  loadNotes() {
    this.isLoading = true;
    this.error = null;
    
    this.noteService.getAllNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load notes. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  createNewNote() {
    this.selectedNote = undefined;
    this.showForm = true;
  }

  handleFormSubmit(formData: Partial<Note>) {
    if (this.selectedNote) {
      const updateData = {
        title: formData.title!,
        description: formData.description!,
        content: formData.content!
      };

      this.noteService.updateNote(this.selectedNote.notesId, updateData).subscribe({
        next: () => {
          this.loadNotes();
          this.showForm = false;
          this.selectedNote = undefined;
        },
        error: (err) => {
          this.error = 'Failed to update note';
        }
      });
    } else {
      const newNote = {
        title: formData.title!,
        description: formData.description!,
        content: formData.content!
      };
      
      this.noteService.createNote(newNote).subscribe({
        next: () => {
          this.loadNotes();
          this.showForm = false;
        },
        error: (err) => {
          this.error = 'Failed to create note';
        }
      });
    }
  }

  handleFormCancel() {
    this.showForm = false;
    this.selectedNote = undefined;
  }

  viewNoteDetail(note: Note) {
    this.selectedNoteForView = note;
  }

  closeNoteDetail() {
    this.selectedNoteForView = undefined;
  }

  deleteNote(noteId: string) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.noteService.deleteNote(noteId).subscribe({
        next: () => {
          this.loadNotes();
          this.selectedNoteForView = undefined;
        },
        error: (err) => {
          this.error = 'Failed to delete note';
        }
      });
    }
  }

  editNote(note: Note) {
    this.selectedNote = note;
    this.showForm = true;
    this.selectedNoteForView = undefined;
  }
}
