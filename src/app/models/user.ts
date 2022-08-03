export interface User {
  id?: string;
  names: string;
  lastNames: string;
  email: string;
  password: string;
  canCreateProject: boolean;
  documentType: string;
  documentNumber: string;
  professionalCard: string;
  rol?: string;
  createdAt: string;
}
