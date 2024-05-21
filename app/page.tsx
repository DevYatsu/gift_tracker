"use client";

import NavBar from "@/components/NavBar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <NavBar />
      <div className="flex justify-center items-center">Hello World!</div>
    </>
  );
}
