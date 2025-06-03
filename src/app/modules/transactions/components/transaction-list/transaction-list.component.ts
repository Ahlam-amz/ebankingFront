import { Component, inject, Input } from '@angular/core';
import { Transaction,TransactionType } from '../../../../shared/models/transaction.model';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { TransactionDetailsComponent } from '../transaction-details/transaction-details.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TransactionService } from '../../../../core/api/transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  standalone: true,
  imports: [MatTableModule,
     MatIconModule, MatProgressSpinnerModule, DatePipe, MatTooltipModule,CommonModule,
     MatMenuModule ]
})
export class TransactionListComponent {
  @Input() transactions: Transaction[] = [];
  @Input() isLoading: boolean = false;

  transactionService= inject(TransactionService);


  displayedColumns: string[] = ['type', 'amount', 'reference','account','targetAccount', 'timestamp', 'actions'];
  transactionTypeIcons: Record<TransactionType, string> = {
    DEPOSIT: 'arrow_downward',
    WITHDRAWAL: 'arrow_upward',
    TRANSFER: 'swap_horiz',
    STANDING_ORDER: 'schedule',
    REVERSAL: 'undo'
  };


  constructor(private dialog: MatDialog,
    private router: Router,
  private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.transactionService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load transactions', err);
        this.isLoading = false;
      }
    });
  }

viewDetails(transactionId: string) {
  this.router.navigate(['/transactions', transactionId]);
}

openNewTransaction() {
  this.router.navigate(['/transactions/new']);
}


openStandingOrder() {
  this.router.navigate(['/transactions/standing-order']);
}



  getTransactionColor(type: TransactionType): string {
    return type === 'DEPOSIT' ? 'primary' : 
           type === 'WITHDRAWAL' ? 'warn' : 
           type === 'REVERSAL' ? 'accent' : '';
  }

  getIcon(type: TransactionType): string {
  const icons = {
    DEPOSIT: 'arrow_downward',
    WITHDRAWAL: 'arrow_upward',
    TRANSFER: 'swap_horiz',
    STANDING_ORDER: 'schedule',
    REVERSAL: 'undo'
  };
  return icons[type] || 'help';
}

getColor(type: TransactionType): string {
  return type === 'REVERSAL' ? 'warn' : 'primary';
}













exportToCSV(): void {
  if (this.transactions.length === 0) {
    this.snackBar.open('No transactions to export', 'Close', { duration: 3000 });
    return;
  }

  // Prepare CSV content
  const headers = [
    'Reference',
    'Type',
    'Amount',
    'Account',
    'Target Account',
    'Date',
    'Description'
  ];

  const rows = this.transactions.map(tx => ([
    `"${tx.reference}"`,
    tx.type,
    tx.amount,
    tx.account.id,
    tx.targetAccount?.id || '',
    tx.timestamp ? new Date(tx.timestamp).toISOString() : '',
    `"${tx.description || ''}"`
  ]));

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `transactions_${new Date().toISOString().slice(0,10)}.csv`);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  this.snackBar.open('Export started', 'Close', { duration: 2000 });
}







}