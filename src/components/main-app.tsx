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
        <h1 className="font-headline text-6xl font-bold bg-gradient-to-r from-primary via-pink-400 to-purple-500 bg-clip-text text-transparent animate-shine bg-[length:200%_auto]">Nyxie</h1>
        <p className="font-body text-muted-foreground mt-2 tracking-wider">Talk dirty, undress minds.</p>
      </header>
      
      {!selectedPersona && (
         <section id="persona-selection" className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-8 font-headline">Choose your Wingman</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personas.map((persona) => (
                <Card
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona.id)}
                  className={cn(
                    "cursor-pointer transition-all duration-300 relative group overflow-hidden rounded-2xl border",
                    "bg-neutral-950/50 backdrop-blur-md",
                    selectedPersona === persona.id
                      ? "border-primary/80 ring-2 ring-primary/50"
                      : "border-white/10 hover:border-white/20"
                  )}
                >
                  <div className={cn(
                      "absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 bg-primary/10 rounded-full blur-3xl transition-all duration-500",
                      "group-hover:scale-[2] group-hover:bg-primary/15",
                      selectedPersona === persona.id && "scale-[2.5] bg-primary/20"
                  )} />
                  <CardContent className="relative p-6 flex flex-col items-center text-center">
                    <persona.icon className="w-14 h-14 mb-3" />
                    <CardTitle className="font-headline text-lg">{persona.name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-1 min-h-[48px]">
                      {persona.description}
                    </CardDescription>
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
          <div className="flex-1 flex flex-col bg-card/30 rounded-lg border overflow-hidden backdrop-blur-sm">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'user' ? "justify-end" : "justify-start")}>
                    {msg.sender === 'nyxie' && <Bot className="w-8 h-8 text-primary self-start shrink-0" />}
                    <div className={cn("rounded-xl px-4 py-3 max-w-[80%] shadow-md", msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary text-secondary-foreground rounded-bl-none')}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                 {isTyping && (
                    <div className="flex items-end gap-2 justify-start">
                        <Bot className="w-8 h-8 text-primary self-start shrink-0" />
                        <div className="bg-secondary rounded-xl px-4 py-3 rounded-bl-none">
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
            <div className="p-4 border-t bg-background/80">
              <form onSubmit={form.handleSubmit(handleSubmit)} className="flex items-start gap-4">
                <Textarea
                  placeholder="What's the situation?"
                  {...form.register("message")}
                  className="flex-1 resize-none bg-secondary border-0 focus-visible:ring-2 focus-visible:ring-primary"
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
