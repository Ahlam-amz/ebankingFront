import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../../shared/models/client.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private apiUrl = 'http://localhost:8085/E-BankingApp/api/clients';

  constructor(private http: HttpClient) {}

  createClient(client: Client) {
    return this.http.post<Client>(this.apiUrl, client);
  }

   getAllClients(): Observable<Client[]> {
      return this.http.get<Client[]>(`${this.apiUrl}/all`);
    }

    getClientById(id: number): Observable<Client> {
      return this.http.get<Client>(`${this.apiUrl}/${id}`);

    }

     updateClient(client: Client): Observable<Client> {
      return this.http.put<Client>(`${this.apiUrl}/${client.id}`, client);

    }
}