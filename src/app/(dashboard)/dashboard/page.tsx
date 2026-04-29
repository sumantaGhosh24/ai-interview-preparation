import {requireAuth} from "@/lib/auth-utils";

export const metadata = {
  title: "Dashboard",
};

const DashboardPage = async () => {
  await requireAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Your learning progress overview.</p>
    </div>
  );
};

export default DashboardPage;
