export interface AuditLog {
  id?: number;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  performedBy: string;
  timestamp: Date;
}
