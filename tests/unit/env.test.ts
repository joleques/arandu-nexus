import { describe, expect, it } from 'vitest';
import { getAppEnv } from '@/shared/config/env';

describe('getAppEnv', () => {
  it('returns the configured mongo settings and node env when provided', () => {
    const env = getAppEnv({
      MONGODB_URI: 'mongodb://example:27017/app',
      MONGODB_DB: 'custom_db',
      NODE_ENV: 'test',
    });

    expect(env).toEqual({
      mongoUri: 'mongodb://example:27017/app',
      mongoDb: 'custom_db',
      nodeEnv: 'test',
    });
  });

  it('falls back to development defaults when env vars are missing', () => {
    const env = getAppEnv({});

    expect(env).toEqual({
      mongoUri: 'mongodb://mongo:27017/arandu_nexus',
      mongoDb: 'arandu_nexus',
      nodeEnv: 'development',
    });
  });
});
