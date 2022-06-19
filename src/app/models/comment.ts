import { User } from './user';
export interface Comment {
  id?: string;
  body: string;
  createdAt: string;
  user: User;
}
