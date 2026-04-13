import { NextResponse } from 'next/server';
import { createBoardService } from '@/modules/boards/infra/board-service-factory';

const boardService = createBoardService();

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const board = await boardService.getBoardById(id);

  if (!board) {
    return NextResponse.json({ message: 'Board not found.' }, { status: 404 });
  }

  return NextResponse.json({ board });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = (await request.json()) as {
    title?: string;
    currentDocument?: string;
  };

  try {
    const board = await boardService.updateBoard(id, payload);

    if (!board) {
      return NextResponse.json({ message: 'Board not found.' }, { status: 404 });
    }

    return NextResponse.json({ board });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unable to update board.' },
      { status: 400 }
    );
  }
}
