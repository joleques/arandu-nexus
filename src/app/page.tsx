export const dynamic = 'force-dynamic';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { BoardDirectory } from '@/modules/boards/ui/board-directory';
import { createBoardService } from '@/modules/boards/infra/board-service-factory';

const boardService = createBoardService();

async function createBoardAction(formData: FormData) {
  'use server';

  const rawTitle = formData.get('title');
  const title = typeof rawTitle === 'string' ? rawTitle : '';
  const board = await boardService.createBoard({ title });

  redirect(`/boards/${board.id}`);
}

async function deleteBoardAction(boardId: string) {
  'use server';

  const deleted = await boardService.deleteBoard(boardId);

  if (!deleted) {
    throw new Error('Board not found.');
  }

  revalidatePath('/');
}

export default async function HomePage() {
  const boards = await boardService.listBoards();

  return (
    <BoardDirectory
      boards={boards}
      createBoardAction={createBoardAction}
      deleteBoardAction={deleteBoardAction}
    />
  );
}
