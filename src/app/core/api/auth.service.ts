// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8085/E-BankingApp/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { username, password }).pipe(
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }
}