import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import {
  assertBoardAssetFileIsSupported,
  getBoardAssetExtension,
} from '@/modules/boards/application/board-uploaded-asset';

export async function saveBoardUploadedAsset(boardId: string, file: File) {
  assertBoardAssetFileIsSupported(file);

  const extension = getBoardAssetExtension(file.type);

  if (!extension) {
    throw new Error('Unable to derive an extension for the uploaded image.');
  }

  const fileName = `${randomUUID()}.${extension}`;
  const relativeDirectory = path.join('uploads', 'boards', boardId);
  const absoluteDirectory = path.join(process.cwd(), 'public', relativeDirectory);
  const absoluteFilePath = path.join(absoluteDirectory, fileName);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await mkdir(absoluteDirectory, { recursive: true });
  await writeFile(absoluteFilePath, fileBuffer);

  return {
    src: `/${relativeDirectory.replaceAll(path.sep, '/')}/${fileName}`,
  };
}
