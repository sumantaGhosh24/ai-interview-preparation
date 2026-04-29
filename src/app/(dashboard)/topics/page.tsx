import {requireAuth} from "@/lib/auth-utils";

export const metadata = {
  title: "Topics",
};

const TopicsPage = async () => {
  await requireAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Topics</h1>
      <p className="text-muted-foreground">Manage your learning topics.</p>
    </div>
  );
};

export default TopicsPage;
