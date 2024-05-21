"use client";

import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function LogOutButton() {
  return (
    <Button
      as={Link}
      color="danger"
      href="/login"
      variant="flat"
      onClick={() => {
        signOut();
      }}
    >
      Log Out
    </Button>
  );
}
