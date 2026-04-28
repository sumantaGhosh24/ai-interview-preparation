import prisma from "@/lib/db";
import ModeToggle from "@/components/mode-toggle";

export const metadata = {
  title: "Home",
};

const Home = async () => {
  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>Home</h1>
      <ModeToggle />
      <p>{JSON.stringify(users)}</p>
    </div>
  );
};

export default Home;
