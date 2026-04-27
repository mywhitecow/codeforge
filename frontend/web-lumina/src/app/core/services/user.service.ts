// core/services/user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

export interface UserDTO {
  name?: string;
  email?: string;
  password?: string;
  role_id?: number;
  is_active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/users`;

  getUsers(page: number = 1): Observable<PaginatedResponse<User & { role_id?: number }>> {
    let params = new HttpParams().set('page', page);
    return this.http.get<PaginatedResponse<User & { role_id?: number }>>(this.API_URL, { params });
  }

  getUser(id: string): Observable<User & { role_id?: number }> {
    return this.http.get<User & { role_id?: number }>(`${this.API_URL}/${id}`);
  }

  createUser(data: UserDTO): Observable<{ message: string; user: User }> {
    return this.http.post<{ message: string; user: User }>(this.API_URL, data);
  }

  updateUser(id: string, data: UserDTO): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${this.API_URL}/${id}`, data);
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }
}
