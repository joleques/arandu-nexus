import { Board, CreateBoardInput, UpdateBoardInput } from '@/modules/boards/domain/board';

export interface BoardRepository {
  list(): Promise<Board[]>;
  create(input: CreateBoardInput): Promise<Board>;
  getById(id: string): Promise<Board | null>;
  update(id: string, input: UpdateBoardInput): Promise<Board | null>;
  delete(id: string): Promise<boolean>;
}
