"use client";

import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function LogInButton({ pathname }: { pathname?: string }) {
  return (
    <Button
      as={Link}
      color="primary"
      href="/login"
      variant={pathname === "/login" ? "ghost" : "flat"}
      aria-current={pathname === "/login" ? "page" : "false"}
    >
      Log In
    </Button>
  );
}
