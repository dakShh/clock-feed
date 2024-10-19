'use client';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

export default function NavBar({ username }: { username: string }) {
  return (
    <header className="bg-secondary shadow z-90 relative">
      <nav className={cn('container mx-auto flex items-center justify-between p-6 lg:px-8')}>
        <div>Honest hub</div>
        <div>
          <Input className=".dark" />
        </div>
        <div>{`Welcome, ${username || 'NA'}`}</div>
      </nav>
    </header>
  );
}
