import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../../../core/api/transaction.service';
import { AccountService } from '../../../../core/api/account.service';
import { Account } from '../../../../shared/models/account.model';
import { MatSnackBar } from '@angular/material/snack-bar';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-standing-order-form',
  templateUrl: './standing-order-form.component.html',
  styleUrls: ['./standing-order-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ]
})
export class StandingOrderFormComponent implements OnInit {
  standingOrderForm: FormGroup;
  isLoading = false;
  accounts: Account[] = [];
  minDate: Date;
  frequencyOptions = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' }
  ];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<StandingOrderFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      accountId: number;
      agentId: number;
    }
  ) {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1); // Tomorrow

    this.standingOrderForm = this.fb.group({
      targetAccountId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      frequency: ['', Validators.required],
      startDate: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadEligibleAccounts();
  }

  loadEligibleAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts.filter(a => a.accountId !== this.data.accountId);
      },
      error: (err) => {
        this.snackBar.open('Failed to load accounts', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.standingOrderForm.invalid) return;

    this.isLoading = true;
    const formData = this.standingOrderForm.value;
    const startDate = new Date(formData.startDate);
    const formattedDate = startDate.toISOString();

    this.transactionService.setupStandingOrder(
      this.data.accountId,
      formData.targetAccountId,
      formData.amount,
      formData.frequency,
      formattedDate,
      this.data.agentId
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.dialogRef.close('success');
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || 'Failed to create standing order';
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
      }
    });
  }
}