'use client';

import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useFavorites } from '@/hooks/use-favorites';
import type { Recipe } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(recipe.id);

  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  const instructionsList = recipe.instructions
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.toLowerCase().startsWith('instructions:'))
    .map(line => line.replace(/^\d+\.\s*/, ''));

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-2xl animate-fade-in">
      <div className="grid md:grid-cols-2">
        <div className="relative h-64 md:h-full min-h-[300px]">
          <Image
            src={recipe.photoDataUri}
            alt={recipe.recipeName}
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
            data-ai-hint="food recipe"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        <div className="flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="font-headline text-3xl">{recipe.recipeName}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                className="rounded-full flex-shrink-0 text-accent hover:bg-accent/10"
                aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={cn("w-6 h-6 transition-all", favorite && "fill-accent text-accent")} />
              </Button>
            </div>
            <CardDescription className="pt-2 text-base italic">{recipe.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-6">
            <div>
              <h3 className="font-headline text-xl font-semibold mb-2">Instructions</h3>
              <ol className="list-decimal list-inside space-y-3 text-foreground/90">
                {instructionsList.map((step, index) => (
                  <li key={index} className="pl-2 leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
