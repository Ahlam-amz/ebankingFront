// src/app/modules/transactions/models/transaction.model.ts

export interface Transaction {
  id?: number;
  reference: string;
  type: TransactionType;
  amount: number;
  account: { id: number };  // Matches your backend Entity relationship
  agent?: { id: number };   // Optional agent reference
  timestamp?: string;       // ISO format
  description?: string;
  targetAccount?: { id: number };  // For transfers/standing orders
  nextExecutionDate?: string;      // For standing orders
  frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'STANDING_ORDER' | 'REVERSAL' ;