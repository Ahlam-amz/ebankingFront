import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Agent } from '../../shared/models/agent.model'
@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = 'http://localhost:8085/E-BankingApp/api/enrollements';

  constructor(private http: HttpClient) {}

    getById(id: number): Observable<Agent> {
      return this.http.get<Agent>(`${this.apiUrl}/${id}`);
    }

}
