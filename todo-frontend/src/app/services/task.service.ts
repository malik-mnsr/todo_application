import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskRequest, TaskResponse, TaskStatus } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:8080/tasks'; // Ton backend Spring Boot

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(this.apiUrl);
  }

  getTaskById(id: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}/${id}`);
  }

  createTask(task: TaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(this.apiUrl, task);
  }

  updateTask(id: number, task: TaskRequest): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/${id}`, task);
  }

  updateStatus(id: number, status: TaskStatus): Observable<TaskResponse> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<TaskResponse>(`${this.apiUrl}/${id}/status`, {}, { params });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchTasks(keyword: string): Observable<TaskResponse[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<TaskResponse[]>(`${this.apiUrl}/search`, { params });
  }
}