import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from '../../interfaces/note';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './note-form.component.html'
})
export class NoteFormComponent {
  @Input() note?: Note;
  @Output() submitForm = new EventEmitter<Partial<Note>>();
  @Output() cancelForm = new EventEmitter<void>();

  noteForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.note) {
      this.noteForm.patchValue(this.note);
    }
  }

  onSubmit() {
    if (this.noteForm.valid) {
      this.submitForm.emit(this.noteForm.value);
    }
  }

  onCancel() {
    this.cancelForm.emit();
  }
}
