export interface Note {
  id?: string;
  date: Date;
  body: string;
  projectId: string;
  inspectorId: string;

  dateIsoString: string;
  signatureBase64?: string;
  signatureImageUrl?: string;
  signatureUser?: string;
  signatureDate?: string;

  createdAt: string;

  imageUrls?: any[];
}
