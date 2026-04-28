import {headers} from "next/headers";

import {auth} from "@/lib/auth";
import {requireAuth} from "@/lib/auth-utils";

export const metadata = {
  title: "Dashboard",
};

const Dashboard = async () => {
  await requireAuth();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      <p>{JSON.stringify(session?.user, null, 2)}</p>
    </div>
  );
};

export default Dashboard;
