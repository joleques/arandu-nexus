import { describe, expect, it } from 'vitest';
import {
  BOARD_IMAGE_LIBRARY_ITEMS,
  buildBoardImageLibraryAsset,
  buildBoardImageLibraryShape,
} from '@/modules/boards/application/board-image-library';

describe('board image library', () => {
  it('exposes the free image catalog from /workspace/icons', () => {
    expect(BOARD_IMAGE_LIBRARY_ITEMS.map((item) => item.kind)).toEqual([
      'api',
      'aws-1',
      'aws-service',
      'base',
      'cerebro',
      'fila-0',
      'fila-1',
      'mobile',
      'mobile-2',
      'persona-1',
      'persona-2',
      'topic',
      'topic-0',
      'ui-2',
      'agent-ai',
      'agents-ai',
    ]);
  });

  it('builds reusable image assets and shapes for the sidebar library', () => {
    const item = BOARD_IMAGE_LIBRARY_ITEMS.find((entry) => entry.kind === 'api');
    expect(item).toBeDefined();

    const asset = buildBoardImageLibraryAsset(item!);
    const shape = buildBoardImageLibraryShape(item!, 120, 240, asset.id);

    expect(asset).toMatchObject({
      type: 'image',
      props: { src: '/icons/api.png', name: 'api.png', w: 118, h: 118 },
    });
    expect(shape).toMatchObject({
      type: 'image',
      x: 120,
      y: 240,
      props: { assetId: asset.id, altText: 'API', w: 118, h: 118 },
    });
  });
});
