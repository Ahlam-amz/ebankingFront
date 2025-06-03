import { Enrollement } from './enrollement.model';
export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  maleFemaleRatio: { male: number; female: number };
  recentEnrollments: Enrollement[];
  accountsByType: { type: string; count: number }[];
}