import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

const NotFound = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="bg-background w-[80%] h-125 rounded-md shadow-md flex flex-col items-center justify-center gap-5 dark:shadow-white/40">
        <Empty>
          <EmptyHeader>
            <EmptyTitle className="text-2xl font-bold">404 - Not Found</EmptyTitle>
            <EmptyDescription className="text-lg">
              The page you&apos;re looking for doesn&apos;t exist. Back to home page.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
};

export default NotFound;
