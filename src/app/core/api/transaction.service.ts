import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, TransactionType } from '../../shared/models/transaction.model';
import { Account } from '../../shared/models/account.model';
import { Agent } from '../../shared/models/agent.model';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8085/E-BankingApp/api/transactions'; // Adjust based on your API base URL


  private headers = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });


  constructor(private http: HttpClient) { }



  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('An error occurred:', error.error.message);
    } else {
      // Server-side error
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something went wrong; please try again later.');
  }



  // ========== CORE OPERATIONS ========== //

  // Add to your TransactionService
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }


  deposit(accountId: number, amount: number, agentId: number, description?: string): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiUrl}/deposit`, 
      null,
      {
        headers: this.headers,
        params: {
          accountId: accountId.toString(),
          amount: amount.toString(), // Convert to string for BigDecimal
          agentId: agentId.toString(),
          ...(description && { description })
        }
      }
    ).pipe(catchError(this.handleError));
  }

  withdraw(accountId: number, amount: number, agentId: number, description?: string): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiUrl}/withdraw`,
      null,
      {
        headers: this.headers,
        params: {
          accountId: accountId.toString(),
          amount: amount.toString(),
          agentId: agentId.toString(),
          ...(description && { description })
        }
      }
    ).pipe(catchError(this.handleError));
  }

  transfer(
    sourceAccountId: number,
    targetAccountId: number,
    amount: number,
    agentId: number,
    description?: string
  ): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiUrl}/transfer`,
      null,
      {
        headers: this.headers,
        params: {
          sourceAccountId: sourceAccountId.toString(),
          targetAccountId: targetAccountId.toString(),
          amount: amount.toString(),
          agentId: agentId.toString(),
          ...(description && { description })
        }
      }
    ).pipe(catchError(this.handleError));
  }

 setupStandingOrder(
    accountId: number,
    targetAccountId: number,
    amount: number,
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY',
    startDate: string,
    agentId: number
  ): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.apiUrl}/standing-orders`,
      null,
      {
        headers: this.headers,
        params: {
          accountId: accountId.toString(),
          targetAccountId: targetAccountId.toString(),
          amount: amount.toString(),
          frequency,
          startDate,
          agentId: agentId.toString()
        }
      }
    ).pipe(catchError(this.handleError));
  }

  // ========== QUERY OPERATIONS ========== //

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  getTransactionByReference(reference: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/reference/${reference}`);
  }

  getAccountTransactions(accountId: number, limit: number = 10): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/account/${accountId}`, {
      params: { limit: limit.toString() }
    });
  }

  getRecentTransactions(limit: number = 5): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/recent`, {
      params: { limit: limit.toString() }
    });
  }

  // ========== ADMIN OPERATIONS ========== //

  getDailyDepositTotal(agentId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/daily-deposits`, {
      params: { agentId: agentId.toString() }
    });
  }

  reverseTransaction(reference: string, agentId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reverse/${reference}`, null, {
      params: { agentId: agentId.toString() }
    });
  }
}