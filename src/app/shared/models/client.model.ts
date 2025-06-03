export interface Client {
 id?: number;
  codeClient: string;
  nom: string;
  prenom: string;
  gender?: string;
  dateNaissance?: Date;
  adresse?: string;
  telephone: string;
  email?: string;
  profession: string;
  cin: string;
  dateEnregistrement?: Date;
  statut?: string;
  subscriptionDate?: Date;
  subscriptionStatus?: string;
  preferredLanguage?: string;
  receiveNewsletter?: boolean;
  receivePromotions?: boolean;
}