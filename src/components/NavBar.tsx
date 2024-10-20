'use client';
import { cn } from '@/lib/utils';
// import { Input } from './ui/input';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';

export default function NavBar() {
  const { data } = useSession();
  const user: User = data?.user as User;
  return (
    <header className="bg-primary text-background shadow z-90 relative">
      <nav className={cn('container mx-auto flex items-center justify-between p-6 lg:px-8')}>
        <div className="font-bold text-2xl">Honest hub</div>
        <div>{/* <Input className=".dark" /> */}</div>
        <div className="font-light text-lg">{`Welcome ${user?.username || 'NA'}`}</div>
      </nav>
    </header>
  );
}
