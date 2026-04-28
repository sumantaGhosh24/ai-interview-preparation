import type {Metadata} from "next";
import {Geist, Geist_Mono, Inter} from "next/font/google";

import "./globals.css";

import {cn} from "@/lib/utils";
import {Toaster} from "@/components/ui/sonner";
import ThemeProvider from "@/components/theme-provider";
import {TRPCReactProvider} from "@/trpc/client";

const inter = Inter({subsets: ["latin"], variable: "--font-sans"});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | AI Powered Interview Preparation Platform",
    default: "AI Powered Interview Preparation Platform",
  },
  description: "AI Powered Interview Preparation Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          inter.variable,
          "min-h-screen bg-background text-foreground antialiased font-sans",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <main>{children}</main>
            <Toaster position="top-right" closeButton={true} />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
