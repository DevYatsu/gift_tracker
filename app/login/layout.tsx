import NavBar from "@/components/NavBar";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" min-h-screen flex flex-col ">
      <NavBar />
      <div className="w-full h-full flex-1 flex items-center justify-center">
        <div className="container">{children}</div>
      </div>
    </div>
  );
}
