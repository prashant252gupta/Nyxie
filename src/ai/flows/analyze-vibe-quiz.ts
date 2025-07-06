'use server';
/**
 * @fileOverview Analyzes the user's vibe quiz results to tailor the AI persona.
 *
 * - analyzeVibeQuiz - A function that analyzes the vibe quiz results.
 * - AnalyzeVibeQuizInput - The input type for the analyzeVibeQuiz function.
 * - AnalyzeVibeQuizOutput - The return type for the analyzeVibeQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVibeQuizInputSchema = z.object({
  quizResults: z
    .string()
    .describe('The results from the vibe quiz as a string.'),
});
export type AnalyzeVibeQuizInput = z.infer<typeof AnalyzeVibeQuizInputSchema>;

const AnalyzeVibeQuizOutputSchema = z.object({
  personalityInsights: z
    .string()
    .describe('Insights into the user personality based on the quiz results.'),
});
export type AnalyzeVibeQuizOutput = z.infer<typeof AnalyzeVibeQuizOutputSchema>;

export async function analyzeVibeQuiz(input: AnalyzeVibeQuizInput): Promise<AnalyzeVibeQuizOutput> {
  return analyzeVibeQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVibeQuizPrompt',
  input: {schema: AnalyzeVibeQuizInputSchema},
  output: {schema: AnalyzeVibeQuizOutputSchema},
  prompt: `Analyze the following vibe quiz results to understand the user's personality and preferences. Provide insights that can be used to tailor the AI persona to better align with the user.\n\nQuiz Results: {{{quizResults}}}`,
});

const analyzeVibeQuizFlow = ai.defineFlow(
  {
    name: 'analyzeVibeQuizFlow',
    inputSchema: AnalyzeVibeQuizInputSchema,
    outputSchema: AnalyzeVibeQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
