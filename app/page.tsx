import { authOptions } from "@/auth";
import NewGiftButton from "@/components/buttons/NewGift";
import NavBar from "@/components/NavBar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import GiftsList from "@/components/GiftsList";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <>
      <NavBar />
      <div className="grid place-items-center my-8 pb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Gifts List</h1>
        <div className="container max-w-5xl pb-8">
          <GiftsList />
        </div>
        <NewGiftButton />
      </div>
    </>
  );
}
