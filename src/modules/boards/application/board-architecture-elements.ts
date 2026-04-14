import { AssetRecordType, createShapeId, toRichText, type TLAssetId, type TLImageAsset, type TLShapePartial } from '@tldraw/tlschema';

export const BOARD_ARCHITECTURE_NODE_KINDS = [
  'microservice',
  'database',
  'queue',
  'topic',
  'api',
  'ui',
  'mobile',
  'persona-user',
  'persona-ai',
  'automated-flow',
  'aws-system',
] as const;

export const BOARD_ARCHITECTURE_FLOW_KINDS = ['sync-request', 'async-event', 'queue-flow', 'topic-pubsub'] as const;

export type BoardArchitectureNodeKind = (typeof BOARD_ARCHITECTURE_NODE_KINDS)[number];
export type BoardArchitectureFlowKind = (typeof BOARD_ARCHITECTURE_FLOW_KINDS)[number];

type BoardArchitectureNodeDefinition = {
  kind: BoardArchitectureNodeKind;
  label: string;
  description: string;
  visual: 'geo' | 'image';
  geo?: 'cloud' | 'rectangle' | 'ellipse' | 'diamond' | 'hexagon' | 'oval';
  color?: 'black' | 'grey' | 'blue' | 'green' | 'yellow' | 'orange' | 'red';
  fill?: 'none' | 'solid' | 'semi';
  dash?: 'solid' | 'dashed';
  imageSrc?: string;
  imageMimeType?: string;
  imageName?: string;
  sourceWidth?: number;
  sourceHeight?: number;
  width: number;
  height: number;
};

type BoardArchitectureFlowDefinition = {
  kind: BoardArchitectureFlowKind;
  label: string;
  description: string;
  dash: 'solid' | 'dashed' | 'dotted';
  color: 'black' | 'grey' | 'blue' | 'green' | 'yellow' | 'orange' | 'red';
  arrowheadEnd: 'arrow' | 'triangle';
  semanticMode: 'sync' | 'async';
  transport: 'request-response' | 'event' | 'queue' | 'topic';
};

export const BOARD_ARCHITECTURE_NODE_DEFINITIONS: readonly BoardArchitectureNodeDefinition[] = [
  {
    kind: 'microservice',
    label: 'Microservice',
    description: 'Servico de negocio encapsulado',
    visual: 'geo',
    geo: 'cloud',
    color: 'blue',
    fill: 'semi',
    dash: 'solid',
    width: 220,
    height: 120,
  },
  {
    kind: 'database',
    label: 'Base de dados',
    description: 'Persistencia e armazenamento',
    visual: 'image',
    imageSrc: '/icons/base.png',
    imageMimeType: 'image/png',
    imageName: 'base.png',
    width: 118,
    height: 118,
  },
  {
    kind: 'queue',
    label: 'Fila',
    description: 'Entrega assincrona ponto a ponto',
    visual: 'image',
    imageSrc: '/icons/fila-0.png',
    imageMimeType: 'image/png',
    imageName: 'fila-0.png',
    sourceWidth: 251,
    sourceHeight: 71,
    width: 212,
    height: 60,
  },
  {
    kind: 'topic',
    label: 'Topico',
    description: 'Distribuicao assincrona publish/subscribe',
    visual: 'image',
    imageSrc: '/icons/topic-0.png',
    imageMimeType: 'image/png',
    imageName: 'topic-0.png',
    sourceWidth: 330,
    sourceHeight: 138,
    width: 172,
    height: 72,
  },
  {
    kind: 'api',
    label: 'API',
    description: 'Contrato de integracao sincrona',
    visual: 'image',
    imageSrc: '/icons/api.png',
    imageMimeType: 'image/png',
    imageName: 'api.png',
    width: 118,
    height: 118,
  },
  {
    kind: 'ui',
    label: 'UI',
    description: 'Experiencia voltada ao usuario',
    visual: 'image',
    imageSrc: '/icons/ui-2.png',
    imageMimeType: 'image/png',
    imageName: 'ui-2.png',
    width: 112,
    height: 112,
  },
  {
    kind: 'mobile',
    label: 'Mobile',
    description: 'Aplicacao movel ou interface mobile',
    visual: 'image',
    imageSrc: '/icons/mobile.png',
    imageMimeType: 'image/png',
    imageName: 'mobile.png',
    width: 112,
    height: 112,
  },
  {
    kind: 'persona-user',
    label: 'Persona: usuario',
    description: 'Ator humano no fluxo',
    visual: 'image',
    imageSrc: '/icons/persona-1.png',
    imageMimeType: 'image/png',
    imageName: 'persona-1.png',
    width: 112,
    height: 108,
  },
  {
    kind: 'persona-ai',
    label: 'Persona: agente AI',
    description: 'Ator automatizado ou agente',
    visual: 'image',
    imageSrc: '/icons/cerebro.png',
    imageMimeType: 'image/png',
    imageName: 'cerebro.png',
    width: 124,
    height: 124,
  },
  {
    kind: 'automated-flow',
    label: 'Fluxo automatizado',
    description: 'Processo ou automacao operada por agentes',
    visual: 'image',
    imageSrc: '/icons/agents-ai.png',
    imageMimeType: 'image/png',
    imageName: 'agents-ai.png',
    width: 128,
    height: 128,
  },
  {
    kind: 'aws-system',
    label: 'Sistemas AWS',
    description: 'Servico ou conjunto hospedado na AWS',
    visual: 'image',
    imageSrc: '/icons/aws-service.png',
    imageMimeType: 'image/png',
    imageName: 'aws-service.png',
    sourceWidth: 1280,
    sourceHeight: 799,
    width: 160,
    height: 100,
  },
] as const;

export const BOARD_ARCHITECTURE_FLOW_DEFINITIONS: readonly BoardArchitectureFlowDefinition[] = [
  {
    kind: 'sync-request',
    label: 'Fluxo sync',
    description: 'Request/response direto',
    dash: 'solid',
    color: 'blue',
    arrowheadEnd: 'triangle',
    semanticMode: 'sync',
    transport: 'request-response',
  },
  {
    kind: 'async-event',
    label: 'Fluxo async',
    description: 'Evento assincrono entre componentes',
    dash: 'dashed',
    color: 'orange',
    arrowheadEnd: 'arrow',
    semanticMode: 'async',
    transport: 'event',
  },
  {
    kind: 'queue-flow',
    label: 'Fila',
    description: 'Entrega assincrona em fila',
    dash: 'dashed',
    color: 'yellow',
    arrowheadEnd: 'triangle',
    semanticMode: 'async',
    transport: 'queue',
  },
  {
    kind: 'topic-pubsub',
    label: 'Topico pub/sub',
    description: 'Publicacao e assinatura em topico',
    dash: 'dotted',
    color: 'green',
    arrowheadEnd: 'triangle',
    semanticMode: 'async',
    transport: 'topic',
  },
] as const;

export function getBoardArchitectureNodeDefinition(kind: BoardArchitectureNodeKind) {
  return BOARD_ARCHITECTURE_NODE_DEFINITIONS.find((definition) => definition.kind === kind)!;
}

export function getBoardArchitectureFlowDefinition(kind: BoardArchitectureFlowKind) {
  return BOARD_ARCHITECTURE_FLOW_DEFINITIONS.find((definition) => definition.kind === kind)!;
}

export function boardArchitectureNodeUsesImage(kind: BoardArchitectureNodeKind) {
  return getBoardArchitectureNodeDefinition(kind).visual === 'image';
}

export function buildBoardArchitectureNodeAsset(kind: BoardArchitectureNodeKind): TLImageAsset | null {
  const definition = getBoardArchitectureNodeDefinition(kind);

  if (definition.visual !== 'image' || !definition.imageSrc || !definition.imageMimeType || !definition.imageName) {
    return null;
  }

  return {
    id: AssetRecordType.createId(`${definition.kind}-${definition.imageName}`),
    typeName: 'asset',
    type: 'image',
    meta: {
      architecture: {
        semanticType: definition.kind,
        semanticClass: 'node',
      },
    },
    props: {
      w: definition.sourceWidth ?? definition.width,
      h: definition.sourceHeight ?? definition.height,
      name: definition.imageName,
      isAnimated: false,
      mimeType: definition.imageMimeType,
      src: definition.imageSrc,
    },
  };
}

export function buildBoardArchitectureNodeShape(kind: BoardArchitectureNodeKind, x: number, y: number, assetId?: TLAssetId): TLShapePartial {
  const definition = getBoardArchitectureNodeDefinition(kind);

  if (definition.visual === 'image') {
    return {
      id: createShapeId(),
      type: 'image',
      x,
      y,
      meta: {
        architecture: {
          semanticType: definition.kind,
          semanticClass: 'node',
        },
      },
      props: {
        w: definition.width,
        h: definition.height,
        playing: true,
        assetId: assetId ?? null,
        crop: null,
        flipX: false,
        flipY: false,
        altText: definition.label,
      },
    };
  }

  return {
    id: createShapeId(),
    type: 'geo',
    x,
    y,
    meta: {
      architecture: {
        semanticType: definition.kind,
        semanticClass: 'node',
      },
    },
    props: {
      geo: definition.geo,
      w: definition.width,
      h: definition.height,
      color: definition.color,
      fill: definition.fill,
      dash: definition.dash,
      size: 'm',
      font: 'draw',
      align: 'middle',
      verticalAlign: 'middle',
      richText: toRichText(definition.label),
      labelColor: 'black',
      url: '',
      growY: 0,
      scale: 1,
    },
  };
}

export function buildBoardArchitectureFlowShape(kind: BoardArchitectureFlowKind, x: number, y: number): TLShapePartial {
  const definition = getBoardArchitectureFlowDefinition(kind);

  return {
    id: createShapeId(),
    type: 'arrow',
    x,
    y,
    meta: {
      architecture: {
        semanticType: definition.kind,
        semanticClass: 'flow',
        interactionMode: definition.semanticMode,
        transport: definition.transport,
      },
    },
    props: {
      kind: 'arc',
      labelColor: 'black',
      color: definition.color,
      fill: 'none',
      dash: definition.dash,
      size: 'm',
      arrowheadStart: 'none',
      arrowheadEnd: definition.arrowheadEnd,
      font: 'mono',
      start: { x: 0, y: 0 },
      end: { x: 240, y: 0 },
      bend: 0,
      richText: toRichText(definition.label),
      labelPosition: 0.5,
      scale: 1,
      elbowMidPoint: 0.5,
    },
  };
}
