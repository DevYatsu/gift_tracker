import { Inter } from "next/font/google";
import "../globals.css";
import Providers from "@/components/Providers";
import { getAuth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

const description = "The Gift Tracker Home Page. Where everything takes place!";
const title = "Gift Tracker | Home";

export const metadata = {
  title,
  description,
  creator: "Yastu",
  authors: [{ name: "DevYatsu" }],
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    description,
    title,
    robots: "index, follow",
    siteName: "Gift Tracker",
  },
  locale: "en_US",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authSession = await getAuth();

  return (
    <html lang="en" className="h-full w-full">
      <body
        className={`${inter.className} h-full w-full flex justify-center items-center`}
      >
        <Providers authSession={authSession}>{children}</Providers>
      </body>
    </html>
  );
}
