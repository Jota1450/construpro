import { User } from './user';

export interface Project {
  id?: string;
  name: string;
  contractNumber: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  NIT: string;
  address: string;
  initialDate: string;
  finalDate: string;
  party: User[];
  partyIds: string[];
  createdAt: string;
}
