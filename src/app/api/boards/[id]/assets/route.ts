import { NextResponse } from 'next/server';
import { createBoardService } from '@/modules/boards/infra/board-service-factory';
import { saveBoardUploadedAsset } from '@/modules/boards/infra/board-file-asset-storage';
import { getBoardAssetUploadFieldName } from '@/modules/boards/application/board-uploaded-asset';
import { logAdapter } from '@/shared/logging/log-adapter';

const boardService = createBoardService();

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const board = await boardService.getBoardById(id);

  if (!board) {
    return NextResponse.json({ message: 'Board not found.' }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get(getBoardAssetUploadFieldName());

    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'Image file is required.' }, { status: 400 });
    }

    const asset = await saveBoardUploadedAsset(id, file);

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    logAdapter.error('Board asset upload failed.', {
      boardId: id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unable to upload board asset.' },
      { status: 400 },
    );
  }
}
