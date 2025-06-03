import { Role } from './role.model';
import { Agency } from './agency.model';

export interface User {
  id?: number;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: Role;
  agency?: Agency;
  active: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
