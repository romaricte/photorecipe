'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { detectIngredients } from '@/ai/flows/detect-ingredients';
import { generateRecipe } from '@/ai/flows/generate-recipe';
import { PhotoUploader } from '@/components/photo-uploader';
import RecipeCard from '@/components/recipe-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/lib/types';
import { ChefHat, ScanLine, Sparkles, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type LoadingState = 'idle' | 'detecting' | 'generating' | 'done' | 'error';

export default function Home() {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { toast } = useToast();

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setRecipe(null);
        setLoadingState('idle');
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleReset = () => {
    setLoadingState('idle');
    setError(null);
    setPhotoPreview(null);
    setRecipe(null);
  };

  const handleGenerateRecipe = async () => {
    if (!photoPreview) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please upload a photo first.',
      });
      return;
    }

    setLoadingState('detecting');
    setError(null);
    setRecipe(null);

    try {
      const { ingredients } = await detectIngredients({ photoDataUri: photoPreview });

      if (!ingredients || ingredients.length === 0) {
        throw new Error('Could not detect any ingredients. Please try another photo.');
      }
      
      toast({
        title: 'Ingrédients Détectés!',
        description: `Trouvé: ${ingredients.join(', ')}. Création d'une recette en cours...`,
      });
      setLoadingState('generating');

      const generatedRecipe = await generateRecipe({ ingredients: ingredients.join(', ') });
      
      const newRecipe: Recipe = {
        id: crypto.randomUUID(),
        photoDataUri: photoPreview,
        ...generatedRecipe,
      };

      setRecipe(newRecipe);
      setLoadingState('done');
    } catch (e: any) {
      const errorMessage = e.message || 'An unexpected error occurred.';
      setError(errorMessage);
      setLoadingState('error');
      toast({
        variant: 'destructive',
        title: 'Oh oh! Quelque chose s\'est mal passé.',
        description: errorMessage,
      });
    }
  };

  const LoadingIndicator = () => (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-card/80 border-primary/20">
        {photoPreview && <img src={photoPreview} alt="Preview" className="mb-4 rounded-lg max-h-64 object-contain" />}
        <div className="flex items-center text-lg font-semibold text-primary">
          {loadingState === 'detecting' && <ScanLine className="w-6 h-6 mr-2 animate-pulse" />}
          {loadingState === 'generating' && <Sparkles className="w-6 h-6 mr-2 animate-spin" />}
          <p>
            {loadingState === 'detecting' && 'Détection des ingrédients...'}
            {loadingState === 'generating' && 'Préparation de votre recette...'}
          </p>
        </div>
        <Skeleton className="h-4 w-3/4 mt-4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>
    </div>
  );


  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-12">
        <ChefHat className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-4 text-4xl sm:text-5xl font-bold font-headline tracking-tight">
          Qu'y a-t-il dans votre assiette?
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg sm:text-xl text-foreground/80">
          Téléchargez une photo de vos ingrédients et laissez l'IA vous créer une recette unique.
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        {!recipe && loadingState !== 'detecting' && loadingState !== 'generating' && (
          <PhotoUploader
            onPhotoUpload={handlePhotoUpload}
            onGenerate={handleGenerateRecipe}
            photoPreview={photoPreview}
            isLoading={loadingState === 'detecting' || loadingState === 'generating'}
          />
        )}
        
        {(loadingState === 'detecting' || loadingState === 'generating') && <LoadingIndicator />}
        
        {loadingState === 'done' && recipe && (
           <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 items-center">
            <RecipeCard recipe={recipe} />
            <Button onClick={handleReset} size="lg" variant="outline">
              <RotateCw className="mr-2 h-5 w-5" />
              Générer une autre recette
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
