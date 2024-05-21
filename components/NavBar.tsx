"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogInButton from "./buttons/LogIn";
import LogOutButton from "./buttons/LogOut";

export default function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <Navbar isBordered>
      <NavbarBrand as={Link} href={"/"} className="text-foreground">
        <Image src="/icon.png" height="30" width="30" alt="Gift Tracker LOGO" />
        <p className="font-bold text-inherit pl-2">Gift Tracker</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname === "/"}>
          <Link
            color={pathname === "/" ? "primary" : "foreground"}
            href="/"
            aria-current={pathname === "/" ? "page" : "false"}
          >
            Gifts List (todo!)
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/item"}>
          <Link
            href="/item"
            color={pathname === "/item" ? "primary" : "foreground"}
            aria-current={pathname === "/item" ? "page" : "false"}
          >
            Item (todo!)
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {session ? (
          <>
            <NavbarItem isActive={pathname === "/settings"}>
              <Button
                as={Link}
                color={pathname === "/settings" ? "primary" : "secondary"}
                href="/settings"
                variant={pathname === "/settings" ? "bordered" : "flat"}
                aria-current={pathname === "/settings" ? "page" : "false"}
              >
                Settings
              </Button>
            </NavbarItem>
            <NavbarItem className="hidden sm:flex">
              <LogOutButton />
            </NavbarItem>
          </>
        ) : (
          <NavbarItem isActive={pathname === "/login"}>
            <LogInButton pathname={pathname} />
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
