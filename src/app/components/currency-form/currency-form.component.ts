import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Currency } from '../../models/currency.model';
import { CurrencyService } from '../../services/currency.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

interface AvailableCurrency {
  code: string;
  name: string;
  rate: number;
}

@Component({
  selector: 'app-currency-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './currency-form.component.html',
  styleUrls: ['./currency-form.component.scss']
})
export class CurrencyFormComponent implements OnInit {
  currencyForm: FormGroup;
  isEditMode = false;
  currencyId: number | null = null;
  loading = false;
  submitted = false;
  error = '';
  successMessage = '';
  
  // Nouvelles propriétés pour l'API
  availableCurrencies: AvailableCurrency[] = [];
  selectedCurrency: AvailableCurrency | null = null;

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currencyForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(3)]],
      name: ['', [Validators.required]],
      exchangeRate: [1.0, [Validators.required, Validators.min(0.0001)]],
      conversionFee: [0, [Validators.min(0)]],
      active: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.currencyId = +id;
      this.loadCurrency(this.currencyId);
    } else {
      // Mode création : charger les devises disponibles
      this.loadAvailableCurrencies();
    }
  }

  loadAvailableCurrencies(): void {
    this.loading = true;
    
    // Charger les taux en temps réel et les devises disponibles
    Promise.all([
      this.currencyService.getLiveRates().toPromise(),
      this.currencyService.getAvailableCurrencies().toPromise(),
      this.currencyService.getAllCurrencies().toPromise()
    ]).then(([liveRates, availableCurrencies, existingCurrencies]) => {
      
      // Filtrer les devises déjà existantes
      const existingCodes = existingCurrencies?.map(c => c.code) || [];
      
      this.availableCurrencies = Object.keys(availableCurrencies || {})
        .filter(code => !existingCodes.includes(code))
        .map(code => ({
          code,
          name: availableCurrencies![code],
          rate: liveRates![code] || 1.0
        }));
      
      this.loading = false;
    }).catch(err => {
      this.error = 'Erreur lors du chargement des devises disponibles';
      this.loading = false;
      console.error(err);
    });
  }

  selectCurrency(currency: AvailableCurrency): void {
    this.selectedCurrency = currency;
    this.currencyForm.patchValue({
      code: currency.code,
      name: currency.name,
      exchangeRate: currency.rate,
      conversionFee: 0,
      active: true
    });
  }

  loadCurrency(id: number): void {
    this.loading = true;
    this.currencyService.getCurrencyById(id).subscribe({
      next: (currency) => {
        this.currencyForm.patchValue({
          code: currency.code,
          name: currency.name,
          exchangeRate: currency.exchangeRate,
          conversionFee: currency.conversionFee,
          active: currency.active
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de la devise';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.currencyForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';

    if (this.isEditMode && this.currencyId) {
      // Mode édition
      const currency: Currency = {
        id: this.currencyId,
        ...this.currencyForm.getRawValue()
      };
      
      this.currencyService.updateCurrency(currency).subscribe({
        next: () => {
          this.successMessage = 'Devise mise à jour avec succès';
          setTimeout(() => this.router.navigate(['/currencies']), 1500);
        },
        error: (err) => {
          this.error = 'Erreur lors de la mise à jour de la devise';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      // Mode création depuis API
      if (!this.selectedCurrency) {
        this.error = 'Veuillez sélectionner une devise';
        this.loading = false;
        return;
      }

      const conversionFee = this.currencyForm.get('conversionFee')?.value || 0;
      
      this.currencyService.createCurrencyFromAPI(this.selectedCurrency.code, conversionFee).subscribe({
        next: () => {
          this.successMessage = 'Devise créée avec succès depuis l\'API';
          setTimeout(() => this.router.navigate(['/currencies']), 1500);
        },
        error: (err) => {
          this.error = 'Erreur lors de la création de la devise';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  get f() { return this.currencyForm.controls; }
}