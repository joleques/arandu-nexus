const BOARD_ASSET_UPLOAD_FIELD = 'file';
const MAX_BOARD_ASSET_SIZE_BYTES = 5 * 1024 * 1024;

const BOARD_IMAGE_MIME_TYPES = {
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/svg+xml': 'svg',
  'image/webp': 'webp',
} as const;

export type SupportedBoardImageMimeType = keyof typeof BOARD_IMAGE_MIME_TYPES;

export function getBoardAssetUploadFieldName() {
  return BOARD_ASSET_UPLOAD_FIELD;
}

export function getBoardAssetMaxSizeBytes() {
  return MAX_BOARD_ASSET_SIZE_BYTES;
}

export function getSupportedBoardImageMimeTypes() {
  return Object.keys(BOARD_IMAGE_MIME_TYPES) as SupportedBoardImageMimeType[];
}

export function assertBoardAssetFileIsSupported(file: File) {
  if (!(file.type in BOARD_IMAGE_MIME_TYPES)) {
    throw new Error('Only PNG, JPG, WEBP, GIF and SVG images are supported.');
  }

  if (file.size <= 0) {
    throw new Error('Uploaded image is empty.');
  }

  if (file.size > MAX_BOARD_ASSET_SIZE_BYTES) {
    throw new Error('Uploaded image exceeds the 5 MB limit.');
  }
}

export function getBoardAssetExtension(mimeType: string) {
  return BOARD_IMAGE_MIME_TYPES[mimeType as SupportedBoardImageMimeType] ?? null;
}
