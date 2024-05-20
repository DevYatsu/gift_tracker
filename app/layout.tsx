import Head from "next/head";

export const metadata = {
  title: "Gift Tracker | Home",
  description: "The Gift Tracker Home Page. Where everything takes place!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        {/* <meta property="og:url" content="https://yourwebsite.com" /> */}
        {/* <meta
          property="og:image"
          content="https://yourwebsite.com/your-image.jpg"
        /> */}
        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta
          name="twitter:image"
          content="https://yourwebsite.com/your-image.jpg"
        /> */}
        {/* <link rel="canonical" href="https://yourwebsite.com" /> */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* <link rel="stylesheet" href="https://yourwebsite.com/styles.css" /> */}
      </Head>
      <body>{children}</body>
    </html>
  );
}
