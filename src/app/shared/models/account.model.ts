export interface Account {
  accountId?: number;
  accountNumber: string;
  accountType: string;
  balance: number;
  currencyCode: string;
  status?: string;
  creationDate?: Date;
  lastUpdated?: Date;
  interestRate?: number;
  overdraftLimit?: number;
  client: { id: number };
  branchId?: number;
}
