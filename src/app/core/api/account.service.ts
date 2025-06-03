import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../../shared/models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = 'http://localhost:8085/E-BankingApp/api/accounts';


  constructor(private http: HttpClient) { }

  createAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account);
  }

  getAccounts(): Observable<Account[]>{
    return this.http.get<Account[]>(this.apiUrl)
  }
}
