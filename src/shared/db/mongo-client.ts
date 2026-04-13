import { MongoClient } from 'mongodb';
import { getAppEnv } from '@/shared/config/env';

let clientPromise: Promise<MongoClient> | undefined;

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
}

export function getMongoClient() {
  if (!clientPromise) {
    clientPromise = global.__mongoClientPromise__;
  }

  if (!clientPromise) {
    const { mongoUri } = getAppEnv();
    clientPromise = new MongoClient(mongoUri).connect();

    if (process.env.NODE_ENV !== 'production') {
      global.__mongoClientPromise__ = clientPromise;
    }
  }

  return clientPromise;
}
