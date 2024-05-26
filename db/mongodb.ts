import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Add Mongo URI to .env.local");
}

let cachedClient: MongoClient | null = null;
let cachedPromise: Promise<MongoClient> | null = null;

async function getClient() {
  if (cachedClient && cachedPromise) {
    return cachedPromise;
  }

  cachedClient = new MongoClient(uri!, {});
  cachedPromise = cachedClient.connect();
  return cachedPromise;
}

const clientPromise = getClient();

export default clientPromise;
