import NavBar from "@/components/NavBar";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <div className="container pt-5">
        <div className="flex justify-center items-center">{children}</div>
      </div>
    </>
  );
}
