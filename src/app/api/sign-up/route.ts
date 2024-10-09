import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';

import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import { signupSchema } from '@/schemas/signUpSchema';
import { z } from 'zod';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();

        const validationResult = signupSchema.safeParse(body);
        console.log('validationResult: ', validationResult.error?.message);

        const { username, email, password } = body;

        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: 'Username already taken. :(',
                },
                { status: 400 }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: 'User already exist with this email',
                    },
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifyCodeExpiry = new Date();
            verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry,
                message: [],
            });
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'User registered successfully, please verify your email',
            },
            { status: 201 }
        );
    } catch (error) {
        // if (error instanceof z.ZodError) {
        //     const errors = error.errors.map((err) => ({
        //         field: err.path[0],
        //         message: err.message,
        //     }));
        //     return new Response(JSON.stringify({ errors }), { status: 400 });
        // }

        return Response.json(
            {
                success: false,
                message: 'Error registering user',
                error: error,
            },
            { status: 500 }
        );
    }
}
