import { AssetRecordType, createShapeId, type TLImageAsset, type TLShapePartial } from '@tldraw/tlschema';

export type BoardImageLibraryItem = {
  kind: string;
  label: string;
  src: string;
  imageName: string;
  width: number;
  height: number;
  sourceWidth?: number;
  sourceHeight?: number;
};

export const BOARD_IMAGE_LIBRARY_ITEMS: readonly BoardImageLibraryItem[] = [
  { kind: 'api', label: 'API', src: '/icons/api.png', imageName: 'api.png', width: 118, height: 118 },
  { kind: 'aws-1', label: 'AWS', src: '/icons/aws-1.png', imageName: 'aws-1.png', width: 120, height: 120 },
  { kind: 'aws-service', label: 'AWS service', src: '/icons/aws-service.png', imageName: 'aws-service.png', width: 160, height: 100, sourceWidth: 1280, sourceHeight: 799 },
  { kind: 'base', label: 'Base', src: '/icons/base.png', imageName: 'base.png', width: 118, height: 118 },
  { kind: 'cerebro', label: 'Cerebro', src: '/icons/cerebro.png', imageName: 'cerebro.png', width: 124, height: 124 },
  { kind: 'fila-0', label: 'Fila 0', src: '/icons/fila-0.png', imageName: 'fila-0.png', width: 212, height: 60, sourceWidth: 251, sourceHeight: 71 },
  { kind: 'fila-1', label: 'Fila 1', src: '/icons/fila-1.png', imageName: 'fila-1.png', width: 212, height: 60 },
  { kind: 'mobile', label: 'Mobile', src: '/icons/mobile.png', imageName: 'mobile.png', width: 112, height: 112 },
  { kind: 'mobile-2', label: 'Mobile 2', src: '/icons/mobile-2.png', imageName: 'mobile-2.png', width: 112, height: 112 },
  { kind: 'persona-1', label: 'Persona 1', src: '/icons/persona-1.png', imageName: 'persona-1.png', width: 112, height: 108 },
  { kind: 'persona-2', label: 'Persona 2', src: '/icons/persona-2.png', imageName: 'persona-2.png', width: 112, height: 108 },
  { kind: 'topic', label: 'Topico', src: '/icons/topic.png', imageName: 'topic.png', width: 172, height: 72 },
  { kind: 'topic-0', label: 'Topico 0', src: '/icons/topic-0.png', imageName: 'topic-0.png', width: 172, height: 72, sourceWidth: 330, sourceHeight: 138 },
  { kind: 'ui-2', label: 'UI', src: '/icons/ui-2.png', imageName: 'ui-2.png', width: 112, height: 112 },
  { kind: 'agent-ai', label: 'Agent AI', src: '/icons/agent-ai.png', imageName: 'agent-ai.png', width: 128, height: 128 },
  { kind: 'agents-ai', label: 'Agents AI', src: '/icons/agents-ai.png', imageName: 'agents-ai.png', width: 128, height: 128 },
] as const;

export function buildBoardImageLibraryAsset(item: BoardImageLibraryItem): TLImageAsset {
  return {
    id: AssetRecordType.createId(`library-${item.kind}-${item.imageName}`),
    typeName: 'asset',
    type: 'image',
    meta: {
      architecture: {
        semanticType: item.kind,
        semanticClass: 'library-image',
      },
    },
    props: {
      w: item.sourceWidth ?? item.width,
      h: item.sourceHeight ?? item.height,
      name: item.imageName,
      isAnimated: false,
      mimeType: 'image/png',
      src: item.src,
    },
  };
}

export function buildBoardImageLibraryShape(item: BoardImageLibraryItem, x: number, y: number, assetId: TLImageAsset['id']): TLShapePartial {
  return {
    id: createShapeId(),
    type: 'image',
    x,
    y,
    meta: {
      architecture: {
        semanticType: item.kind,
        semanticClass: 'library-image',
      },
    },
    props: {
      w: item.width,
      h: item.height,
      playing: true,
      assetId,
      crop: null,
      flipX: false,
      flipY: false,
      altText: item.label,
    },
  };
}
