"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Providers({
  children,
  authSession,
}: {
  children: React.ReactNode;
  authSession: Session | null;
}) {
  const [client] = useState(new QueryClient());

  return (
    <>
      <QueryClientProvider client={client}>
        <SessionProvider session={authSession}>
          <NextThemesProvider attribute="class" defaultTheme="light">
            <NextUIProvider className="min-h-screen h-full w-full">
              {children}
            </NextUIProvider>
          </NextThemesProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
}
