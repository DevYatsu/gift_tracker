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
          <NextUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="light">
              {children}
            </NextThemesProvider>
          </NextUIProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
}
