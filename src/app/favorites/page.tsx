'use client';

import { Heart, ChefHat } from 'lucide-react';
import RecipeCard from '@/components/recipe-card';
import { useFavorites } from '@/hooks/use-favorites';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-8 w-8 text-accent fill-accent" />
        <h1 className="text-4xl font-bold font-headline">My Favorite Recipes</h1>
      </div>

      {favorites.length > 0 ? (
        <div className="grid gap-8 md:gap-12">
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center flex flex-col items-center justify-center min-h-[50vh] border-2 border-dashed rounded-lg bg-card/80 p-8">
            <ChefHat className="h-20 w-20 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-bold font-headline text-foreground">No Favorites Yet</h2>
          <p className="mt-2 text-muted-foreground">
            Looks like you haven't saved any recipes. Let's go find some!
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link href="/">Find a Recipe</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
