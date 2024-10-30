'use client';
import { cn } from '@/lib/utils';
// import { Input } from './ui/input';
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { Settings } from 'lucide-react';
export default function NavBar() {
  const { data } = useSession();
  const user: User = data?.user as User;
  const router = useRouter();
  return (
    <header className="bg-primary text-background shadow z-90 relative">
      <nav className={cn('container mx-auto flex items-center justify-between p-6 lg:px-8')}>
        <div className="font-bold text-2xl">Honest hub</div>
        <div>{/* <Input className=".dark" /> */}</div>
        <div className="gap-x-3 flex items-center font-light text-lg">
          {/* <div>{`Welcome ${user?.username || 'NA'}`}</div> */}
          {data && data?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="p-0 shadow-none ">
                  <Settings size={22} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 right-[100] ">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-zinc-400">{user?.email}</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    signOut();
                  }}
                  className="hover:bg-primary cursor-pointer focus:bg-primary/70"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant={'secondary'} onClick={() => router.replace('/sign-up')}>
              Login
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
