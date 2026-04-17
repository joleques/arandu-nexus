import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBoardEditorAssetStore } from '@/modules/boards/application/board-editor-assets';

describe('createBoardEditorAssetStore', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uploads files through the board asset api', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ asset: { src: '/uploads/boards/board-1/file.png' } }),
    });

    vi.stubGlobal('fetch', fetchMock);

    const assetStore = createBoardEditorAssetStore('board-1');
    const result = await assetStore.upload(
      {
        id: 'asset:img',
        typeName: 'asset',
        type: 'image',
        props: {
          src: '',
          name: 'diagram.png',
          w: 120,
          h: 80,
          mimeType: 'image/png',
          isAnimated: false,
        },
        meta: {},
      },
      new File(['content'], 'diagram.png', { type: 'image/png' }),
    );

    expect(fetchMock).toHaveBeenCalledWith('/api/boards/board-1/assets', {
      method: 'POST',
      body: expect.any(FormData),
    });
    expect(result).toEqual({ src: '/uploads/boards/board-1/file.png' });
  });

  it('surfaces the api error message when upload fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Uploaded image exceeds the 5 MB limit.' }),
      }),
    );

    const assetStore = createBoardEditorAssetStore('board-1');

    await expect(
      assetStore.upload(
        {
          id: 'asset:img',
          typeName: 'asset',
          type: 'image',
          props: {
            src: '',
            name: 'diagram.png',
            w: 120,
            h: 80,
            mimeType: 'image/png',
            isAnimated: false,
          },
          meta: {},
        },
        new File(['content'], 'diagram.png', { type: 'image/png' }),
      ),
    ).rejects.toThrow('Uploaded image exceeds the 5 MB limit.');
  });

  it('resolves persisted asset urls without rewriting them', () => {
    const assetStore = createBoardEditorAssetStore('board-1');

    expect(
      assetStore.resolve({
        id: 'asset:img',
        typeName: 'asset',
        type: 'image',
        props: {
          src: '/icons/api.png',
          name: 'api.png',
          w: 118,
          h: 118,
          mimeType: 'image/png',
          isAnimated: false,
        },
        meta: {},
      }),
    ).toBe('/icons/api.png');
  });
});
