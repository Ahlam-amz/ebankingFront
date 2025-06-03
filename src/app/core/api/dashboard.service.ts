// core/api/dashboard.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardStats } from '../../shared/models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'http://localhost:8085/E-BankingApp/api/dashboard'; // You'll need to create this endpoint

  constructor(private http: HttpClient) {}

  getStats() {
    return this.http.get<DashboardStats>(this.apiUrl);
  }
}