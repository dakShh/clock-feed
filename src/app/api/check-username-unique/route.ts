import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';

import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username'),
        };

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters',
                    error: 'validation error',
                },
                { status: 400 }
            );
        }

        const { username } = result.data;
        const existingUser = await UserModel.findOne({ username, isVerified: true });
        if (existingUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Username already taken. :(',
                },
                { status: 400 }
            );
        }

        return Response.json({
            success: true,
            message: 'Username is available. :)',
        });
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: 'Error checking username',
            },
            { status: 500 }
        );
    }
}
