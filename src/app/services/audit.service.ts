import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditLog } from '../models/audit-log.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl = 'http://localhost:8085/E-BankingApp/api/admin/audit-logs';
  
  constructor(private http: HttpClient) { }

  // Récupérer tous les logs d'audit
  getAllAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(this.apiUrl);
  }

  // Récupérer les logs d'audit pour une entité spécifique
  getAuditLogsForEntity(entityType: string, entityId: string): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/${entityType}/${entityId}`);
  }
}
