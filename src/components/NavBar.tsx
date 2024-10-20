'use client';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

export default function NavBar({ username }: { username: string }) {
  return (
    <header className="bg-primary text-background shadow z-90 relative">
      <nav className={cn('container mx-auto flex items-center justify-between p-6 lg:px-8')}>
        <div className="font-bold text-2xl">Honest hub</div>
        <div>{/* <Input className=".dark" /> */}</div>
        <div className="font-light text-lg">{`Welcome ${username || 'NA'}`}</div>
      </nav>
    </header>
  );
}
