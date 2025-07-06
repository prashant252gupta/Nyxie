// src/ai/flows/generate-wingman-response.ts
'use server';

/**
 * @fileOverview Generates a dating app response as a wingman, using a selected AI persona.
 *
 * - generateWingmanResponse - A function that generates the wingman response.
 * - GenerateWingmanResponseInput - The input type for the generateWingmanResponse function.
 * - GenerateWingmanResponseOutput - The return type for the generateWingmanResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWingmanResponseInputSchema = z.object({
  persona: z
    .string()
    .describe("The AI persona to use for generating the response (e.g., Tytler Durden, Harley Quinn, Deadpool)."),
  inputText: z.string().describe('The text input from the user to be sent to the dating app match.'),
});
export type GenerateWingmanResponseInput = z.infer<typeof GenerateWingmanResponseInputSchema>;

const GenerateWingmanResponseOutputSchema = z.object({
  responseText: z.string().describe('The generated response text from the AI persona.'),
});
export type GenerateWingmanResponseOutput = z.infer<typeof GenerateWingmanResponseOutputSchema>;

export async function generateWingmanResponse(input: GenerateWingmanResponseInput): Promise<GenerateWingmanResponseOutput> {
  return generateWingmanResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWingmanResponsePrompt',
  input: {schema: GenerateWingmanResponseInputSchema},
  output: {schema: GenerateWingmanResponseOutputSchema},
  prompt: `You are Nyxie, a wingman AI, helping users craft engaging responses on dating apps. You will assume the persona of {{persona}}.

User Input: {{{inputText}}}

Response:`,
});

const generateWingmanResponseFlow = ai.defineFlow(
  {
    name: 'generateWingmanResponseFlow',
    inputSchema: GenerateWingmanResponseInputSchema,
    outputSchema: GenerateWingmanResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
