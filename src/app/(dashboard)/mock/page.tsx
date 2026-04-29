import {requireAuth} from "@/lib/auth-utils";

export const metadata = {
  title: "Mock",
};

const MockPage = async () => {
  await requireAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Mock Interview</h1>
      <p className="text-muted-foreground">Practice real interview rounds.</p>
    </div>
  );
};

export default MockPage;
