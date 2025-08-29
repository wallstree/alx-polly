'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { useAuth } from '../context/auth-context';

export function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Polling App
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link 
              href="/polls" 
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith('/polls') ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Polls
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden md:inline-block">
                {user.name}
              </span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}