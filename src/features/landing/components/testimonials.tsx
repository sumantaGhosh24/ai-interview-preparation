import { testimonials } from "@/constants/landing";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Testimonials = () => {
  return (
    <section className="border-t py-24">
      <div className="mx-auto container px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Success Stories
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-5xl">
            Trusted by learners preparing for real interviews
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} className="rounded-3xl p-8">
              <CardHeader className="p-0">
                <CardTitle className="leading-7">“{item.feedback}”</CardTitle>
                <CardDescription className="mt-6 font-semibold">{item.name}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
