
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
      .map((q) => {
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-3xl bg-card/50 backdrop-blur-lg border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-5xl font-headline tracking-tight">Quick Vibe Check</CardTitle>
          <CardDescription className="text-xl text-muted-foreground mt-2">
            Help Nyxie get on your level.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-10 pt-6">
              {quizQuestions.map((q) => (
                <FormField
                  key={q.id}
                  control={form.control}
                  name={q.id as "q1" | "q2" | "q3"}
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div className="p-4 rounded-xl bg-black/20 border border-primary/30 backdrop-blur-sm shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02]">
                        <FormLabel className="text-2xl font-semibold text-center block">{q.question}</FormLabel>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-black/20 border border-primary/30 backdrop-blur-sm shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02]">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                          >
                            {q.options.map((opt) => (
                              <div key={opt.value}>
                                <RadioGroupItem value={opt.value} id={`${q.id}-${opt.value}`} className="sr-only peer" />
                                <label
                                  htmlFor={`${q.id}-${opt.value}`}
                                  className="flex text-center h-full items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all bg-card/80 border-transparent hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                                >
                                  <span className="font-medium text-base">{opt.label}</span>
                                </label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <FormMessage className="text-center pt-2" />
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} size="lg" className="w-full text-xl py-8 font-bold">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Find My Vibe"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
