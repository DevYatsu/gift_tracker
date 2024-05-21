import NavBar from "@/components/NavBar";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <div className="w-full h-full flex justify-center">
        <div className="container">{children}</div>
      </div>
    </>
  );
}
