import Link from 'next/link';
import { ChefHat, Heart } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary-foreground">
            PhotoRecipe
          </h1>
        </Link>
        <nav>
          <Button asChild variant="ghost">
            <Link href="/favorites" className="flex items-center gap-2" aria-label="View Favorites">
              <Heart className="h-5 w-5" />
              <span className="hidden sm:inline">Favorites</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
