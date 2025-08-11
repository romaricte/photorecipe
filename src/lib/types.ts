import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';

export interface Recipe extends GenerateRecipeOutput {
  id: string;
  photoDataUri: string;
}
