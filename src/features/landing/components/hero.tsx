import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Hero = () => {
  return (
    <section className="overflow-hidden border-b">
      <div className="mx-auto container px-6 py-24 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
              <Sparkles className="h-4 w-4" />
              AI-Powered Interview Preparation Platform
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Practice <span className="text-blue-500">Interviews</span> Like It’s the{" "}
              <span className="text-blue-500">Real One</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Build confidence with AI-generated questions, instant answer evaluation, learning path
              generator, and personalized improvement plans designed for DSA, React, System Design,
              and beyond.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="xl" asChild>
                <Link href="/login">Start Practicing</Link>
              </Button>
              <Button variant="outline" size="xl">
                <Link href="/login">View Demo</Link>
              </Button>
            </div>
          </div>
          <Card className="rounded-3xl border p-6 space-y-4">
            <CardHeader className="space-y-4 p-0">
              <CardDescription className="font-medium">Latest Evaluation</CardDescription>
              <CardTitle className="text-xl font-semibold">
                Explain React useEffect cleanup function
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-0">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border p-4">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-2xl font-bold text-blue-500">8.7 / 10</p>
                </div>
                <div className="rounded-2xl border p-4">
                  <p className="text-sm text-muted-foreground">Weak Area</p>
                  <p className="text-2xl font-bold text-blue-500">Lifecycle</p>
                </div>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-sm text-muted-foreground">AI Feedback</p>
                <p className="mt-2 text-sm leading-6">
                  Strong understanding of cleanup logic, but improve explanation around dependency
                  arrays and stale closures.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
