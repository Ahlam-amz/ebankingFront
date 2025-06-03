
export interface Enrollement {
  id?: number;
  client: { id: number };
  agent: { id: number };
  dateEnrollement?: Date;
  reference?: string;
  statut: string;
  documents?: string[];
}