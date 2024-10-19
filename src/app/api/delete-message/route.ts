import dbConnect from '@/lib/dbConnect';
import { getServerSession, User } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '../auth/[...nextauth]/options';
import UserModel from '@/models/User';

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
  const messageId = params.messageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        status: false,
        message: 'Not Authenticated'
      },
      { status: 401 }
    );
  }

  try {
    const updateUser = await UserModel.updateOne(
      { _id: user?._id },
      { $pull: { message: { _id: messageId } } }
    );

    if (updateUser.modifiedCount == 0) {
      return Response.json(
        {
          status: false,
          message: 'Message not found or already deleted!'
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        status: true,
        message: 'Message deleted successfully!'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('error: ', error);
    return Response.json(
      {
        status: false,
        message: 'Error deleting message'
      },
      { status: 500 }
    );
  }
}
