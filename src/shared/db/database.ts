import { Db } from 'mongodb';
import { getAppEnv } from '@/shared/config/env';
import { getMongoClient } from '@/shared/db/mongo-client';

let databasePromise: Promise<Db> | undefined;

export function getDatabase() {
  if (!databasePromise) {
    databasePromise = getMongoClient().then((client) => {
      const { mongoDb } = getAppEnv();
      return client.db(mongoDb);
    });
  }

  return databasePromise;
}
