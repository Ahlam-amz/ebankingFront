import { Component, OnInit } from '@angular/core';
import { Currency } from '../../models/currency.model';
import { CurrencyService } from '../../services/currency.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface AvailableCurrency {
  code: string;
  name: string;
  rate: number;
}

@Component({
  selector: 'app-currency-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.scss']
})
export class CurrencyListComponent implements OnInit {
  currencies: Currency[] = [];
  availableCurrencies: AvailableCurrency[] = [];
  loading = true;
  updatingRates = false;
  addingCurrency = '';
  error = '';
  successMessage = '';
  showAvailable = true;

  constructor(
    private currencyService: CurrencyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loading = true;
    this.error = '';

    Promise.all([
      this.loadCurrencies(),
      this.loadAvailableCurrencies()
    ]).finally(() => {
      this.loading = false;
    });
  }

  loadCurrencies(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.currencyService.getAllCurrencies().subscribe({
        next: (data) => {
          this.currencies = data;
          resolve();
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des devises';
          console.error(err);
          reject(err);
        }
      });
    });
  }

  loadAvailableCurrencies(): Promise<void> {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.currencyService.getLiveRates().toPromise(),
        this.currencyService.getAvailableCurrencies().toPromise()
      ]).then(([liveRates, availableCurrencies]) => {
        
        // Filtrer les devises déjà existantes
        const existingCodes = this.currencies.map(c => c.code);
        
        this.availableCurrencies = Object.keys(availableCurrencies || {})
          .filter(code => !existingCodes.includes(code))
          .map(code => ({
            code,
            name: availableCurrencies![code],
            rate: liveRates![code] || 1.0
          }))
          .sort((a, b) => a.code.localeCompare(b.code));
        
        resolve();
      }).catch(err => {
        console.error('Erreur lors du chargement des devises disponibles:', err);
        resolve(); // Ne pas bloquer si l'API externe échoue
      });
    });
  }

  editCurrency(id: number): void {
    this.router.navigate(['/currencies/edit', id]);
  }

  toggleStatus(currency: Currency, event: Event): void {
    event.stopPropagation();
    
    this.currencyService.toggleCurrencyStatus(currency.id!).subscribe({
      next: () => {
        currency.active = !currency.active;
        this.successMessage = `Devise ${currency.code} ${currency.active ? 'activée' : 'désactivée'}`;
        this.clearMessages();
      },
      error: (err) => {
        this.error = 'Erreur lors du changement de statut';
        console.error('Erreur lors du changement de statut', err);
        this.clearMessages();
      }
    });
  }

  deleteCurrency(id: number, event: Event): void {
    event.stopPropagation();
    
    const currency = this.currencies.find(c => c.id === id);
    const confirmMessage = 'Êtes-vous sûr de vouloir supprimer la devise ${currency?.code}?';
    
    if (confirm(confirmMessage)) {
      this.currencyService.deleteCurrency(id).subscribe({
        next: () => {
          this.currencies = this.currencies.filter(c => c.id !== id);
          this.successMessage = `Devise ${currency?.code} supprimée avec succès`;
          this.clearMessages();
          // Recharger les devises disponibles
          this.loadAvailableCurrencies();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression';
          console.error('Erreur lors de la suppression', err);
          this.clearMessages();
        }
      });
    }
  }

  addCurrencyFromAPI(currency: AvailableCurrency): void {
    this.addingCurrency = currency.code;
    
    // Demander les frais de conversion
    const feeInput = prompt(`Frais de conversion pour ${currency.code} (%) :`, '0.5');
    if (feeInput === null) {
      this.addingCurrency = '';
      return;
    }
    
    const conversionFee = parseFloat(feeInput) || 0;
    
    this.currencyService.createCurrencyFromAPI(currency.code, conversionFee).subscribe({
      next: (newCurrency) => {
        this.currencies.push(newCurrency);
        this.availableCurrencies = this.availableCurrencies.filter(c => c.code !== currency.code);
        this.successMessage = `Devise ${currency.code} ajoutée avec succès`;
        this.addingCurrency = '';
        this.clearMessages();
      },
      error: (err) => {
        this.error = `Erreur lors de l'ajout de ${currency.code}`;
        this.addingCurrency = '';
        console.error(err);
        this.clearMessages();
      }
    });
  }

  updateAllRates(): void {
    this.updatingRates = true;
    
    this.currencyService.updateRatesFromAPI().subscribe({
      next: () => {
        this.successMessage = 'Tous les taux ont été mis à jour avec succès';
        this.updatingRates = false;
        this.clearMessages();
        // Recharger les données
        this.loadCurrencies();
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour des taux';
        this.updatingRates = false;
        console.error(err);
        this.clearMessages();
      }
    });
  }

  toggleAvailableSection(): void {
    this.showAvailable = !this.showAvailable;
  }

  private clearMessages(): void {
    setTimeout(() => {
      this.error = '';
      this.successMessage = '';
    }, 5000);
  }
}