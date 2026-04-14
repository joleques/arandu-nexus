import { describe, expect, it } from 'vitest';
import { shouldPersistBoardTitle } from '@/modules/boards/application/board-title-persistence';

describe('shouldPersistBoardTitle', () => {
  it('does not persist an empty title', () => {
    expect(shouldPersistBoardTitle('   ', 'Board atual')).toBe(false);
  });

  it('does not persist when only surrounding spaces changed', () => {
    expect(shouldPersistBoardTitle('  Board atual  ', 'Board atual')).toBe(false);
  });

  it('persists when the normalized title changed', () => {
    expect(shouldPersistBoardTitle('Novo board', 'Board atual')).toBe(true);
  });
});
