"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { generateWingmanResponse } from "@/ai/flows/generate-wingman-response";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TylerDurdenIcon,
  HarleyQuinnIcon,
  DeadpoolIcon,
  TonyStarkIcon,
  LunaLovegoodIcon,
  PatrickBatemanIcon,
} from "@/components/icons";
import { SendHorizonal, Bot } from "lucide-react";

const personas = [
  {
    id: "Tyler Durden",
    name: "Tyler Durden",
    description: "Anarchic and charismatic. His style is provocative and challenges social norms.",
    icon: TylerDurdenIcon,
  },
  {
    id: "Harley Quinn",
    name: "Harley Quinn",
    description: "Unpredictably charming and chaotic. Expect witty, bold, and unhinged banter.",
    icon: HarleyQuinnIcon,
  },
  {
    id: "Deadpool",
    name: "Deadpool",
    description: "Sarcastic and hilariously inappropriate. Nothing is off-limits.",
    icon: DeadpoolIcon,
  },
  {
    id: "Tony Stark",
    name: "Tony Stark",
    description: "Brilliant, billionaire, playboy, philanthropist. Witty, confident, and a bit arrogant.",
    icon: TonyStarkIcon,
  },
  {
    id: "Luna Lovegood",
    name: "Luna Lovegood",
    description: "Dreamy and ethereal. Responses are quirky, insightful, and uniquely perceptive.",
    icon: LunaLovegoodIcon,
  },
  {
    id: "Patrick Bateman",
    name: "Patrick Bateman",
    description: "Meticulous and materialistic. Obsessed with status, appearance, and Huey Lewis and the News.",
    icon: PatrickBatemanIcon,
  },
];

type Message = {
  id: number;
  sender: "user" | "nyxie";
  text: string;
};

const chatFormSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

type ChatFormValues = z.infer<typeof chatFormSchema>;

export default function MainApp({ personalityInsights }: { personalityInsights: string | null }) {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: { message: "" },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSubmit = async (data: ChatFormValues) => {
    if (!selectedPersona) {
      form.setError("message", { type: "manual", message: "Please select a persona first." });
      return;
    }

    const newUserMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: data.message,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    form.reset();
    setIsTyping(true);

    try {
      const response = await generateWingmanResponse({
        persona: selectedPersona,
        inputText: data.message,
      });

      const newNyxieMessage: Message = {
        id: Date.now() + 1,
        sender: "nyxie",
        text: response.responseText,
      };
      setMessages((prev) => [...prev, newNyxieMessage]);
    } catch (error) {
      const errorNyxieMessage: Message = {
        id: Date.now() + 1,
        sender: "nyxie",
        text: "Sorry, I'm having a bit of trouble thinking right now. Try again in a moment.",
      };
      setMessages((prev) => [...prev, errorNyxieMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-screen max-h-screen">
      <header className="text-center py-6">
        <h1 className="font-headline text-5xl font-bold text-primary">Nyxie</h1>
        <p className="font-body text-muted-foreground mt-1">Talk dirty, undress minds.</p>
      </header>
      
      {!selectedPersona && (
         <section id="persona-selection" className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6 font-headline">Choose your Wingman</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {personas.map((persona) => (
                <Card
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona.id)}
                  className={cn(
                    "cursor-pointer hover:shadow-lg transition-shadow duration-300",
                    selectedPersona === persona.id && "ring-2 ring-primary"
                  )}
                >
                  <CardHeader className="items-center text-center">
                    <persona.icon className="w-24 h-24 mb-4 text-primary" />
                    <CardTitle className="font-headline">{persona.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">{persona.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
      )}

      {selectedPersona && (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold font-headline">Chatting as {selectedPersona}</h2>
                <Button variant="outline" onClick={() => { setSelectedPersona(null); setMessages([]); }}>Change Persona</Button>
            </div>
          <div className="flex-1 flex flex-col bg-card rounded-lg border overflow-hidden">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'user' ? "justify-end" : "justify-start")}>
                    {msg.sender === 'nyxie' && <Bot className="w-8 h-8 text-primary self-start shrink-0" />}
                    <div className={cn("rounded-lg px-4 py-2 max-w-[80%]", msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                 {isTyping && (
                    <div className="flex items-end gap-2 justify-start">
                        <Bot className="w-8 h-8 text-primary self-start shrink-0" />
                        <div className="bg-muted rounded-lg px-4 py-2">
                            <div className="flex items-center gap-1">
                                <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-primary rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-background">
              <form onSubmit={form.handleSubmit(handleSubmit)} className="flex items-start gap-4">
                <Textarea
                  placeholder="What's the situation?"
                  {...form.register("message")}
                  className="flex-1 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(handleSubmit)();
                    }
                  }}
                  rows={1}
                />
                <Button type="submit" size="icon" disabled={isTyping}>
                  <SendHorizonal className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
              {form.formState.errors.message && <p className="text-destructive text-sm mt-2">{form.formState.errors.message.message}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
