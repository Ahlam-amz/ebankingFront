import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TransactionType } from '../../../../shared/models/transaction.model';
@Component({
  selector: 'app-transaction-type-selector',
  templateUrl: './transaction-type-selector.component.html',
  styleUrls: ['./transaction-type-selector.component.scss'],
  standalone: true,
  imports: [
    MatIconModule
  ]
})
export class TransactionTypeSelectorComponent {
  constructor(private router: Router) {}

  selectType(type: TransactionType): void {
    this.router.navigate(['/transactions/new', type.toLowerCase()]);
  }

  
}