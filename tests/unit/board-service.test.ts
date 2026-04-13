import { describe, expect, it } from 'vitest';
import { BoardRepository } from '@/modules/boards/application/board-repository';
import { BoardService, parseBoardSnapshot, stringifyBoardSnapshot } from '@/modules/boards/application/board-service';
import { Board } from '@/modules/boards/domain/board';

class InMemoryBoardRepository implements BoardRepository {
  constructor(private readonly boards = new Map<string, Board>()) {}

  async list() {
    return [...this.boards.values()];
  }

  async create(input: Board) {
    this.boards.set(input.id, input);
    return input;
  }

  async getById(id: string) {
    return this.boards.get(id) ?? null;
  }

  async update(id: string, input: Board) {
    this.boards.set(id, input);
    return this.boards.get(id) ?? null;
  }
}

describe('BoardService', () => {
  it('creates a board with sanitized title', async () => {
    const service = new BoardService(new InMemoryBoardRepository());

    const board = await service.createBoard({ title: '  Arquitetura de checkout  ' });

    expect(board.title).toBe('Arquitetura de checkout');
    expect(board.currentDocument).toBe('');
    expect(board.id).toBeTruthy();
  });

  it('updates an existing board title and document', async () => {
    const repository = new InMemoryBoardRepository();
    const service = new BoardService(repository);
    const board = await service.createBoard({ title: 'Board inicial' });

    const updated = await service.updateBoard(board.id, {
      title: 'Board revisado',
      currentDocument: '{"document":{}}',
    });

    expect(updated).toMatchObject({
      title: 'Board revisado',
      currentDocument: '{"document":{}}',
    });
  });

  it('serializes and parses snapshots consistently', () => {
    const snapshot = {
      document: {
        pages: [],
      },
    };

    const serialized = stringifyBoardSnapshot(snapshot);

    expect(parseBoardSnapshot(serialized)).toEqual(snapshot);
  });
});
