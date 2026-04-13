import { describe, expect, it } from 'vitest';
import {
  BOARD_ARCHITECTURE_FLOW_DEFINITIONS,
  BOARD_ARCHITECTURE_NODE_DEFINITIONS,
  boardArchitectureNodeUsesImage,
  buildBoardArchitectureFlowShape,
  buildBoardArchitectureNodeAsset,
  buildBoardArchitectureNodeShape,
} from '@/modules/boards/application/board-architecture-elements';

describe('board architecture elements', () => {
  it('exposes the semantic catalog expected by the architecture menu', () => {
    expect(BOARD_ARCHITECTURE_NODE_DEFINITIONS.map((definition) => definition.kind)).toEqual([
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
    ]);

    expect(BOARD_ARCHITECTURE_FLOW_DEFINITIONS.map((definition) => definition.kind)).toEqual([
      'sync-request',
      'async-event',
      'queue-flow',
      'topic-pubsub',
    ]);
  });

  it('keeps microservice as a semantic geo node and turns it into a cloud', () => {
    const microservice = buildBoardArchitectureNodeShape('microservice', 40, 80);

    expect(microservice.type).toBe('geo');
    expect(microservice.meta).toMatchObject({ architecture: { semanticClass: 'node', semanticType: 'microservice' } });
    expect(microservice.props).toMatchObject({ geo: 'cloud', color: 'blue', fill: 'semi' });
  });

  it('uses the real asset dimensions for queue and topic images to avoid visual clipping', () => {
    const queueAsset = buildBoardArchitectureNodeAsset('queue');
    const topicAsset = buildBoardArchitectureNodeAsset('topic');
    const queueShape = buildBoardArchitectureNodeShape('queue', 40, 80, queueAsset?.id);
    const topicShape = buildBoardArchitectureNodeShape('topic', 40, 80, topicAsset?.id);

    expect(queueAsset).toMatchObject({
      type: 'image',
      props: { src: '/icons/fila-0.png', name: 'fila-0.png', w: 251, h: 71 },
    });
    expect(topicAsset).toMatchObject({
      type: 'image',
      props: { src: '/icons/topic-0.png', name: 'topic-0.png', w: 330, h: 138 },
    });
    expect(queueShape).toMatchObject({
      type: 'image',
      props: { assetId: queueAsset?.id, altText: 'Fila', url: '/icons/fila-0.png', w: 212, h: 60 },
    });
    expect(topicShape).toMatchObject({
      type: 'image',
      props: { assetId: topicAsset?.id, altText: 'Topico', url: '/icons/topic-0.png', w: 172, h: 72 },
    });
  });

  it('builds sync and async flows as first-class semantic arrows', () => {
    const syncFlow = buildBoardArchitectureFlowShape('sync-request', 120, 240);
    const asyncEvent = buildBoardArchitectureFlowShape('async-event', 120, 240);
    const queueFlow = buildBoardArchitectureFlowShape('queue-flow', 120, 240);
    const topicFlow = buildBoardArchitectureFlowShape('topic-pubsub', 120, 240);

    expect(syncFlow.type).toBe('arrow');
    expect(syncFlow.meta).toMatchObject({
      architecture: {
        semanticClass: 'flow',
        semanticType: 'sync-request',
        interactionMode: 'sync',
        transport: 'request-response',
      },
    });
    expect(syncFlow.props).toMatchObject({
      dash: 'solid',
      arrowheadEnd: 'triangle',
      color: 'blue',
      start: { x: 0, y: 0 },
      end: { x: 240, y: 0 },
    });

    expect(asyncEvent.meta).toMatchObject({ architecture: { interactionMode: 'async', transport: 'event' } });
    expect(asyncEvent.props).toMatchObject({ dash: 'dashed', color: 'orange' });

    expect(queueFlow.meta).toMatchObject({ architecture: { interactionMode: 'async', transport: 'queue' } });
    expect(queueFlow.props).toMatchObject({ dash: 'dashed', color: 'yellow' });

    expect(topicFlow.meta).toMatchObject({ architecture: { interactionMode: 'async', transport: 'topic' } });
    expect(topicFlow.props).toMatchObject({ dash: 'dotted', color: 'green' });
  });
});
