import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Currency } from '../../models/currency.model';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-exchange-rates',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.scss']
})
export class ExchangeRatesComponent implements OnInit {
  currencies: Currency[] = [];
  loading = true;
  error = '';
  exchangeRateForm: FormGroup;
  selectedCurrency: Currency | null = null;
  
  constructor(
    private currencyService: CurrencyService,
    private fb: FormBuilder
  ) {
    this.exchangeRateForm = this.fb.group({
      exchangeRate: ['', [Validators.required, Validators.min(0.0001)]],
      conversionFee: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadCurrencies();
  }

  loadCurrencies(): void {
    this.loading = true;
    this.currencyService.getAllCurrencies().subscribe({
      next: (data) => {
        this.currencies = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des devises';
        this.loading = false;
        console.error(err);
      }
    });
  }

  selectCurrency(currency: Currency): void {
    this.selectedCurrency = currency;
    this.exchangeRateForm.patchValue({
      exchangeRate: currency.exchangeRate,
      conversionFee: currency.conversionFee
    });
  }

  onSubmit(): void {
    if (this.exchangeRateForm.invalid || !this.selectedCurrency) {
      return;
    }
    
    const { exchangeRate, conversionFee } = this.exchangeRateForm.value;
    
    // Mettre à jour le taux de change
    this.currencyService.updateExchangeRate(this.selectedCurrency.code, exchangeRate).subscribe({
      next: () => {
        // Mettre à jour les frais de conversion
        this.currencyService.updateConversionFee(this.selectedCurrency!.code, conversionFee).subscribe({
          next: () => {
            // Mettre à jour la liste des devises
            this.loadCurrencies();
            this.selectedCurrency = null;
          },
          error: (err) => {
            this.error = 'Erreur lors de la mise à jour des frais de conversion';
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour du taux de change';
        console.error(err);
      }
    });
  }
}
