"use client";

import {useState} from "react";
import Link from "next/link";
import {MenuIcon, XIcon} from "lucide-react";

import {headerLinks} from "@/constants/landing";
import ModeToggle from "@/components/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {Button} from "@/components/ui/button";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto container md:flex items-center justify-between px-6 py-4 md:px-8">
        <div className="flex items-center justify-between py-3 md:block md:py-5">
          <h1 className="text-xl font-bold tracking-tight text-blue-500">
            <Link href="/">AI Interview Prep</Link>
          </h1>
          <div className="md:hidden">
            <Button
              className="rounded-md p-2 outline-none"
              onClick={() => setOpen(!open)}
            >
              {open ? <XIcon color="white" /> : <MenuIcon color="white" />}
            </Button>
          </div>
        </div>
        <div
          className={`mt-8 flex-1 justify-end pb-3 md:mt-0 md:block md:pb-0 ${open ? "block" : "hidden"}`}
        >
          <NavigationMenu className={open ? "mx-auto" : "ml-auto"}>
            <NavigationMenuList className="flex-col items-center gap-4 md:flex-row">
              {headerLinks.map((link, i) => (
                <NavigationMenuItem key={`${link.name}-${i}`}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle({
                      className: "hover:bg-transparent",
                    })}
                  >
                    <Link href={link.href}>{link.name}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
              <ModeToggle />
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
