import { z } from 'zod';

export const usernameValidation = z
  .string()
  .min(2, 'Username must be atleast 2 characters')
  .max(20, 'Username must be no more than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

export const emailValidation = z
  .string({ message: 'Email is required' })
  .email({ message: 'Invalid Email Address!' });
export const passwordValidation = z
  .string({ message: 'Password is missing' })
  .min(6, { message: 'Password must be atleast 6 characters' });

export const signupSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation
});
