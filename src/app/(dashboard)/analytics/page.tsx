import {requireAuth} from "@/lib/auth-utils";

export const metadata = {
  title: "Analytics",
};

const AnalyticsPage = async () => {
  await requireAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <p className="text-muted-foreground">Track weak areas and performance.</p>
    </div>
  );
};

export default AnalyticsPage;
