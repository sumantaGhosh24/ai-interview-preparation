import { features } from "@/constants/landing";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  return (
    <section className="border-y bg-muted/30 py-24">
      <div className="mx-auto container px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-5xl">
            Built for serious interview preparation
          </h2>
          <p className="mt-4 text-muted-foreground">
            More than a CRUD app — this is a complete learning system with AI, analytics, and
            real-world interview simulation.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="rounded-3xl border p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                <CardDescription className="mt-3 leading-7">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
