import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Currency } from '../models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'http://localhost:8085/E-BankingApp/api/admin/currencies';
  
  constructor(private http: HttpClient) { }

  // Récupérer toutes les devises
  getAllCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.apiUrl);
  }

  // Récupérer toutes les devises actives
  getActiveCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${this.apiUrl}/active`);
  }

  // Récupérer une devise par ID
  getCurrencyById(id: number): Observable<Currency> {
    return this.http.get<Currency>(`${this.apiUrl}/${id}`);
  }

  // Récupérer une devise par code
  getCurrencyByCode(code: string): Observable<Currency> {
    return this.http.get<Currency>(`${this.apiUrl}/code/${code}`);
  }

  // Créer une nouvelle devise
  createCurrency(currency: Currency, userId: string = 'system'): Observable<Currency> {
    const headers = new HttpHeaders().set('X-User-Id', userId);
    return this.http.post<Currency>(this.apiUrl, currency, { headers });
  }

  // Mettre à jour une devise
  updateCurrency(currency: Currency, userId: string = 'system'): Observable<Currency> {
    const headers = new HttpHeaders().set('X-User-Id', userId);
    return this.http.put<Currency>(`${this.apiUrl}/${currency.id}, currency`, { headers });
  }

  // Supprimer une devise
  deleteCurrency(id: number, userId: string = 'system'): Observable<void> {
    const headers = new HttpHeaders().set('X-User-Id', userId);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  // Mettre à jour le taux de change
  updateExchangeRate(code: string, rate: number, userId: string = 'system'): Observable<void> {
    const headers = new HttpHeaders().set('X-User-Id', userId);
    return this.http.patch<void>(`${this.apiUrl}/${code}/exchange-rate?rate=${rate}`, {}, { headers });
  }

  // Mettre à jour les frais de conversion
  updateConversionFee(code: string, fee: number, userId: string = 'system'): Observable<void> {
    const headers = new HttpHeaders().set('X-User-Id', userId);
    return this.http.patch<void>(`${this.apiUrl}/${code}/conversion-fee?fee=${fee}`, {}, { headers });
  }

  // Activer/désactiver une devise
  toggleCurrencyStatus(id: number, userId: string = 'system'): Observable<void> {
    const headers = new HttpHeaders().set('X-User-Id', userId);
    return this.http.patch<void>(`${this.apiUrl}/${id}/toggle-status`, {}, { headers });
  }

  // Ajoutez ces méthodes à votre service existant :

// Récupérer les taux en temps réel
getLiveRates(): Observable<{[key: string]: number}> {
  return this.http.get<{[key: string]: number}>(`${this.apiUrl}/live-rates`);
}

// Récupérer les devises disponibles
getAvailableCurrencies(): Observable<{[key: string]: string}> {
  return this.http.get<{[key: string]: string}>(`${this.apiUrl}/available-currencies`);
}

// Créer une devise depuis l'API
createCurrencyFromAPI(code: string, conversionFee: number, userId: string = 'system'): Observable<Currency> {
  const headers = new HttpHeaders().set('X-User-Id', userId);
  return this.http.post<Currency>(`${this.apiUrl}/create-from-api?code=${code}&conversionFee=${conversionFee}`, {}, { headers });
}
updateRatesFromAPI(userId: string = 'system'): Observable<string> {
  const headers = new HttpHeaders().set('X-User-Id', userId);
  return this.http.post<string>(`${this.apiUrl}/update-rates-from-api`, {}, { 
    headers,
    responseType: 'text' as 'json'
  });
}
}