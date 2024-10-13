import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import UserModel from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import mongoose from 'mongoose';

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                status: false,
                message: 'Not Authenticated',
            },
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(user?._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createAt': -1 } },
            {
                $group: {
                    _id: '$_id',
                    messages: {
                        $push: '$messages',
                    },
                },
            },
        ]);

        if (!user || user.length == 0) {
            return Response.json(
                {
                    status: false,
                    message: 'User not found',
                },
                { status: 401 }
            );
        }

        return Response.json({
            status: true,
            messages: user[0].messages,
        });
    } catch (error) {
        console.error('error: ', error);
    }
}
