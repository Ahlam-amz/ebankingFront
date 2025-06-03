import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permission } from '../models/permission.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl = `${environment.apiUrl}/admin/permissions`;

  constructor(private http: HttpClient) { }

  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.apiUrl);
  }

  getPermissionById(id: number): Observable<Permission> {
    return this.http.get<Permission>(`${this.apiUrl}/${id}`);
  }

  createPermission(permission: Permission): Observable<Permission> {
    return this.http.post<Permission>(this.apiUrl, permission);
  }

  updatePermission(permission: Permission): Observable<Permission> {
    return this.http.put<Permission>(`${this.apiUrl}/${permission.id}`, permission);
  }

  deletePermission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
