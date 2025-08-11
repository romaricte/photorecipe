'use server';

/**
 * @fileOverview Detects ingredients from a photo using AI.
 *
 * - detectIngredients - A function that handles the ingredient detection process.
 * - DetectIngredientsInput - The input type for the detectIngredients function.
 * - DetectIngredientsOutput - The return type for the detectIngredients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectIngredientsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of food, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type DetectIngredientsInput = z.infer<typeof DetectIngredientsInputSchema>;

const DetectIngredientsOutputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of ingredients detected in the photo.'),
});
export type DetectIngredientsOutput = z.infer<typeof DetectIngredientsOutputSchema>;

export async function detectIngredients(input: DetectIngredientsInput): Promise<DetectIngredientsOutput> {
  return detectIngredientsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectIngredientsPrompt',
  input: {schema: DetectIngredientsInputSchema},
  output: {schema: DetectIngredientsOutputSchema},
  prompt: `Vous êtes une IA qui détecte les ingrédients sur une photo de nourriture.

  Analysez la photo et identifiez les ingrédients présents. Retournez une liste d'ingrédients.

  Photo: {{media url=photoDataUri}}
  Ingrédients: `,
});

const detectIngredientsFlow = ai.defineFlow(
  {
    name: 'detectIngredientsFlow',
    inputSchema: DetectIngredientsInputSchema,
    outputSchema: DetectIngredientsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
