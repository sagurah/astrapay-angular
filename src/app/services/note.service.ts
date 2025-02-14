import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Note } from '../interfaces/note';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private baseUrl = 'http://localhost:8000/api/notes';

  constructor(private http: HttpClient) { }

  getAllNotes(): Observable<Note[]> {
    return this.http.get<ApiResponse<Note[]>>(`${this.baseUrl}/list`)
      .pipe(
        map(response => response.data)
      );
  }

  getNoteById(uuid: string): Observable<Note> {
    return this.http.get<ApiResponse<Note>>(`${this.baseUrl}/${uuid}`)
      .pipe(
        map(response => response.data)
      );
  }

  createNote(note: Pick<Note, 'title' | 'description' | 'content'>): Observable<Note> {
    return this.http.post<ApiResponse<Note>>(`${this.baseUrl}/create`, note)
      .pipe(
        map(response => response.data)
      );
  }

  updateNote(notesId: string, note: Pick<Note, 'title' | 'description' | 'content'>): Observable<Note> {
    return this.http.put<ApiResponse<Note>>(`${this.baseUrl}/update/${notesId}`, note)
      .pipe(
        map(response => response.data)
      );
  }

  deleteNote(notesId: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/delete/${notesId}`)
      .pipe(
        map(response => response.data)
      );
  }
}
