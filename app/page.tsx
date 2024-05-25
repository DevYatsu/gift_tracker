import { authOptions } from "@/auth";
import NewGiftButton from "@/components/buttons/NewGift";
import List from "@/components/List";
import NavBar from "@/components/NavBar";
import { DbGift, GiftType, GiftUpdateType } from "@/db/schema";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { findUserGifts, getUpdatesFromIds } from "@/db/interactions";
import { ObjectId } from "mongodb";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const gifts = await fetchGifts(session.user.email);

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

async function fetchGifts(email?: string | null) {
  const dbGifts = (await findUserGifts(email ?? "")) as unknown as DbGift[];

  const gifts = dbGifts.map((dbGift) => {
    const gift = dbGift as Record<string, any>;

    gift.price = gift.price.toString();
    gift.paidAmount = gift.paidAmount.toString();
    gift._id = gift._id.toString();
    gift.updatesIds = gift.updatesIds.map((objectId: ObjectId) =>
      objectId.toString()
    );

    return gift as GiftType;
  }) as unknown as GiftType[];

  return gifts;
}
