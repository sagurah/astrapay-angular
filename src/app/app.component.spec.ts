import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NoteService } from './services/note.service';
import { of, throwError } from 'rxjs';
import { Note } from './interfaces/note';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockNoteService: jasmine.SpyObj<NoteService>;

  const currentDate = new Date().toISOString();
  const mockNotes: Note[] = [
    {
      notesId: '1',
      title: 'Test Note 1',
      description: 'Test Desc 1',
      content: 'Test Content 1',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      notesId: '2',
      title: 'Test Note 2',
      description: 'Test Desc 2',
      content: 'Test Content 2',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  ];

  beforeEach(async () => {
    mockNoteService = jasmine.createSpyObj('NoteService', [
      'getAllNotes',
      'createNote',
      'updateNote',
      'deleteNote',
    ]);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: NoteService, useValue: mockNoteService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load notes', () => {
    it('should load notes successfully', fakeAsync(() => {
      mockNoteService.getAllNotes.and.returnValue(of(mockNotes));
      component.loadNotes();
      tick();
      expect(component.notes).toEqual(mockNotes);
    }));
  });

  describe('create notes', () => {
    it('should create new note successfully', fakeAsync(() => {
      const newNote = {
        title: 'New Note',
        description: 'New Desc',
        content: 'New Content',
      };
      mockNoteService.createNote.and.returnValue(of({
        ...newNote,
        notesId: '3',
        createdAt: currentDate,
        updatedAt: currentDate
      }));
      mockNoteService.getAllNotes.and.returnValue(of(mockNotes));

      component.handleFormSubmit(newNote);
      tick();

      expect(mockNoteService.createNote).toHaveBeenCalledWith(newNote);
    }));
  });

  describe('update notes', () => {
    it('should update note successfully', fakeAsync(() => {
      mockNoteService.getAllNotes.and.returnValue(of(mockNotes));
      component.ngOnInit();
      tick();

      const updateNote = {
        title: 'Updated Note',
        description: 'Updated Desc',
        content: 'Updated Content',
      };
      component.selectedNote = mockNotes[0];
      mockNoteService.updateNote.and.returnValue(of({
        ...updateNote,
        notesId: '1',
        createdAt: mockNotes[0].createdAt,
        updatedAt: currentDate
      }));
      mockNoteService.getAllNotes.and.returnValue(of([...mockNotes]));

      component.handleFormSubmit(updateNote);
      tick();

      expect(mockNoteService.updateNote).toHaveBeenCalledWith('1', updateNote);
    }));
  });

  describe('delete notes', () => {
    it('should delete note successfully', fakeAsync(() => {
      mockNoteService.getAllNotes.and.returnValue(of(mockNotes));
      component.ngOnInit();
      tick();
      
      spyOn(window, 'confirm').and.returnValue(true);
      mockNoteService.deleteNote.and.returnValue(of(void 0));
      mockNoteService.getAllNotes.and.returnValue(of(mockNotes.filter(n => n.notesId !== '1')));
      
      component.deleteNote('1');
      tick();

      expect(mockNoteService.deleteNote).toHaveBeenCalledWith('1');
    }));

    it('should not delete note when user cancels confirmation', fakeAsync(() => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.deleteNote('1');
      tick();
      expect(mockNoteService.deleteNote).not.toHaveBeenCalled();
    }));
  });
});
