"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeVibeQuiz } from "@/ai/flows/analyze-vibe-quiz";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const quizQuestions = [
  {
    id: "q1",
    question: "Your ideal night out is:",
    options: [
      { value: "A", label: "A wild party where anything can happen." },
      { value: "B", label: "A quiet night with deep, meaningful conversations." },
      { value: "C", label: "Something spontaneous and unpredictable." },
    ],
  },
  {
    id: "q2",
    question: "Your humor is best described as:",
    options: [
      { value: "A", label: "Dark, sarcastic, and a bit twisted." },
      { value: "B", label: "Witty, clever, and full of wordplay." },
      { value: "C", label: "Goofy, playful, and wonderfully absurd." },
    ],
  },
  {
    id: "q3",
    question: "In a conversation, you're more likely to:",
    options: [
      { value: "A", label: "Take the lead and be provocative." },
      { value: "B", label: "Listen intently and offer thoughtful replies." },
      { value: "C", label: "Crack jokes and keep things lighthearted." },
    ],
  },
];

const FormSchema = z.object({
  q1: z.string({ required_error: "Please select an option." }),
  q2: z.string({ required_error: "Please select an option." }),
  q3: z.string({ required_error: "Please select an option." }),
});

type VibeQuizProps = {
  onComplete: (insights: string) => void;
};

export default function VibeQuiz({ onComplete }: VibeQuizProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const quizResults = quizQuestions
      .map((q, i) => {
        const answer = q.options.find((opt) => opt.value === data[q.id as keyof typeof data]);
        return `${q.question} ${answer?.label}`;
      })
      .join("\n");

    try {
      const result = await analyzeVibeQuiz({ quizResults });
      onComplete(result.personalityInsights);
    } catch (error) {
      console.error("Error analyzing vibe quiz:", error);
      // Even if AI fails, proceed to the app. The insights are a progressive enhancement.
      onComplete("Could not analyze personality, but you can still use the app!");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Quick Vibe Check</CardTitle>
          <CardDescription>
            Help us understand your style. This helps Nyxie get on your level.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              {quizQuestions.map((q) => (
                <FormField
                  key={q.id}
                  control={form.control}
                  name={q.id as "q1" | "q2" | "q3"}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-lg font-semibold">{q.question}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          {q.options.map((opt) => (
                            <FormItem key={opt.value} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={opt.value} />
                              </FormControl>
                              <FormLabel className="font-normal">{opt.label}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Let's Go"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
