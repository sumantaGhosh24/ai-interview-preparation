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
  metadataBase: new URL("https://sumanta-ghosh.vercel.app"),
  description:
    "The ultimate platform for preparing for your next interview. With AI-powered tools and resources, you can confidently prepare for your next interview with ease.",

  keywords: [
    "Sumanta Ghosh",
    "Full-Stack Web Developer",
    "Next.js",
    "React",
    "AI",
    "Interview Platform",
  ],

  authors: [{name: "Sumanta Ghosh"}],
  creator: "Sumanta Ghosh",

  openGraph: {
    title: "AI Powered Interview Preparation Platform",
    description:
      "The ultimate platform for preparing for your next interview. With AI-powered tools and resources, you can confidently prepare for your next interview with ease.",
    url: "https://sumanta-ghosh.vercel.app",
    siteName: "AI Powered Interview Preparation Platform",
    type: "website",
    images: ["/opengraph-image"],
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Powered Interview Preparation Platform",
    description:
      "The ultimate platform for preparing for your next interview. With AI-powered tools and resources, you can confidently prepare for your next interview with ease.",
    images: ["/opengraph-image"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
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
