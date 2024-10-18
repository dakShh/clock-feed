import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: 'User not found! :('
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          status: true,
          message: 'Account verified successfully'
        },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          status: false,
          message: 'Invalid code! Please try again :/'
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          status: false,
          message: 'Code has been expired! Please sign-up again :)'
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('error: ', error);

    return Response.json(
      {
        success: false,
        message: 'Error verifying the account! :('
      },
      { status: 500 }
    );
  }
}
