import {
  Board,
  CreateBoardInput,
  UpdateBoardInput,
  createBoardRecord,
  updateBoardRecord,
} from '@/modules/boards/domain/board';
import { BoardRepository } from '@/modules/boards/application/board-repository';
import { assertBoardSnapshotIsSupported } from '@/modules/boards/application/board-snapshot-guard';

export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  async listBoards() {
    return this.boardRepository.list();
  }

  async createBoard(input: CreateBoardInput) {
    const title = input.title.trim();

    if (!title) {
      throw new Error('Board title is required.');
    }

    const board = createBoardRecord({ title });
    return this.boardRepository.create(board);
  }

  async getBoardById(id: string) {
    return this.boardRepository.getById(id);
  }

  async updateBoard(id: string, input: UpdateBoardInput) {
    const existingBoard = await this.boardRepository.getById(id);

    if (!existingBoard) {
      return null;
    }

    const nextTitle = input.title?.trim();
    if (input.title !== undefined && !nextTitle) {
      throw new Error('Board title cannot be empty.');
    }

    if (input.currentDocument !== undefined) {
      assertBoardSnapshotIsSupported(input.currentDocument);
    }

    const updatedBoard = updateBoardRecord(existingBoard, {
      title: nextTitle,
      currentDocument: input.currentDocument,
    });

    return this.boardRepository.update(id, updatedBoard);
  }

  async deleteBoard(id: string) {
    return this.boardRepository.delete(id);
  }
}

export function parseBoardSnapshot(snapshot: string) {
  if (!snapshot) {
    return null;
  }

  return JSON.parse(snapshot) as Record<string, unknown>;
}

export function stringifyBoardSnapshot(snapshot: Record<string, unknown>) {
  return JSON.stringify(snapshot);
}
