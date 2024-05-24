import { Decimal128, ObjectId } from "mongodb";

export type GiftUpdateType = {
  _id: ObjectId;
  amount: Decimal128;
  by: string;
};

export type GiftType = {
  name: string;
  imageUrl: string;

  recipient: string;

  price: Decimal128;
  paidAmount: Decimal128;
  currency: string;

  description: string;
  _id: ObjectId;
  userEmail: string;

  createdTimestamp: number;
  lastUpdatedTimestamp: number | null;

  updatesIds: number[];
};
