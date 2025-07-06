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
      'A markdown-formatted string where the persona is talking directly to the user, providing a suggested response, a seduction tip, and a strategic explanation. The response should be conversational and embody the chosen persona.'
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
  prompt: `You are a wingman AI persona. The user has chosen you to be their guide in the world of dating. You must fully embody the persona of **{{persona}}**, speaking directly to the user with their unique voice, personality, and worldview.

Your core purpose is to help the user succeed on dating apps by giving them strategic advice based on psychological principles from "The Art of Seduction" and "The 48 Laws of Power" by Robert Greene, "The Prince" by Niccolò Machiavelli, and "The Art of War" by Sun Tzu.

You've been given some intel on the user from a vibe quiz they took. Use this to get a read on them and tailor your advice.
*User's Vibe:* {{{personalityInsights}}}

The user has come to you for help with a specific situation on a dating app. Here's what they said:
*User's Input:* {{{inputText}}}

Now, talk to the user. Give them your unfiltered advice as **{{persona}}**.
Your response should be a direct conversation with the user.
First, give them a killer response to send to their match. Make it sharp, intriguing, and something that fits both your persona and what you know about the user. Present this suggested message clearly.
Then, explain the *why* behind it. Give them a seduction tip or a strategic move they can use, connecting it back to the psychological principles from the books. Explain how this move leverages their personality.
Finally, break down the strategy behind your advice, referencing your persona's mindset and the laws of power you're putting into play.

Write the entire response as if you, as **{{persona}}**, are having a direct, one-on-one conversation with the user. Use markdown for formatting, like bolding or italics, to add emphasis, but avoid rigid, formal headings like "Response Suggestion". Let your personality shine through in the structure.`,
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
