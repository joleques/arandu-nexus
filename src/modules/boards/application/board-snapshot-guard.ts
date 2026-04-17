const UNSUPPORTED_ASSET_MESSAGE =
  'Uploaded images are not supported in this MVP yet. Use the board library images for now.';

type SnapshotRecord = Record<string, unknown>;

function isSnapshotRecord(value: unknown): value is SnapshotRecord {
  return typeof value === 'object' && value !== null;
}

function isUnsupportedAssetSource(value: unknown) {
  return (
    typeof value === 'string' &&
    (value.startsWith('data:image/') || value.startsWith('blob:'))
  );
}

export function findUnsupportedBoardAssetSource(snapshot: string) {
  if (!snapshot) {
    return null;
  }

  const parsed = JSON.parse(snapshot) as unknown;

  if (!isSnapshotRecord(parsed) || !isSnapshotRecord(parsed.store)) {
    return null;
  }

  for (const record of Object.values(parsed.store)) {
    if (!isSnapshotRecord(record)) {
      continue;
    }

    if (record.typeName !== 'asset' || record.type !== 'image') {
      continue;
    }

    const props = isSnapshotRecord(record.props) ? record.props : null;
    const src = props?.src;

    if (isUnsupportedAssetSource(src)) {
      return src;
    }
  }

  return null;
}

export function assertBoardSnapshotIsSupported(snapshot: string) {
  const unsupportedSource = findUnsupportedBoardAssetSource(snapshot);

  if (unsupportedSource) {
    throw new Error(UNSUPPORTED_ASSET_MESSAGE);
  }
}

export function getBoardUnsupportedAssetMessage() {
  return UNSUPPORTED_ASSET_MESSAGE;
}
