import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Enrollement } from '../../shared/models/enrollement.model';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class EnrollementService {
  private apiUrl = 'http://localhost:8085/E-BankingApp/api/enrollements';

  constructor(private http: HttpClient) {}

  createEnrollement(enrollement: Enrollement){
    return this.http.post<Enrollement>(this.apiUrl, enrollement);
  }

   getByStatus(status: string): Observable<Enrollement[]> {
    return this.http.get<Enrollement[]>(`${this.apiUrl}/status/${status}`);
  }

     getPendingEnrollments(): Observable<Enrollement[]> {
        return this.http.get<Enrollement[]>(`${this.apiUrl}/pending`);
    }

    getRecentEnrollments(): Observable<Enrollement[]> {
        return this.http.get<Enrollement[]>(`${this.apiUrl}/recent`);
    }

}
