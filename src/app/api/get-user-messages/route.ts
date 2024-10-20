import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import UserModel from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('userId') as string;
  const userId = new mongoose.Types.ObjectId(id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: '$message', preserveNullAndEmptyArrays: true } },
      { $sort: { 'message.createAt': -1 } },
      {
        $group: {
          _id: '$_id',
          messages: {
            $push: '$message'
          }
        }
      }
    ]);
    console.log('user------------------------------------');
    console.log(user);

    if (!user || user.length == 0) {
      return Response.json(
        {
          status: false,
          message: 'User not found'
        },
        { status: 401 }
      );
    }

    return Response.json({
      status: true,
      messages: user[0].messages
    });
  } catch (error) {
    console.error('error: ', error);
    return Response.json(
      {
        status: false,
        message: 'Unexpected error occured'
      },
      { status: 401 }
    );
  }
}
