import { workflows } from "@/constants/landing";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Workflow = () => {
  return (
    <section className="py-24">
      <div className="mx-auto container px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Workflow
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-5xl">From practice to improvement</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-5">
          {workflows.map((step, index) => (
            <Card key={step} className="rounded-3xl p-6 text-center">
              <CardHeader className="p-0">
                <CardDescription className="font-bold text-blue-500">
                  Step {index + 1}
                </CardDescription>
                <CardTitle className="mt-3 font-semibold">{step}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Workflow;
