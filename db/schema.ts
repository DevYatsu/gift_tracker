import { Decimal128, ObjectId } from "mongodb";

export type GiftUpdateType = {
  amount: string; // converted to Decimal128 before sent to db
  by: string;
  _id: string; // converted to ObjectId before sent to db
};

export type DbGiftUpdate = Omit<GiftUpdateType, "amount" | "_id"> & {
  _id: ObjectId;
  amount: Decimal128;
};

// this type is made to be easily sent between components unlike db types containg objects
export type GiftType = {
  name: string;
  imageUrl: string | null;

  _id: string; // converted to ObjectId before sent to db

  recipient: string;

  price: string; // converted to Decimal128 before sent to db
  paidAmount: string; // converted to Decimal128 before sent to db

  currency: string;

  description: string;
  userEmail: string;

  createdTimestamp: number;
  lastUpdatedTimestamp: number | null;

  updatesIds: string[];
};

export type DbGift = Omit<GiftType, "price" | "paidAmount" | "_id"> & {
  price: Decimal128;
  paidAmount: Decimal128;
  _id: ObjectId;
};
