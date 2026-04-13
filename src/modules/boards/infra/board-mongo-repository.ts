import { Collection } from 'mongodb';
import { BoardRepository } from '@/modules/boards/application/board-repository';
import { Board, CreateBoardInput, UpdateBoardInput } from '@/modules/boards/domain/board';
import { getDatabase } from '@/shared/db/database';

type BoardDocument = Board & {
  _id: string;
};

export class MongoBoardRepository implements BoardRepository {
  private async getCollection(): Promise<Collection<BoardDocument>> {
    const database = await getDatabase();
    return database.collection<BoardDocument>('boards');
  }

  async list() {
    const collection = await this.getCollection();
    const boards = await collection.find({}).sort({ updatedAt: -1 }).toArray();
    return boards.map(({ _id, ...board }) => board);
  }

  async create(input: CreateBoardInput & Partial<Board>) {
    const collection = await this.getCollection();
    const board = input as Board;

    await collection.insertOne({
      _id: board.id,
      ...board,
    });

    return board;
  }

  async getById(id: string) {
    const collection = await this.getCollection();
    const board = await collection.findOne({ _id: id });

    if (!board) {
      return null;
    }

    const { _id, ...rest } = board;
    return rest;
  }

  async update(id: string, input: UpdateBoardInput & Partial<Board>) {
    const collection = await this.getCollection();
    const update = input as Board;

    await collection.updateOne(
      { _id: id },
      {
        $set: {
          title: update.title,
          currentDocument: update.currentDocument,
          updatedAt: update.updatedAt,
        },
      }
    );

    return this.getById(id);
  }
}
