import { z } from 'zod';

export const signInSchema = z.object({
  identifier: z.string().min(1, { message: 'Email or Username required :(' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, { message: 'You must enter a password' })
    .min(4, { message: 'Passowrd is too short' })
});
