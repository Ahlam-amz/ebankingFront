export interface Agency {
  id?: number;
  code: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  openingTime: string;
  closingTime: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
