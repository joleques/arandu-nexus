import type { TLAsset, TLAssetStore } from 'tldraw';
import { getBoardAssetUploadFieldName } from '@/modules/boards/application/board-uploaded-asset';

type AssetUploadResponse = {
  asset?: {
    src?: string;
  };
  message?: string;
};

export function createBoardEditorAssetStore(boardId: string): TLAssetStore {
  return {
    async upload(_asset: TLAsset, file: File) {
      const formData = new FormData();
      formData.append(getBoardAssetUploadFieldName(), file);

      const response = await fetch(`/api/boards/${boardId}/assets`, {
        method: 'POST',
        body: formData,
      });

      const payload = (await response.json().catch(() => null)) as AssetUploadResponse | null;

      if (!response.ok || !payload?.asset?.src) {
        throw new Error(payload?.message ?? 'Unable to upload board asset.');
      }

      return { src: payload.asset.src };
    },
    resolve(asset: TLAsset) {
      return asset.props.src;
    },
  };
}
