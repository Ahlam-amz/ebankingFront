import { Component } from '@angular/core';
import { TransactionService } from '../../../../core/api/transaction.service';
import { AccountService } from '../../../../core/api/account.service';
import { Transaction, TransactionType } from '../../../../shared/models/transaction.model';
import { Account } from '../../../../shared/models/account.model';
import { MatDialog } from '@angular/material/dialog';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { StandingOrderFormComponent } from '../standing-order-form/standing-order-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-agent-transactions',
  templateUrl: './agent-transactions.component.html',
  styleUrls: ['./agent-transactions.component.scss']
})
export class AgentTransactionsComponent {
  activeTabIndex = 0;
  recentTransactions: Transaction[] = [];
  accountTransactions: Transaction[] = [];
  selectedAccount: Account | null = null;
  accounts: Account[] = [];
  isLoading = false;
  currentAgentId = 1; // In a real app, this would come from auth service

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRecentTransactions();
    this.loadClientAccounts();
  }

  loadRecentTransactions(): void {
    this.isLoading = true;
    this.transactionService.getRecentTransactions(10)
      .subscribe({
        next: (transactions) => {
          this.recentTransactions = transactions;
          this.isLoading = false;
        },
        error: (err) => {
          this.showError('Failed to load recent transactions');
          this.isLoading = false;
        }
      });
  }

  loadAccountTransactions(accountId: number): void {
    this.isLoading = true;
    this.transactionService.getAccountTransactions(accountId)
      .subscribe({
        next: (transactions) => {
          this.accountTransactions = transactions;
          this.isLoading = false;
        },
        error: (err) => {
          this.showError('Failed to load account transactions');
          this.isLoading = false;
        }
      });
  }

  loadClientAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        if (accounts.length > 0) {
          this.selectedAccount = accounts[0];
          this.loadAccountTransactions(accounts[0].accountId!);
        }
      },
      error: (err) => this.showError('Failed to load client accounts')
    });
  }

  onAccountSelected(account: Account): void {
    this.selectedAccount = account;
    this.loadAccountTransactions(account.accountId!);
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.activeTabIndex = event.index;
  }

  openTransactionDialog(type: TransactionType): void {
    if (!this.selectedAccount) {
      this.showError('Please select an account first');
      return;
    }

    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '500px',
      data: {
        type,
        accountId: this.selectedAccount.accountId,
        agentId: this.currentAgentId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadRecentTransactions();
        this.loadAccountTransactions(this.selectedAccount!.accountId!);
        this.showSuccess('Transaction completed successfully');
      }
    });
  }

  openStandingOrderDialog(): void {
    if (!this.selectedAccount) {
      this.showError('Please select an account first');
      return;
    }

    const dialogRef = this.dialog.open(StandingOrderFormComponent, {
      width: '500px',
      data: {
        accountId: this.selectedAccount.accountId,
        agentId: this.currentAgentId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadAccountTransactions(this.selectedAccount!.accountId!);
        this.showSuccess('Standing order created successfully');
      }
    });
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}