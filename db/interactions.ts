"use server";

import { Decimal128, ObjectId, UpdateFilter } from "mongodb";
import clientPromise from "./mongodb";
import { GiftType } from "./schema";

async function getGifts() {
  const client = await clientPromise;
  const db = client.db("gift_tracker");

  return db.collection("gifts");
}

export async function addNewGift(gift: GiftType) {
  if (typeof gift.price === "number") {
    gift.price = new Decimal128((gift.price as number).toString());
  }
  const giftsCollection = await getGifts();

  giftsCollection.insertOne(gift);
}

export async function deleteGift(giftId: ObjectId) {
  const giftsCollection = await getGifts();

  giftsCollection.deleteOne({ _id: giftId });
}

export async function updateGift(giftId: ObjectId, updateValue: Document) {
  const giftsCollection = await getGifts();

  await giftsCollection.findOneAndUpdate({ _id: giftId }, updateValue);
}

export async function findUserGifts(userEmail: string): Promise<GiftType[]> {
  const giftsCollection = await getGifts();

  return (await giftsCollection
    .find({ userEmail })
    .toArray()) as unknown as GiftType[];
}
