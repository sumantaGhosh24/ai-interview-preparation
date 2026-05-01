import { stats } from "@/constants/landing";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Stats = () => {
  return (
    <section className="py-16">
      <div className="mx-auto grid container gap-5 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-3xl border p-6">
            <CardHeader className="p-0">
              <CardTitle className="text-3xl font-bold text-blue-500">{stat.value}</CardTitle>
              <CardDescription className="mt-2">{stat.label}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Stats;
