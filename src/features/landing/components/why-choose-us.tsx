import { points } from "@/constants/landing";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const WhyChooseUs = () => {
  return (
    <section className="border-y bg-muted/30 py-24">
      <div className="mx-auto container px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Why This Platform
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-5xl">
              Built like a real learning system, not just another practice app
            </h2>
            <p className="mt-6 leading-8 text-muted-foreground">
              Instead of random question lists, this platform uses performance tracking, structured
              AI feedback, and adaptive learning paths to help users improve systematically and
              prepare with confidence.
            </p>
          </div>
          <div className="space-y-4">
            {points.map((point) => (
              <Card key={point} className="rounded-2xl p-5">
                <CardHeader className="p-0">
                  <CardTitle className="font-medium">{point}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
