const defaultMongoUri = 'mongodb://mongo:27017/arandu_nexus';
const defaultMongoDb = 'arandu_nexus';

export type AppEnv = {
  mongoUri: string;
  mongoDb: string;
  nodeEnv: string;
};

export function getAppEnv(env: NodeJS.ProcessEnv = process.env): AppEnv {
  return {
    mongoUri: env.MONGODB_URI?.trim() || defaultMongoUri,
    mongoDb: env.MONGODB_DB?.trim() || defaultMongoDb,
    nodeEnv: env.NODE_ENV?.trim() || 'development',
  };
}
