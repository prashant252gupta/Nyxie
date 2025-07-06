import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nyxie",
  description: "Talk dirty, undress minds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("font-body antialiased")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
