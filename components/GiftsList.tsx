import { Avatar, Badge } from "@nextui-org/react";
import ImgIcon from "./Icon/ImgIcon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { DbGift, GiftType, GiftUpdateType } from "@/db/schema";
import GiftInformationModal from "./GiftModal";
import { findUserGifts, getUpdatesFromIds } from "@/db/interactions";
import { ObjectId } from "mongodb";

export default async function GiftsList() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const gifts = await fetchGifts(session.user.email);

  return (
    <ul role="list" className="divide-y divide-gray-100 mx-4">
      {gifts.map((gift) => (
        <Gift gift={gift} key={gift._id} />
      ))}
    </ul>
  );
}

async function Gift({ gift }: { gift: GiftType }) {
  const createdDate = new Date(gift.createdTimestamp);
  const updatedDate = gift.lastUpdatedTimestamp
    ? new Date(gift.lastUpdatedTimestamp)
    : null;

  const updates = (await getUpdatesFromIds(gift.updatesIds))
    .filter((update) => update)
    .map((dbUpdate) => {
      const update = dbUpdate as Record<string, any>;

      update.by = dbUpdate.by;
      update.amount = dbUpdate.amount.toString();
      update._id = dbUpdate._id.toString();

      return update as GiftUpdateType;
    });

  const paidAmount = updates.reduce((acc, current) => {
    return acc + parseFloat(current.amount);
  }, 0);

  return (
    <li className="flex justify-between items-center gap-x-6 py-5 relative">
      <div className="flex min-w-0 gap-x-4 items-center">
        <Badge
          content={`For ${gift.recipient}`}
          color={paidAmount.toString() >= gift.price ? "success" : "warning"}
          className="text-foreground-50 dark:text-foreground hidden sm:flex"
          size="md"
        >
          <Avatar
            isBordered
            fallback={<ImgIcon className="h-12 w-12" />}
            className="h-24 w-24 sm:h-28 sm:w-28 bg-foreground-50"
            src={gift.imageUrl ?? undefined}
            alt={gift.name}
            radius="full"
          />
        </Badge>
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-foreground">
            {gift.name}
          </p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
            {gift.description}
          </p>
        </div>
      </div>

      <p className="sm:hidden text-sm leading-6 text-foreground absolute right-2 top-5">
        For{" "}
        <span
          className={`text-${
            paidAmount >= parseFloat(gift.price) ? "success" : "warning"
          }`}
        >
          {gift.recipient}{" "}
        </span>
        | {gift.price} {gift.currency}
      </p>

      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
        <p className="text-sm leading-6 text-foreground">
          {gift.price} {gift.currency}
        </p>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          {updatedDate ? `Updated ${updatedDate.toLocaleString()} | ` : ""}
          Created {createdDate.toLocaleString()}
        </p>
        {/* {gift.lastSeen ? (
          <p className="mt-1 text-xs leading-5 text-gray-500">
            Last seen{" "}
            <Time dateTime={gift.lastSeenDateTime}>{gift.lastSeen}</Time>
          </p>
        ) : (
          <div className="mt-1 flex items-center gap-x-1.5">
            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs leading-5 text-gray-500">Online</p>
          </div>
        )} */}
      </div>

      <GiftInformationModal gift={gift} initialUpdates={updates} />
    </li>
  );
}

async function fetchGifts(email?: string | null) {
  const dbGifts = (await findUserGifts(email ?? "")) as unknown as DbGift[];

  const gifts = dbGifts.map((dbGift) => {
    const gift = dbGift as Record<string, any>;

    gift.price = gift.price.toString();
    gift._id = gift._id.toString();
    gift.updatesIds = gift.updatesIds.map((objectId: ObjectId) =>
      objectId.toString()
    );

    return gift as GiftType;
  }) as unknown as GiftType[];

  return gifts;
}
