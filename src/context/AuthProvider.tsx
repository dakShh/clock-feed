'use client';

import { SessionProvider } from 'next-auth/react';

interface IAuthProvider {
    children: React.ReactNode;
}

export default function AuthProvider({ children }: IAuthProvider) {
    return <SessionProvider>{children}</SessionProvider>;
}
