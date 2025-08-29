import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Polling App. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline hover:text-foreground">
            Home
          </Link>
          <Link href="/polls" className="hover:underline hover:text-foreground">
            Polls
          </Link>
          <Link href="/auth/login" className="hover:underline hover:text-foreground">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}