'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Recipe } from '@/lib/types';
import { useToast } from './use-toast';

const FAVORITES_KEY = 'photoRecipeFavorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(FAVORITES_KEY);
      setFavorites(item ? JSON.parse(item) : []);
    } catch (error) {
      console.error('Failed to parse favorites from localStorage', error);
      setFavorites([]);
    }
  }, []);

  const updateLocalStorage = (updatedFavorites: Recipe[]) => {
    try {
      window.localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      console.error('Failed to save favorites to localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Storage Error',
        description: 'Could not save your favorites. Your browser storage might be full.',
      });
    }
  };

  const addFavorite = useCallback(
    (recipe: Recipe) => {
      setFavorites((prev) => {
        const newFavorites = [...prev, recipe];
        updateLocalStorage(newFavorites);
        return newFavorites;
      });
      toast({
        title: "Added to Favorites!",
        description: `Recipe "${recipe.recipeName}" saved.`,
      });
    },
    [toast]
  );

  const removeFavorite = useCallback(
    (recipeId: string) => {
      let recipeName = '';
      setFavorites((prev) => {
        const recipeToRemove = prev.find(r => r.id === recipeId);
        if (recipeToRemove) {
          recipeName = recipeToRemove.recipeName;
        }
        const newFavorites = prev.filter((r) => r.id !== recipeId);
        updateLocalStorage(newFavorites);
        return newFavorites;
      });
      if(recipeName) {
        toast({
            title: "Removed from Favorites",
            description: `Recipe "${recipeName}" removed.`,
        });
      }
    },
    [toast]
  );

  const isFavorite = useCallback(
    (recipeId: string) => {
      return favorites.some((r) => r.id === recipeId);
    },
    [favorites]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
