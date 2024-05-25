"use server";

import { Decimal128, ObjectId, PushOperator } from "mongodb";
import clientPromise from "./mongodb";
import { DbGift, DbGiftUpdate, GiftType, GiftUpdateType } from "./schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function getGiftsCollection() {
  const client = await clientPromise;
  const db = client.db("gift_tracker");

  return db.collection("gifts");
}

export async function getUpdatesCollection() {
  const client = await clientPromise;
  const db = client.db("gift_tracker");

  return db.collection("gift_updates");
}

export async function getUpdatesFromIds(updatesIds: string[]) {
  const objectIds = updatesIds.map((id) => new ObjectId(id));
  console.log(objectIds);

  const updatesCollection = await getUpdatesCollection();

  const updates = await Promise.all(
    objectIds.map(
      async (id) =>
        (await updatesCollection.findOne({
          _id: id,
        })) as unknown as DbGiftUpdate
    )
  );

  console.log(updates);

  return updates;
}

export async function addNewGift(gift: GiftType) {
  const dbGift = gift as unknown as DbGift;

  if (typeof gift.price === "string") {
    dbGift.price = new Decimal128(gift.price);
  }
  if (typeof gift.paidAmount === "string") {
    dbGift.paidAmount = new Decimal128(gift.price);
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.email !== dbGift.userEmail) {
    return { error: "unauthorized" };
  }

  const giftsCollection = await getGiftsCollection();

  await giftsCollection.insertOne(dbGift);
}

export async function addGiftUpdate(
  gift: GiftType,
  update: {
    by: string;
    amount: string;
  }
) {
  const dbUpdate = update as unknown as DbGiftUpdate;
  dbUpdate._id = ObjectId.createFromTime(Date.now());

  if (typeof update.amount === "string") {
    dbUpdate.amount = new Decimal128(update.amount);
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.email !== gift.userEmail) {
    return { error: "unauthorized" };
  }

  const giftsCollection = await getGiftsCollection();
  const updatesCollection = await getUpdatesCollection();

  await giftsCollection.updateOne(
    { _id: new ObjectId(gift._id) },
    {
      $push: {
        updatesIds: new ObjectId(dbUpdate._id),
      } as PushOperator<Document>,
    }
  );

  await updatesCollection.insertOne(dbUpdate);
}

export async function deleteGift(giftId: string) {
  const objectId = new ObjectId(giftId);
  const giftsCollection = await getGiftsCollection();

  const gift = (await giftsCollection.findOne({
    _id: objectId,
  })) as DbGift | null;

  if (!gift) {
    return { error: "no gift found" };
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.email !== gift.userEmail) {
    return { error: "unauthorized" };
  }

  await giftsCollection.deleteOne({ _id: objectId });
}

export async function updateGift(giftId: number, updateValue: Document) {
  const objectId = new ObjectId(giftId);
  const giftsCollection = await getGiftsCollection();

  const gift = (await giftsCollection.findOne({
    _id: objectId,
  })) as DbGift | null;

  if (!gift) {
    return { error: "no gift found" };
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.email !== gift.userEmail) {
    return { error: "unauthorized" };
  }

  await giftsCollection.updateOne({ _id: objectId }, updateValue);
}

export async function findUserGifts(
  userEmail: string
): Promise<GiftType[] | { error: string }> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.email !== userEmail) {
    return { error: "unauthorized" };
  }

  const giftsCollection = await getGiftsCollection();

  return (await giftsCollection
    .find({ userEmail })
    .toArray()) as unknown as GiftType[];
}
