import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import UserModel from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        status: true,
        message: 'Not Authenticated'
      },
      { status: 401 }
    );
  }

  const userId = user?._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          status: false,
          message: 'Failed to update user status to accept messages'
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        status: true,
        message: 'Message acceptance status updated successfully',
        updatedUser
      },
      { status: 200 }
    );
  } catch (err) {
    console.log('err: ', err);
    return Response.json(
      {
        status: false,
        message: 'Failed to update user status to accept messages'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        status: true,
        message: 'Not Authenticated'
      },
      { status: 401 }
    );
  }

  const userId = user?._id;

  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          status: false,
          message: 'User not found! :('
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      isAcceptingMessage: foundUser.isAcceptingMessage
    });
  } catch (error) {
    console.log('error: ', error);
    return Response.json(
      {
        status: false,
        message: 'Error in getting message acceptance status'
      },
      { status: 500 }
    );
  }
}
