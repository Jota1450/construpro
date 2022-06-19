import { User } from './user';

export interface Project {
  id?: string;
  name: string;
  contractNumber: string;
  NIT: string;
  address: string;
  initialDate: string;
  finalDate: string;
  party: User[];
  createdAt: string;
}
