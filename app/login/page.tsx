"use client";
import { Button } from "@nextui-org/react";
import GoogleSvg from "../../public/google_icon.svg";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function GoogleImage() {
  return (
    <Image src={GoogleSvg} alt="Google Logo" height="30" color="white"></Image>
  );
}

export default function LoginPage() {
  const { data: session } = useSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Button
        startContent={<GoogleImage />}
        className="bg-gradient-to-tr from-blue-500 to-green-500 text-white shadow-lg"
        type="submit"
        onClick={() => {
          signIn("google", { callbackUrl: "/" });
        }}
      >
        Login With Google
      </Button>
    </div>
  );
}
