import { Message } from '@/models/User';
import { User } from 'next-auth';

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  messages?: Array<Message>;
  userDetails?: User;
}
