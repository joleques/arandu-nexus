import { describe, expect, it } from 'vitest';
import {
  assertBoardAssetFileIsSupported,
  getBoardAssetExtension,
  getBoardAssetMaxSizeBytes,
  getBoardAssetUploadFieldName,
  getSupportedBoardImageMimeTypes,
} from '@/modules/boards/application/board-uploaded-asset';

describe('board uploaded asset rules', () => {
  it('exposes the upload field and supported mime types', () => {
    expect(getBoardAssetUploadFieldName()).toBe('file');
    expect(getSupportedBoardImageMimeTypes()).toEqual([
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp',
    ]);
  });

  it('accepts supported image files and resolves their extensions', () => {
    expect(() =>
      assertBoardAssetFileIsSupported(
        new File(['png'], 'diagram.png', { type: 'image/png' }),
      ),
    ).not.toThrow();

    expect(getBoardAssetExtension('image/png')).toBe('png');
    expect(getBoardAssetExtension('image/jpeg')).toBe('jpg');
  });

  it('rejects unsupported or oversized files', () => {
    expect(() =>
      assertBoardAssetFileIsSupported(
        new File(['txt'], 'notes.txt', { type: 'text/plain' }),
      ),
    ).toThrow('Only PNG, JPG, WEBP, GIF and SVG images are supported.');

    expect(() =>
      assertBoardAssetFileIsSupported(
        new File([new Uint8Array(getBoardAssetMaxSizeBytes() + 1)], 'huge.png', {
          type: 'image/png',
        }),
      ),
    ).toThrow('Uploaded image exceeds the 5 MB limit.');
  });
});
