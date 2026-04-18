import { createShapeId, toRichText, type TLShapePartial } from '@tldraw/tlschema';

export const BOARD_MINDMAP_ACTION_DEFINITIONS = [
  {
    kind: 'create-root',
    label: 'Topico central',
    description: 'Cria a raiz do mindmap e centraliza o raciocinio no board',
  },
  {
    kind: 'create-child',
    label: 'Adicionar filho',
    description: 'Cria um subtópico ligado ao topico selecionado',
  },
  {
    kind: 'create-sibling',
    label: 'Adicionar irmao',
    description: 'Cria um topico no mesmo nivel do item selecionado',
  },
  {
    kind: 'organize',
    label: 'Reorganizar layout',
    description: 'Recalcula o layout da arvore e reconstrói as conexoes derivadas',
  },
  {
    kind: 'toggle-collapse',
    label: 'Recolher ou expandir',
    description: 'Alterna o estado do ramo selecionado para simplificar a leitura',
  },
] as const;

export type BoardMindmapActionKind = (typeof BOARD_MINDMAP_ACTION_DEFINITIONS)[number]['kind'];
export type BoardMindmapBranchSide = 'left' | 'right';
export type BoardMindmapNodeKind = 'root' | 'branch';

export type BoardMindmapPoint = {
  x: number;
  y: number;
};

export type BoardMindmapConnectionRecord = {
  shapeId: ReturnType<typeof createShapeId>;
  sourceNodeId: string;
  targetNodeId: string;
};

export type BoardMindmapDeletePlan = {
  nodeShapeIds: ReturnType<typeof createShapeId>[];
  connectionShapeIds: ReturnType<typeof createShapeId>[];
};

type BoardMindmapShapeLike = {
  id: string;
  type?: string;
  x: number;
  y: number;
  isLocked?: boolean;
  meta?: object;
  props?: object;
};

type BoardMindmapMeta = {
  semanticClass: 'node' | 'connection';
};

type BoardMindmapConnectionMeta = BoardMindmapMeta & {
  semanticClass: 'connection';
  sourceNodeId: string;
  targetNodeId: string;
};

type BoardMindmapNodeMeta = BoardMindmapMeta & {
  semanticClass: 'node';
  nodeId: string;
  nodeKind: BoardMindmapNodeKind;
  parentId: string | null;
  branchSide: BoardMindmapBranchSide;
  order: number;
  collapsed: boolean;
};

export type BoardMindmapNodeRecord = {
  id: string;
  shapeId: ReturnType<typeof createShapeId>;
  nodeKind: BoardMindmapNodeKind;
  parentId: string | null;
  branchSide: BoardMindmapBranchSide;
  order: number;
  collapsed: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
};

type BoardMindmapVisibilityResult = {
  visibleNodeIds: Set<string>;
  collapsedNodeIds: Set<string>;
};

type BoardMindmapLayoutResult = {
  nodeUpdates: TLShapePartial[];
  positionedNodes: BoardMindmapNodeRecord[];
};

type BoardMindmapSemanticPlacement = {
  branchSide: BoardMindmapBranchSide;
  order: number;
};

const BOARD_MINDMAP_ROOT_SIZE = { w: 280, h: 132 } as const;
const BOARD_MINDMAP_BRANCH_SIZE = { w: 224, h: 92 } as const;
const BOARD_MINDMAP_HORIZONTAL_GAP = 164;
const BOARD_MINDMAP_VERTICAL_GAP = 30;

function getMindmapNodeSize(nodeKind: BoardMindmapNodeKind) {
  return nodeKind === 'root' ? BOARD_MINDMAP_ROOT_SIZE : BOARD_MINDMAP_BRANCH_SIZE;
}

function getMindmapNodeColor(branchSide: BoardMindmapBranchSide, nodeKind: BoardMindmapNodeKind) {
  if (nodeKind === 'root') {
    return 'orange';
  }

  return branchSide === 'left' ? 'green' : 'blue';
}

function getMindmapNodeFill(nodeKind: BoardMindmapNodeKind) {
  return nodeKind === 'root' ? 'solid' : 'semi';
}

function getMindmapNodeGeo(nodeKind: BoardMindmapNodeKind) {
  return nodeKind === 'root' ? 'oval' : 'rectangle';
}

function buildBoardMindmapNodeMeta(input: {
  nodeId: string;
  nodeKind: BoardMindmapNodeKind;
  parentId: string | null;
  branchSide: BoardMindmapBranchSide;
  order: number;
}): BoardMindmapNodeMeta {
  return {
    semanticClass: 'node',
    nodeId: input.nodeId,
    nodeKind: input.nodeKind,
    parentId: input.parentId,
    branchSide: input.branchSide,
    order: input.order,
    collapsed: false,
  };
}

function buildBoardMindmapNodeShape(meta: BoardMindmapNodeMeta, position: BoardMindmapPoint, label: string) {
  const size = getMindmapNodeSize(meta.nodeKind);

  return {
    id: meta.nodeId as ReturnType<typeof createShapeId>,
    type: 'geo',
    x: position.x,
    y: position.y,
    meta: {
      mindmap: meta,
    },
    props: {
      geo: getMindmapNodeGeo(meta.nodeKind),
      w: size.w,
      h: size.h,
      color: getMindmapNodeColor(meta.branchSide, meta.nodeKind),
      fill: getMindmapNodeFill(meta.nodeKind),
      dash: 'solid',
      size: 'm',
      font: 'draw',
      align: 'middle',
      verticalAlign: 'middle',
      richText: toRichText(label),
      labelColor: 'black',
      url: '',
      growY: 0,
      scale: 1,
    },
  } satisfies TLShapePartial;
}

function getMindmapMeta(shape: BoardMindmapShapeLike): BoardMindmapMeta | null {
  const mindmapMeta = shape.meta ? (shape.meta as Record<string, unknown>).mindmap : undefined;

  if (!mindmapMeta || typeof mindmapMeta !== 'object') {
    return null;
  }

  const semanticClass = (mindmapMeta as Record<string, unknown>).semanticClass;

  if (semanticClass !== 'node' && semanticClass !== 'connection') {
    return null;
  }

  return mindmapMeta as BoardMindmapMeta;
}

function getMindmapNodeMeta(shape: BoardMindmapShapeLike): BoardMindmapNodeMeta | null {
  const mindmapMeta = getMindmapMeta(shape);

  if (!mindmapMeta || mindmapMeta.semanticClass !== 'node') {
    return null;
  }

  const nodeMeta = mindmapMeta as BoardMindmapNodeMeta;

  if (typeof nodeMeta.nodeId !== 'string' || (nodeMeta.nodeKind !== 'root' && nodeMeta.nodeKind !== 'branch')) {
    return null;
  }

  return nodeMeta;
}

function getMindmapConnectionMeta(shape: BoardMindmapShapeLike): BoardMindmapConnectionMeta | null {
  const mindmapMeta = getMindmapMeta(shape);

  if (!mindmapMeta || mindmapMeta.semanticClass !== 'connection') {
    return null;
  }

  const connectionMeta = mindmapMeta as BoardMindmapConnectionMeta;

  if (typeof connectionMeta.sourceNodeId !== 'string' || typeof connectionMeta.targetNodeId !== 'string') {
    return null;
  }

  return connectionMeta;
}

function getShapeDimension(shape: BoardMindmapShapeLike, key: 'w' | 'h', fallback: number) {
  const value = shape.props ? (shape.props as Record<string, unknown>)[key] : undefined;

  return typeof value === 'number' ? value : fallback;
}

function getRootChildrenBySide(nodes: BoardMindmapNodeRecord[]) {
  return nodes.filter((node) => node.parentId !== null).reduce(
    (accumulator, node) => {
      if (node.branchSide === 'left') {
        accumulator.left += 1;
      } else {
        accumulator.right += 1;
      }

      return accumulator;
    },
    { left: 0, right: 0 },
  );
}

function getNextChildSide(parent: BoardMindmapNodeRecord, allNodes: BoardMindmapNodeRecord[]): BoardMindmapBranchSide {
  if (parent.nodeKind !== 'root') {
    return parent.branchSide;
  }

  const children = allNodes.filter((node) => node.parentId === parent.id);
  const counts = getRootChildrenBySide(children);

  return counts.right <= counts.left ? 'right' : 'left';
}

function getNextOrder(parentId: string, branchSide: BoardMindmapBranchSide, allNodes: BoardMindmapNodeRecord[]) {
  return allNodes.filter((node) => node.parentId === parentId && node.branchSide === branchSide).length;
}

function sortMindmapNodes(nodes: BoardMindmapNodeRecord[]) {
  return [...nodes].sort((left, right) => {
    if (left.order !== right.order) {
      return left.order - right.order;
    }

    return left.id.localeCompare(right.id);
  });
}

function groupChildren(nodes: BoardMindmapNodeRecord[]) {
  const childrenByParent = new Map<string, BoardMindmapNodeRecord[]>();

  nodes.forEach((node) => {
    if (!node.parentId) {
      return;
    }

    const current = childrenByParent.get(node.parentId) ?? [];
    current.push(node);
    childrenByParent.set(node.parentId, current);
  });

  childrenByParent.forEach((value, key) => {
    childrenByParent.set(key, sortMindmapNodes(value));
  });

  return childrenByParent;
}

function collectDescendantIds(nodeId: string, childrenByParent: Map<string, BoardMindmapNodeRecord[]>): string[] {
  const descendants: string[] = [];
  const directChildren = childrenByParent.get(nodeId) ?? [];

  directChildren.forEach((child) => {
    descendants.push(child.id);
    descendants.push(...collectDescendantIds(child.id, childrenByParent));
  });

  return descendants;
}

export function buildBoardMindmapDeletePlan(nodes: BoardMindmapNodeRecord[], targetNodeId: string): BoardMindmapDeletePlan {
  const targetNode = nodes.find((node) => node.id === targetNodeId);

  if (!targetNode) {
    return {
      nodeShapeIds: [],
      connectionShapeIds: [],
    };
  }

  const childrenByParent = groupChildren(nodes);
  const descendantIds = collectDescendantIds(targetNodeId, childrenByParent);
  const removedNodeIds = [targetNodeId, ...descendantIds];
  const removedNodeIdSet = new Set(removedNodeIds);

  return {
    nodeShapeIds: nodes
      .filter((node) => removedNodeIdSet.has(node.id))
      .map((node) => node.shapeId as ReturnType<typeof createShapeId>),
    connectionShapeIds: nodes
      .filter((node) => removedNodeIdSet.has(node.id) && node.parentId !== null)
      .map((node) => buildBoardMindmapConnectionShapeId(node.id)),
  };
}

function getNodeCenter(node: BoardMindmapNodeRecord) {
  return {
    x: node.x + node.w / 2,
    y: node.y + node.h / 2,
  };
}

function compareNodesForPlacement(left: BoardMindmapNodeRecord, right: BoardMindmapNodeRecord) {
  if (left.y !== right.y) {
    return left.y - right.y;
  }

  if (left.x !== right.x) {
    return left.x - right.x;
  }

  if (left.order !== right.order) {
    return left.order - right.order;
  }

  return left.id.localeCompare(right.id);
}

function getNodeCenterFromPosition(node: BoardMindmapNodeRecord, position?: BoardMindmapPoint) {
  if (!position) {
    return getNodeCenter(node);
  }

  return {
    x: position.x + node.w / 2,
    y: position.y + node.h / 2,
  };
}

export function buildBoardMindmapConnectionShapeId(targetNodeId: string) {
  return createShapeId(`mindmap-connection-${targetNodeId.replace(/:/g, '_')}`);
}

function buildBoardMindmapConnectionShape(source: BoardMindmapNodeRecord, target: BoardMindmapNodeRecord): TLShapePartial {
  const sourceCenterY = source.y + source.h / 2;
  const targetCenterY = target.y + target.h / 2;
  const sourceEdgeX = target.branchSide === 'left' ? source.x : source.x + source.w;
  const targetEdgeX = target.branchSide === 'left' ? target.x + target.w : target.x;

  return {
    id: buildBoardMindmapConnectionShapeId(target.id),
    type: 'arrow',
    isLocked: true,
    x: sourceEdgeX,
    y: sourceCenterY,
    meta: {
      mindmap: {
        semanticClass: 'connection',
        sourceNodeId: source.id,
        targetNodeId: target.id,
      },
    },
    props: {
      kind: 'arc',
      labelColor: 'black',
      color: target.branchSide === 'left' ? 'green' : 'blue',
      fill: 'none',
      dash: 'solid',
      size: 'm',
      arrowheadStart: 'none',
      arrowheadEnd: 'none',
      font: 'draw',
      start: { x: 0, y: 0 },
      end: {
        x: targetEdgeX - sourceEdgeX,
        y: targetCenterY - sourceCenterY,
      },
      bend: target.branchSide === 'left' ? -24 : 24,
      richText: toRichText(''),
      labelPosition: 0.5,
      scale: 1,
      elbowMidPoint: 0.5,
    },
  };
}

function getSubtreeHeight(
  nodeId: string,
  nodesById: Map<string, BoardMindmapNodeRecord>,
  childrenByParent: Map<string, BoardMindmapNodeRecord[]>,
): number {
  const node = nodesById.get(nodeId);

  if (!node) {
    return 0;
  }

  const children = childrenByParent.get(nodeId) ?? [];

  if (children.length === 0 || node.collapsed) {
    return node.h;
  }

  const childrenHeight = children.reduce((total, child, index) => {
    const childHeight = getSubtreeHeight(child.id, nodesById, childrenByParent);
    const gap = index > 0 ? BOARD_MINDMAP_VERTICAL_GAP : 0;

    return total + gap + childHeight;
  }, 0);

  return Math.max(node.h, childrenHeight);
}

function placeChildren(
  parent: BoardMindmapNodeRecord,
  side: BoardMindmapBranchSide,
  children: BoardMindmapNodeRecord[],
  nodesById: Map<string, BoardMindmapNodeRecord>,
  childrenByParent: Map<string, BoardMindmapNodeRecord[]>,
  positions: Map<string, BoardMindmapPoint>,
) {
  if (children.length === 0) {
    return;
  }

  const parentCenter = getNodeCenterFromPosition(parent, positions.get(parent.id));
  const subtreeHeights = children.map((child) => getSubtreeHeight(child.id, nodesById, childrenByParent));
  const totalHeight = subtreeHeights.reduce((total, height, index) => total + height + (index > 0 ? BOARD_MINDMAP_VERTICAL_GAP : 0), 0);
  let currentY = parentCenter.y - totalHeight / 2;

  children.forEach((child, index) => {
    const span = subtreeHeights[index];
    const childCenterY = currentY + span / 2;
    const childCenterX =
      side === 'right'
        ? parentCenter.x + parent.w / 2 + BOARD_MINDMAP_HORIZONTAL_GAP + child.w / 2
        : parentCenter.x - parent.w / 2 - BOARD_MINDMAP_HORIZONTAL_GAP - child.w / 2;

    const nextPosition = {
      x: childCenterX - child.w / 2,
      y: childCenterY - child.h / 2,
    };

    positions.set(child.id, nextPosition);

    const nestedChildren = childrenByParent.get(child.id) ?? [];
    placeChildren(child, child.branchSide, nestedChildren, nodesById, childrenByParent, positions);

    currentY += span + BOARD_MINDMAP_VERTICAL_GAP;
  });
}

export function buildBoardMindmapRootShape(center: BoardMindmapPoint): TLShapePartial {
  const nodeId = createShapeId();
  const size = getMindmapNodeSize('root');

  return buildBoardMindmapNodeShape(
    buildBoardMindmapNodeMeta({
      nodeId,
      nodeKind: 'root',
      parentId: null,
      branchSide: 'right',
      order: 0,
    }),
    {
      x: center.x - size.w / 2,
      y: center.y - size.h / 2,
    },
    'Ideia central',
  );
}

export function isBoardMindmapNode(shape: BoardMindmapShapeLike) {
  return getMindmapNodeMeta(shape) !== null;
}

export function isBoardMindmapConnection(shape: BoardMindmapShapeLike) {
  return getMindmapMeta(shape)?.semanticClass === 'connection';
}

export function collectBoardMindmapConnectionIds(shapes: BoardMindmapShapeLike[]) {
  return shapes.filter(isBoardMindmapConnection).map((shape) => shape.id as ReturnType<typeof createShapeId>);
}

export function collectBoardMindmapConnectionRecords(shapes: BoardMindmapShapeLike[]) {
  return shapes.reduce<BoardMindmapConnectionRecord[]>((records, shape) => {
    const meta = getMindmapConnectionMeta(shape);

    if (!meta) {
      return records;
    }

    records.push({
      shapeId: shape.id as ReturnType<typeof createShapeId>,
      sourceNodeId: meta.sourceNodeId,
      targetNodeId: meta.targetNodeId,
    });

    return records;
  }, []);
}

export function collectBoardMindmapOrphanConnectionIds(
  shapes: BoardMindmapShapeLike[],
  nodes: BoardMindmapNodeRecord[] = collectBoardMindmapNodeRecords(shapes),
) {
  const nodeIds = new Set(nodes.map((node) => node.id));

  return shapes.reduce<ReturnType<typeof createShapeId>[]>((ids, shape) => {
    const meta = getMindmapConnectionMeta(shape);

    if (!meta) {
      return ids;
    }

    if (!nodeIds.has(meta.sourceNodeId) || !nodeIds.has(meta.targetNodeId)) {
      ids.push(shape.id as ReturnType<typeof createShapeId>);
    }

    return ids;
  }, []);
}

export function buildBoardMindmapConnectionLockUpdates(shapes: BoardMindmapShapeLike[]) {
  return shapes.reduce<TLShapePartial[]>((updates, shape) => {
    if (!isBoardMindmapConnection(shape) || shape.isLocked) {
      return updates;
    }

    updates.push({
      id: shape.id as ReturnType<typeof createShapeId>,
      type: 'arrow',
      isLocked: true,
    });

    return updates;
  }, []);
}

export function collectBoardMindmapNodeRecords(shapes: BoardMindmapShapeLike[]): BoardMindmapNodeRecord[] {
  return shapes
    .map((shape) => {
      const nodeMeta = getMindmapNodeMeta(shape);

      if (!nodeMeta) {
        return null;
      }

      const size = getMindmapNodeSize(nodeMeta.nodeKind);

      return {
        id: nodeMeta.nodeId,
        shapeId: shape.id as ReturnType<typeof createShapeId>,
        nodeKind: nodeMeta.nodeKind,
        parentId: nodeMeta.parentId,
        branchSide: nodeMeta.branchSide,
        order: nodeMeta.order,
        collapsed: nodeMeta.collapsed,
        x: shape.x,
        y: shape.y,
        w: getShapeDimension(shape, 'w', size.w),
        h: getShapeDimension(shape, 'h', size.h),
      } satisfies BoardMindmapNodeRecord;
    })
    .filter((node): node is BoardMindmapNodeRecord => node !== null);
}

export function getBoardMindmapRoot(nodes: BoardMindmapNodeRecord[]) {
  return nodes.find((node) => node.parentId === null && node.nodeKind === 'root') ?? null;
}

export function getBoardMindmapSelectionHint(nodes: BoardMindmapNodeRecord[], selectedNodeIds: string[]) {
  const root = getBoardMindmapRoot(nodes);
  const selectedNode = nodes.find((node) => selectedNodeIds.includes(node.shapeId));

  if (!root) {
    return 'Crie um topico central para iniciar o mindmap.';
  }

  if (!selectedNode) {
    return 'Selecione um topico do mindmap para criar filho ou irmao.';
  }

  if (selectedNode.nodeKind === 'root') {
    return selectedNode.collapsed
      ? 'Raiz selecionada e recolhida. Expanda ou adicione filhos para continuar.'
      : 'Raiz selecionada. Adicione filhos, reorganize ou recolha ramos para limpar a leitura.';
  }

  return selectedNode.collapsed
    ? 'Topico recolhido. Expanda para revisar os descendentes ou reorganize a arvore.'
    : 'Topico selecionado. Adicione filho, irmao, reorganize ou recolha o ramo.';
}

export function buildBoardMindmapChildShape(parent: BoardMindmapNodeRecord, allNodes: BoardMindmapNodeRecord[]): TLShapePartial {
  const nodeId = createShapeId();
  const branchSide = getNextChildSide(parent, allNodes);
  const order = getNextOrder(parent.id, branchSide, allNodes);
  const size = getMindmapNodeSize('branch');
  const parentCenter = getNodeCenter(parent);
  const horizontalDirection = branchSide === 'right' ? 1 : -1;

  return buildBoardMindmapNodeShape(
    buildBoardMindmapNodeMeta({
      nodeId,
      nodeKind: 'branch',
      parentId: parent.id,
      branchSide,
      order,
    }),
    {
      x: parentCenter.x + horizontalDirection * (parent.w / 2 + BOARD_MINDMAP_HORIZONTAL_GAP) - size.w / 2,
      y: parentCenter.y - size.h / 2,
    },
    'Novo topico',
  );
}

export function buildBoardMindmapSiblingShape(node: BoardMindmapNodeRecord, allNodes: BoardMindmapNodeRecord[]): TLShapePartial {
  if (!node.parentId) {
    throw new Error('Root nodes do not support siblings.');
  }

  const nodeId = createShapeId();
  const order = getNextOrder(node.parentId, node.branchSide, allNodes);
  const size = getMindmapNodeSize('branch');

  return buildBoardMindmapNodeShape(
    buildBoardMindmapNodeMeta({
      nodeId,
      nodeKind: 'branch',
      parentId: node.parentId,
      branchSide: node.branchSide,
      order,
    }),
    {
      x: node.x,
      y: node.y + node.h + BOARD_MINDMAP_VERTICAL_GAP - (node.h - size.h) / 2,
    },
    'Novo topico',
  );
}

export function layoutBoardMindmap(nodes: BoardMindmapNodeRecord[], rootCenter?: BoardMindmapPoint): BoardMindmapLayoutResult {
  const root = getBoardMindmapRoot(nodes);

  if (!root) {
    return {
      nodeUpdates: [],
      positionedNodes: [],
    };
  }

  const childrenByParent = groupChildren(nodes);
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const anchorCenter = rootCenter ?? getNodeCenter(root);
  const positions = new Map<string, BoardMindmapPoint>();

  positions.set(root.id, {
    x: anchorCenter.x - root.w / 2,
    y: anchorCenter.y - root.h / 2,
  });

  const directChildren = childrenByParent.get(root.id) ?? [];
  const leftChildren = directChildren.filter((child) => child.branchSide === 'left');
  const rightChildren = directChildren.filter((child) => child.branchSide === 'right');

  placeChildren(root, 'left', leftChildren, nodesById, childrenByParent, positions);
  placeChildren(root, 'right', rightChildren, nodesById, childrenByParent, positions);

  const positionedNodes = nodes.map((node) => {
    const nextPosition = positions.get(node.id);

    if (!nextPosition) {
      return node;
    }

    return {
      ...node,
      x: nextPosition.x,
      y: nextPosition.y,
    };
  });

    return {
      nodeUpdates: positionedNodes.map((node) => ({
        id: node.shapeId as ReturnType<typeof createShapeId>,
        type: 'geo',
        x: node.x,
        y: node.y,
      })),
      positionedNodes,
    };
}

export function getBoardMindmapVisibility(nodes: BoardMindmapNodeRecord[]): BoardMindmapVisibilityResult {
  const root = getBoardMindmapRoot(nodes);
  const childrenByParent = groupChildren(nodes);
  const visibleNodeIds = new Set<string>();
  const collapsedNodeIds = new Set<string>();

  if (!root) {
    return { visibleNodeIds, collapsedNodeIds };
  }

  function visit(nodeId: string) {
    visibleNodeIds.add(nodeId);

    const node = nodes.find((entry) => entry.id === nodeId);

    if (!node) {
      return;
    }

    const children = childrenByParent.get(nodeId) ?? [];

    if (node.collapsed) {
      collapsedNodeIds.add(nodeId);
      return;
    }

    children.forEach((child) => visit(child.id));
  }

  visit(root.id);

  return { visibleNodeIds, collapsedNodeIds };
}

export function buildBoardMindmapCollapseToggleUpdates(
  nodes: BoardMindmapNodeRecord[],
  targetNodeId: string,
  forceCollapsed?: boolean,
) {
  const targetNode = nodes.find((node) => node.id === targetNodeId);

  if (!targetNode) {
    return [];
  }

  const nextCollapsed = forceCollapsed ?? !targetNode.collapsed;

  return [
    {
      id: targetNode.shapeId as ReturnType<typeof createShapeId>,
      type: 'geo',
      meta: {
        mindmap: {
          semanticClass: 'node',
          nodeId: targetNode.id,
          nodeKind: targetNode.nodeKind,
          parentId: targetNode.parentId,
          branchSide: targetNode.branchSide,
          order: targetNode.order,
          collapsed: nextCollapsed,
        },
      },
    } satisfies TLShapePartial,
  ];
}

export function buildBoardMindmapSemanticPlacementUpdates(nodes: BoardMindmapNodeRecord[]) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const placements = new Map<string, BoardMindmapSemanticPlacement>();
  const nodesByParent = new Map<string, BoardMindmapNodeRecord[]>();

  nodes.forEach((node) => {
    if (!node.parentId) {
      return;
    }

    const siblings = nodesByParent.get(node.parentId) ?? [];
    siblings.push(node);
    nodesByParent.set(node.parentId, siblings);
  });

  nodesByParent.forEach((siblings, parentId) => {
    const parent = nodesById.get(parentId);

    if (!parent) {
      return;
    }

    const parentCenterX = getNodeCenter(parent).x;
    const leftSiblings: BoardMindmapNodeRecord[] = [];
    const rightSiblings: BoardMindmapNodeRecord[] = [];

    siblings.forEach((node) => {
      const nodeCenterX = getNodeCenter(node).x;
      const nextSide = nodeCenterX < parentCenterX ? 'left' : 'right';

      if (nextSide === 'left') {
        leftSiblings.push(node);
        return;
      }

      rightSiblings.push(node);
    });

    [leftSiblings, rightSiblings].forEach((group, index) => {
      const branchSide: BoardMindmapBranchSide = index === 0 ? 'left' : 'right';

      group.sort(compareNodesForPlacement).forEach((node, order) => {
        placements.set(node.id, {
          branchSide,
          order,
        });
      });
    });
  });

  return nodes.reduce<TLShapePartial[]>((updates, node) => {
      if (!node.parentId) {
        return updates;
      }

      const nextPlacement = placements.get(node.id);

      if (!nextPlacement) {
        return updates;
      }

      if (nextPlacement.branchSide === node.branchSide && nextPlacement.order === node.order) {
        return updates;
      }

      updates.push({
        id: node.shapeId as ReturnType<typeof createShapeId>,
        type: 'geo',
        meta: {
          mindmap: {
            semanticClass: 'node',
            nodeId: node.id,
            nodeKind: node.nodeKind,
            parentId: node.parentId,
            branchSide: nextPlacement.branchSide,
            order: nextPlacement.order,
            collapsed: node.collapsed,
          },
        },
      } satisfies TLShapePartial);

      return updates;
    }, []);
}

export function buildBoardMindmapConnectionShapes(nodes: BoardMindmapNodeRecord[]) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const { visibleNodeIds } = getBoardMindmapVisibility(nodes);

  return nodes
    .filter((node) => node.parentId !== null && visibleNodeIds.has(node.id))
    .map((node) => {
      const parent = nodesById.get(node.parentId!);

      if (!parent || !visibleNodeIds.has(parent.id)) {
        return null;
      }

      return buildBoardMindmapConnectionShape(parent, node);
    })
    .filter((connection): connection is TLShapePartial => connection !== null);
}
