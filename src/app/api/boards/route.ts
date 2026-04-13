import { NextResponse } from 'next/server';
import { createBoardService } from '@/modules/boards/infra/board-service-factory';

const boardService = createBoardService();

export async function GET() {
  const boards = await boardService.listBoards();
  return NextResponse.json({ boards });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as { title?: string };

  try {
    const board = await boardService.createBoard({ title: payload.title ?? '' });
    return NextResponse.json({ board }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unable to create board.' },
      { status: 400 }
    );
  }
}
