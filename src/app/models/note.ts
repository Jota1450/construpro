import { User } from './user';
export interface Note {
  id?: string;
  date: Date;
  body: string;
  projectId: string;
  inspectorId: string;

  dateIsoString: string;
  signatureBase64?: string;
  signatureImageUrl?: string;
  signatureUser?: User;
  signatureDate?: string;
  isSigned: boolean;

  createdAt: string;

  imageUrls?: any[];
}
