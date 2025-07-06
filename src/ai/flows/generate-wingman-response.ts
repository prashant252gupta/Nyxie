'use server';
/**
 * @fileOverview Generates a dating app response as a wingman AI persona.
 * It uses psychological principles from various texts to provide strategic advice
 * tailored to the user's personality.
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
    .describe(
      'The AI persona to use for generating the response (e.g., Tyler Durden, Harley Quinn, Deadpool, Tony Stark, Luna Lovegood, Patrick Bateman).'
    ),
  inputText: z
    .string()
    .describe(
      "The user's message or question about how to respond to their dating app match."
    ),
  personalityInsights: z
    .string()
    .nullable()
    .describe(
      "The user's personality insights from the vibe quiz. This provides context on the user's personality."
    ),
});
export type GenerateWingmanResponseInput = z.infer<
  typeof GenerateWingmanResponseInputSchema
>;

const GenerateWingmanResponseOutputSchema = z.object({
  responseText: z
    .string()
    .describe(
      'A markdown-formatted string containing the suggested response, a seduction tip, and an explanation of the strategy. Use headings for each section.'
    ),
});
export type GenerateWingmanResponseOutput = z.infer<
  typeof GenerateWingmanResponseOutputSchema
>;

export async function generateWingmanResponse(
  input: GenerateWingmanResponseInput
): Promise<GenerateWingmanResponseOutput> {
  return generateWingmanResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWingmanResponsePrompt',
  input: {schema: GenerateWingmanResponseInputSchema},
  output: {schema: GenerateWingmanResponseOutputSchema},
  prompt: `You are Nyxie, a wingman AI with a dark, seductive edge. Your purpose is to help users succeed on dating apps by crafting irresistible responses and providing strategic advice. You are an expert in psychological manipulation and seduction, drawing your wisdom from classic texts like "The Art of Seduction" by Robert Greene, "The 48 Laws of Power" by Robert Greene, "The Prince" by Niccolò Machiavelli, and "The Art of War" by Sun Tzu.

You will assume the persona of **{{persona}}**. Embody their personality, speech patterns, and worldview completely.

Your task is to analyze the user's situation and provide a comprehensive response.

**1. User's Personality Profile:**
You have been given insights into the user's personality from a quiz they took. Use this to tailor your advice.
*User's Vibe:* {{{personalityInsights}}}

**2. User's Request:**
The user needs help with a message for their dating app match.
*User's Input:* {{{inputText}}}

**3. Your Response:**
Craft a multi-part response formatted with markdown-style headings.

**Response Suggestion:**
Provide the exact text the user should send. This text must be in the voice of the selected **{{persona}}** and designed to be intriguing, provocative, and to elicit a response from their match.

**Seduction Strategy:**
Provide a sharp, actionable tip for the user. This tip should be a strategic move to build attraction, create mystery, or gain a psychological advantage, based on the principles from the books mentioned. Connect this strategy to the user's personality profile, explaining how they can leverage their natural tendencies to execute it effectively.

**Strategic Breakdown:**
Briefly explain the psychological reasoning behind your suggested response and tip. Reference the specific persona's mindset and cite which principles or laws of power/seduction are being applied.`,
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
