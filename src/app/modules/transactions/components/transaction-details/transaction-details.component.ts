import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Transaction, TransactionType } from '../../../../shared/models/transaction.model';
import { TransactionService } from '../../../../core/api/transaction.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

// Angular Material imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    DatePipe
  ]
})
export class TransactionDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<TransactionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      transaction: Transaction;
      agentId: number;
    },
    private transactionService: TransactionService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  get transactionTypeLabel(): string {
    const labels: Record<TransactionType, string> = {
      DEPOSIT: 'Deposit',
      WITHDRAWAL: 'Withdrawal',
      TRANSFER: 'Transfer',
      STANDING_ORDER: 'Standing Order',
      REVERSAL: 'Reversal'
    };
    return labels[this.data.transaction.type];
  }

  

  reverseTransaction(): void {
    if (this.data.transaction.type === 'REVERSAL') {
      this.snackBar.open('Cannot reverse a reversal transaction', 'Close', { duration: 3000 });
      return;
    }

    this.transactionService.reverseTransaction(
      this.data.transaction.reference,
      this.data.agentId
    ).subscribe({
      next: () => {
        this.snackBar.open('Transaction reversed successfully', 'Close', { duration: 3000 });
        this.dialogRef.close('reversed');
      },
      error: (err) => {
        this.snackBar.open('Failed to reverse transaction', 'Close', { duration: 3000 });
      }
    });
  }

  printReceipt(): void {
    // In a real app, this would generate a printable receipt
    this.snackBar.open('Receipt printed', 'Close', { duration: 2000 });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getIcon(): string {
  const icons: Record<TransactionType, string> = {
    DEPOSIT: 'arrow_downward',
    WITHDRAWAL: 'arrow_upward',
    TRANSFER: 'swap_horiz',
    STANDING_ORDER: 'schedule',
    REVERSAL: 'undo'
  };
  return icons[this.data.transaction.type];
}

getIconColor(): string {
  return this.data.transaction.type === 'REVERSAL' ? 'warn' : 'primary';
}

getAmountClass(): string {
  return this.data.transaction.type === 'DEPOSIT' ? 'deposit-amount' : 
         this.data.transaction.type === 'WITHDRAWAL' ? 'withdrawal-amount' : '';
}

goBack() {
  this.router.navigate(['/transactions']);
}
}