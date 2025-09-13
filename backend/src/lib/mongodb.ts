import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

let cachedDb: Db | null = null;

async function connectToMongo() {
  if (cachedDb) return cachedDb;

  await client.connect();

  cachedDb = client.db(); // default DB or specify your DB name here
  return cachedDb;
}

