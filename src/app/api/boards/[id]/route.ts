import { NextResponse } from 'next/server';
import { logAdapter } from '@/shared/logging/log-adapter';
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
    logAdapter.error('Board update failed.', {
      boardId: id,
      titleProvided: payload.title !== undefined,
      currentDocumentLength: payload.currentDocument?.length ?? 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unable to update board.' },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const deleted = await boardService.deleteBoard(id);

  if (!deleted) {
    return NextResponse.json({ message: 'Board not found.' }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
