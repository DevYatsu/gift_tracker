import { authOptions } from "@/auth";
import NewGiftButton from "@/components/buttons/NewGift";
import List from "@/components/List";
import NavBar from "@/components/NavBar";
import { GiftType } from "@/db/schema";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { findUserGifts } from "@/db/interactions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const gifts = (await findUserGifts(
    session.user.email ?? ""
  )) as unknown as GiftType[];

  return (
    <>
      <NavBar />
      <div className="grid place-items-center my-8 pb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Gifts List</h1>
        <div className="container max-w-5xl pb-8">
          <List gifts={gifts} />
        </div>
        <NewGiftButton />
      </div>
    </>
  );
}
//
