import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/username/${username}`);
  }

  getUsersByAgency(agencyId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/agency/${agencyId}`);
  }

  getUsersByRole(roleId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${roleId}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleUserStatus(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/toggle-status`, {});
  }

  updateUserRole(userId: number, roleId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${userId}/role?roleId=${roleId}`, {});
  }

  updateUserAgency(userId: number, agencyId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${userId}/agency?agencyId=${agencyId}`, {});
  }
}
