import { describe, expect, it } from 'vitest';
import { shouldPersistBoardSnapshot } from '@/modules/boards/application/board-persistence';

describe('shouldPersistBoardSnapshot', () => {
  it('does not persist before the editor is mounted', () => {
    expect(shouldPersistBoardSnapshot(false, '{"store":{}}', '')).toBe(false);
  });

  it('persists when the editor is mounted and the snapshot changed', () => {
    expect(shouldPersistBoardSnapshot(true, '{"store":{"a":1}}', '{"store":{"a":0}}')).toBe(true);
  });

  it('does not persist when the snapshot is unchanged', () => {
    expect(shouldPersistBoardSnapshot(true, '{"store":{"a":1}}', '{"store":{"a":1}}')).toBe(false);
  });
});
