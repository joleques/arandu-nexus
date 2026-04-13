export const dynamic = 'force-dynamic';

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

export default async function HomePage() {
  const boards = await boardService.listBoards();

  return <BoardDirectory boards={boards} createBoardAction={createBoardAction} />;
}
