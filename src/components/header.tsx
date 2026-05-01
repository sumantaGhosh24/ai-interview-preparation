"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { MenuIcon, XIcon } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import ModeToggle from "@/components/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

import { Skeleton } from "./ui/skeleton";
import { SidebarTrigger } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [hasAdminPermission, setHasAdminPermission] = useState(false);

  const router = useRouter();

  const { data: session, isPending: loading } = authClient.useSession();

  useEffect(() => {
    authClient.admin.hasPermission({ permissions: { category: ["create"] } }).then(({ data }) => {
      setHasAdminPermission(data?.success ?? false);
    });
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("You logged out successfully!");

          router.push("/login");
        },
      },
    });
  };

  if (loading) {
    return <Skeleton className="w-full h-20" />;
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto container md:flex items-center justify-between px-6 py-4 md:px-8">
        <div className="flex items-center justify-between md:block">
          <Button variant="outline" asChild className="h-9 px-4 ml-4">
            <SidebarTrigger />
          </Button>
          <div className="md:hidden">
            <Button className="rounded-md p-2 outline-none" onClick={() => setOpen(!open)}>
              {open ? <XIcon color="white" /> : <MenuIcon color="white" />}
            </Button>
          </div>
        </div>
        <div
          className={`mt-8 flex-1 justify-end pb-3 md:mt-0 md:block md:pb-0 ${open ? "block" : "hidden"}`}
        >
          <NavigationMenu className={open ? "mx-auto" : "ml-auto"}>
            <NavigationMenuList className="flex-col items-center gap-4 md:flex-row">
              {session !== null && (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle({
                        className: "hover:bg-transparent",
                      })}
                    >
                      <Link href="/profile">Profile</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  {hasAdminPermission && (
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle({
                          className: "hover:bg-transparent",
                        })}
                      >
                        <Link href="/users">Users</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}
                  <Button
                    variant="secondary"
                    className={navigationMenuTriggerStyle({
                      className: "hover:bg-transparent bg-transparent",
                    })}
                    onClick={handleSignOut}
                  >
                    Logout
                  </Button>
                  <Avatar size="lg">
                    <AvatarImage src={session?.user?.image as string} />
                    <AvatarFallback>{session?.user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <ModeToggle />
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
