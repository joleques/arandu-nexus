export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { BoardCanvas } from '@/modules/boards/ui/board-canvas';
import { createBoardService } from '@/modules/boards/infra/board-service-factory';

const boardService = createBoardService();

type BoardPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params;
  const board = await boardService.getBoardById(id);

  if (!board) {
    notFound();
  }

  return <BoardCanvas board={board} />;
}
