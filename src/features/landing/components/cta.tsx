import Link from "next/link";

import {Button} from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="border-t py-24">
      <div className="mx-auto container px-6 text-center lg:px-8">
        <h2 className="text-3xl font-bold sm:text-5xl">
          Ready to crack your next interview?
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          Practice smarter, identify weaknesses faster, and prepare with
          confidence using AI-powered feedback.
        </p>
        <Button size="xl" asChild className="mt-10">
          <Link href="/login">Get Started Free</Link>
        </Button>
      </div>
    </section>
  );
};

export default CTA;
