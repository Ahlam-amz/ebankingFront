import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { Permission } from '../models/permission.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/admin/roles`;

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  getRoleByName(name: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/name/${name}`);
  }

  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role);
  }

  updateRole(role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${role.id}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getRolePermissions(roleId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/${roleId}/permissions`);
  }

  addPermissionToRole(roleId: number, permissionId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${roleId}/permissions/${permissionId}`, {});
  }

  removePermissionFromRole(roleId: number, permissionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${roleId}/permissions/${permissionId}`);
  }
}
