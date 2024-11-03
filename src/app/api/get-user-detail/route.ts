import UserModel from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const queryParam = {
      username: searchParams.get('username'),
      isVerified: true
    };

    const existingUser = await UserModel.findOne(queryParam, { email: 1, isAcceptingMessage: 1 });
    if (!existingUser) {
      return Response.json(
        {
          success: false,
          message: 'User not found! :('
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        userDetails: existingUser
      },
      { status: 200 }
    );
  } catch (error) {
    console.log('error: ', error);
    return Response.json(
      {
        success: false,
        message: 'Error checking username'
      },
      { status: 500 }
    );
  }
}
