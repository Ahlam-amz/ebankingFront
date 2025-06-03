export interface Currency {
  id?: number;
  code: string;
  name: string;
  exchangeRate: number;
  active: boolean;
  conversionFee?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
