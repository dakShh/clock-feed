import UserModel, { Message } from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, content, senderId } = await request.json();

        const existingUser = await UserModel.findOne({ username });

        if (!existingUser) {
            return Response.json({
                status: false,
                message: 'No user found! :(',
            });
        }

        if (!existingUser.isAcceptingMessage) {
            return Response.json({
                status: false,
                message: 'User is currently not accepting any messages! :(',
            });
        }

        const newMessage = {
            content,
            senderId,
            createAt: new Date(),
        };

        existingUser.message.push(newMessage as Message);
        await existingUser.save();

        return Response.json({
            status: true,
            message: 'Message sent successfully!',
        });
    } catch (error) {
        console.error('error: ', error);
        return Response.json(
            {
                status: false,
                message: 'Message could not be sent!',
            },
            { status: 500 }
        );
    }
}
