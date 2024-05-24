import { Avatar, Badge, Button } from "@nextui-org/react";
import ImgIcon from "./Icon/ImgIcon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { GiftType } from "@/db/schema";

export default async function GiftsList({ gifts }: { gifts: GiftType[] }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <ul role="list" className="divide-y divide-gray-100 mx-4">
      {gifts.map((gift) => (
        <Gift gift={gift} key={gift._id.toString()} />
      ))}
    </ul>
  );
}

function Gift({ gift }: { gift: GiftType }) {
  const createdDate = new Date(gift.createdTimestamp);
  const updatedDate = gift.lastUpdatedTimestamp
    ? new Date(gift.lastUpdatedTimestamp)
    : null;

  const price = gift.price.toString();

  return (
    <li className="flex justify-between items-center gap-x-6 py-5 relative">
      <div className="flex min-w-0 gap-x-4 items-center">
        <Badge
          content={`For ${gift.recipient}`}
          color={gift.paidAmount === gift.price ? "success" : "warning"}
          className="text-foreground-50 dark:text-foreground hidden sm:flex"
          size="md"
        >
          <Avatar
            isBordered
            fallback={<ImgIcon className="h-12 w-12" />}
            className="h-24 w-24 sm:h-28 sm:w-28 bg-gray-50"
            src={gift.imageUrl}
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
        <span
          className={`text-${
            gift.paidAmount === gift.price ? "success" : "warning"
          }`}
        >
          For {gift.recipient}{" "}
        </span>
        | {price} {gift.currency}
        {gift.paidAmount === gift.price ? "success" : "warning"}
      </p>

      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
        <p className="text-sm leading-6 text-foreground">
          {price} {gift.currency}
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
    </li>
  );
}
