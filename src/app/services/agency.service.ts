import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agency } from '../models/agency.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private apiUrl = `${environment.apiUrl}/admin/agencies`;

  constructor(private http: HttpClient) { }

  getAllAgencies(): Observable<Agency[]> {
    return this.http.get<Agency[]>(this.apiUrl);
  }

  getActiveAgencies(): Observable<Agency[]> {
    return this.http.get<Agency[]>(`${this.apiUrl}/active`);
  }

  getAgencyById(id: number): Observable<Agency> {
    return this.http.get<Agency>(`${this.apiUrl}/${id}`);
  }

  getAgencyByCode(code: string): Observable<Agency> {
    return this.http.get<Agency>(`${this.apiUrl}/code/${code}`);
  }

  createAgency(agency: Agency): Observable<Agency> {
    return this.http.post<Agency>(this.apiUrl, agency);
  }

  updateAgency(agency: Agency): Observable<Agency> {
    return this.http.put<Agency>(`${this.apiUrl}/${agency.id}`, agency);
  }

  deleteAgency(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateAgencyHours(id: number, openingTime: string, closingTime: string): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${id}/hours`,
      null,
      { params: { openingTime, closingTime } }
    );
  }

  toggleAgencyStatus(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/toggle-status`, null);
  }
}
