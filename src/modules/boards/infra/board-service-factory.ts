import { BoardService } from '@/modules/boards/application/board-service';
import { MongoBoardRepository } from '@/modules/boards/infra/board-mongo-repository';

export function createBoardService() {
  return new BoardService(new MongoBoardRepository());
}
