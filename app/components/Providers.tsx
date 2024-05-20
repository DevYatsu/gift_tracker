"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const [client] = useState(new QueryClient());

  return (
    <>
      <QueryClientProvider client={client}>
        <SessionProvider session={session}>
          <NextUIProvider>{children}</NextUIProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
}
