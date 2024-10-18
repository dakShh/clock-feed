import { resend } from '@/lib/resend';
import { ApiResponse } from '@/types/ApiResponse';

import VerificationEmail from '../../emails/VerificationEmail';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Cloak Feed | Verification Code',
      react: VerificationEmail({ username, verificationCode })
    });

    return {
      success: true,
      message: 'Verification email sent successfully!'
    };
  } catch (error) {
    console.error('Error sending verification code: ', error);
    return {
      success: false,
      message: 'Failed to send email verification code'
    };
  }
}
