import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../../../core/api/transaction.service';
import { AccountService } from '../../../../core/api/account.service';
import { Account } from '../../../../shared/models/account.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionType } from '../../../../shared/models/transaction.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  isLoading = false;
  accounts: Account[] = [];
  transactionType: TransactionType = 'DEPOSIT';
  agentId?: number;

  transactionTypes = {
    DEPOSIT: 'Deposit',
    WITHDRAWAL: 'Withdrawal',
    TRANSFER: 'Transfer',
    STANDING_ORDER: 'Standing Order',
    REVERSAL: 'Reversal'
  };

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.transactionForm = this.fb.group({
      sourceAccountId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: [''],
      targetAccountId: [''],
      frequency: [''],
      startDate: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.transactionType = params['type'].toUpperCase() as TransactionType;
      
      // Get agent ID from your auth service or state
      this.agentId = 1; // Replace with actual agent ID from your auth system

      this.loadAllAccounts();

      // Set up form validation based on transaction type
      if (this.transactionType === 'TRANSFER' || this.transactionType === 'STANDING_ORDER') {
        this.transactionForm.get('targetAccountId')?.setValidators([Validators.required]);
      }

      if (this.transactionType === 'STANDING_ORDER') {
        this.transactionForm.get('frequency')?.setValidators([Validators.required]);
        this.transactionForm.get('startDate')?.setValidators([Validators.required]);
      }
    });
  }

  loadAllAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (err) => {
        this.snackBar.open('Failed to load accounts', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.transactionForm.invalid || !this.agentId) return;

    this.isLoading = true;
    const formData = this.transactionForm.value;

    switch (this.transactionType) {
      case 'DEPOSIT':
        this.processDeposit(formData);
        break;
      case 'WITHDRAWAL':
        this.processWithdrawal(formData);
        break;
      case 'TRANSFER':
        this.processTransfer(formData);
        break;
      case 'STANDING_ORDER':
        this.processStandingOrder(formData);
        break;
      default:
        this.snackBar.open('Invalid transaction type', 'Close', { duration: 3000 });
        this.isLoading = false;
    }
  }

  private processDeposit(formData: any): void {
    this.transactionService.deposit(
      formData.sourceAccountId,
      formData.amount,
      this.agentId!,
      formData.description
    ).subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err)
    });
  }

  private processWithdrawal(formData: any): void {
    this.transactionService.withdraw(
      formData.sourceAccountId,
      formData.amount,
      this.agentId!,
      formData.description
    ).subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err)
    });
  }

  private processTransfer(formData: any): void {
    this.transactionService.transfer(
      formData.sourceAccountId,
      formData.targetAccountId,
      formData.amount,
      this.agentId!,
      formData.description
    ).subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err)
    });
  }

  private processStandingOrder(formData: any): void {
    this.transactionService.setupStandingOrder(
      formData.sourceAccountId,
      formData.targetAccountId,
      formData.amount,
      formData.frequency,
      formData.startDate,
      this.agentId!
    ).subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err)
    });
  }

  private handleSuccess(): void {
    this.isLoading = false;
    this.snackBar.open('Transaction completed successfully', 'Close', { duration: 3000 });
    this.router.navigate(['/transactions']);
  }

  private handleError(error: any): void {
    this.isLoading = false;
    const errorMessage = error.error?.message || 'Transaction failed';
    this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
  }

  onCancel(): void {
    this.location.back();
  }

  get title(): string {
    return this.transactionTypes[this.transactionType];
  }

  get showTargetAccount(): boolean {
    return this.transactionType === 'TRANSFER' || this.transactionType === 'STANDING_ORDER';
  }

  get showStandingOrderFields(): boolean {
    return this.transactionType === 'STANDING_ORDER';
  }

  getTransactionIcon(): string {
  const icons = {
    DEPOSIT: 'arrow_downward',
    WITHDRAWAL: 'arrow_upward',
    TRANSFER: 'swap_horiz',
    STANDING_ORDER: 'schedule',
    REVERSAL : 'reversal'
  };
  return icons[this.transactionType] || 'payment';
}

getSubmitIcon(): string {
  const icons = {
    DEPOSIT: 'add_circle',
    WITHDRAWAL: 'remove_circle',
    TRANSFER: 'swap_horizontal_circle',
    STANDING_ORDER: 'schedule_send',
    REVERSAL : 'reversal'
  };
  return icons[this.transactionType] || 'check_circle';
}
}