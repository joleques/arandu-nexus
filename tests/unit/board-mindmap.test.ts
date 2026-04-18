import { describe, expect, it } from 'vitest';
import {
  BOARD_MINDMAP_ACTION_DEFINITIONS,
  buildBoardMindmapDeletePlan,
  buildBoardMindmapChildShape,
  buildBoardMindmapCollapseToggleUpdates,
  buildBoardMindmapConnectionLockUpdates,
  buildBoardMindmapConnectionShapeId,
  buildBoardMindmapConnectionShapes,
  buildBoardMindmapRootShape,
  buildBoardMindmapSemanticPlacementUpdates,
  buildBoardMindmapSiblingShape,
  collectBoardMindmapOrphanConnectionIds,
  collectBoardMindmapNodeRecords,
  getBoardMindmapRoot,
  getBoardMindmapSelectionHint,
  getBoardMindmapVisibility,
  layoutBoardMindmap,
} from '@/modules/boards/application/board-mindmap';

describe('board mindmap', () => {
  it('exposes the structural actions expected by the board sidebar', () => {
    expect(BOARD_MINDMAP_ACTION_DEFINITIONS.map((action) => action.kind)).toEqual([
      'create-root',
      'create-child',
      'create-sibling',
      'organize',
      'toggle-collapse',
    ]);
  });

  it('creates a root node centered on the requested point with semantic metadata', () => {
    const root = buildBoardMindmapRootShape({ x: 640, y: 360 });

    expect(root.type).toBe('geo');
    expect(root.x).toBe(500);
    expect(root.y).toBe(294);
    expect(root.meta).toMatchObject({
      mindmap: {
        semanticClass: 'node',
        nodeKind: 'root',
        parentId: null,
      },
    });
  });

  it('creates child and sibling nodes with real parent-child semantics instead of decorative shapes', () => {
    const rootShape = buildBoardMindmapRootShape({ x: 600, y: 320 });
    const root = collectBoardMindmapNodeRecords([rootShape as never])[0];
    const firstChild = buildBoardMindmapChildShape(root, [root]);
    const firstChildRecord = collectBoardMindmapNodeRecords([firstChild as never])[0];
    const sibling = buildBoardMindmapSiblingShape(firstChildRecord, [root, firstChildRecord]);

    expect(firstChild.meta).toMatchObject({
      mindmap: {
        semanticClass: 'node',
        nodeKind: 'branch',
        parentId: root.id,
        branchSide: 'right',
        order: 0,
      },
    });

    expect(sibling.meta).toMatchObject({
      mindmap: {
        semanticClass: 'node',
        parentId: root.id,
        branchSide: 'right',
        order: 1,
      },
    });
  });

  it('lays out branches by side and derives connections from the tree structure', () => {
    const rootShape = buildBoardMindmapRootShape({ x: 640, y: 360 });
    const root = collectBoardMindmapNodeRecords([rootShape as never])[0];
    const rightChildShape = buildBoardMindmapChildShape(root, [root]);
    const rightChild = collectBoardMindmapNodeRecords([rightChildShape as never])[0];
    const leftChildShape = buildBoardMindmapChildShape(root, [root, rightChild]);
    const leftChild = collectBoardMindmapNodeRecords([leftChildShape as never])[0];
    const grandChildShape = buildBoardMindmapChildShape(rightChild, [root, rightChild, leftChild]);
    const grandChild = collectBoardMindmapNodeRecords([grandChildShape as never])[0];
    const nodes = [root, rightChild, leftChild, grandChild];

    const layout = layoutBoardMindmap(nodes, { x: 640, y: 360 });
    const positionedRoot = getBoardMindmapRoot(layout.positionedNodes)!;
    const positionedLeftChild = layout.positionedNodes.find((node) => node.id === leftChild.id)!;
    const positionedRightChild = layout.positionedNodes.find((node) => node.id === rightChild.id)!;
    const positionedGrandChild = layout.positionedNodes.find((node) => node.id === grandChild.id)!;
    const connections = buildBoardMindmapConnectionShapes(layout.positionedNodes);

    expect(positionedRoot.x).toBe(500);
    expect(positionedLeftChild.x).toBeLessThan(positionedRoot.x);
    expect(positionedRightChild.x).toBeGreaterThan(positionedRoot.x);
    expect(positionedGrandChild.x).toBeGreaterThan(positionedRightChild.x);
    expect(connections).toHaveLength(3);
    const grandChildConnection = connections.find((connection) =>
      (connection.meta as { mindmap?: { targetNodeId?: string } } | undefined)?.mindmap?.targetNodeId === grandChild.id,
    );

    expect(grandChildConnection).toMatchObject({
      type: 'arrow',
      isLocked: true,
      meta: { mindmap: { semanticClass: 'connection' } },
    });
    expect(grandChildConnection?.x).toBe(positionedRightChild.x + positionedRightChild.w);
    expect(grandChildConnection?.props).toMatchObject({
      end: {
        x: positionedGrandChild.x - (positionedRightChild.x + positionedRightChild.w),
      },
    });
  });

  it('tells the UI how to guide the user depending on root and selection state', () => {
    const rootShape = buildBoardMindmapRootShape({ x: 500, y: 320 });
    const root = collectBoardMindmapNodeRecords([rootShape as never])[0];

    expect(getBoardMindmapSelectionHint([], [])).toContain('Crie um topico central');
    expect(getBoardMindmapSelectionHint([root], [])).toContain('Selecione um topico');
    expect(getBoardMindmapSelectionHint([root], [root.shapeId])).toContain('Raiz selecionada');
  });

  it('collapses a branch by hiding descendants and removing derived connections from the hidden subtree', () => {
    const rootShape = buildBoardMindmapRootShape({ x: 640, y: 360 });
    const root = collectBoardMindmapNodeRecords([rootShape as never])[0];
    const childShape = buildBoardMindmapChildShape(root, [root]);
    const child = collectBoardMindmapNodeRecords([childShape as never])[0];
    const grandChildShape = buildBoardMindmapChildShape(child, [root, child]);
    const grandChild = collectBoardMindmapNodeRecords([grandChildShape as never])[0];
    const nodes = [root, child, grandChild];
    const collapsedChildNodes = nodes.map((node) => (node.id === child.id ? { ...node, collapsed: true } : node));
    const visibility = getBoardMindmapVisibility(collapsedChildNodes);
    const connections = buildBoardMindmapConnectionShapes(collapsedChildNodes);

    expect(visibility.visibleNodeIds.has(root.id)).toBe(true);
    expect(visibility.visibleNodeIds.has(child.id)).toBe(true);
    expect(visibility.visibleNodeIds.has(grandChild.id)).toBe(false);
    expect(visibility.collapsedNodeIds.has(child.id)).toBe(true);
    expect(connections).toHaveLength(1);
  });

  it('builds a meta update that toggles collapsed state without changing tree ownership', () => {
    const rootShape = buildBoardMindmapRootShape({ x: 500, y: 320 });
    const root = collectBoardMindmapNodeRecords([rootShape as never])[0];
    const updates = buildBoardMindmapCollapseToggleUpdates([root], root.id);

    expect(updates[0]).toMatchObject({
      id: root.shapeId,
      type: 'geo',
      meta: {
        mindmap: {
          nodeId: root.id,
          parentId: null,
          collapsed: true,
        },
      },
    });
  });

  it('locks derived mindmap connections so select all does not drag them as independent shapes', () => {
    const updates = buildBoardMindmapConnectionLockUpdates([
      {
        id: 'shape:connection-a',
        type: 'arrow',
        x: 0,
        y: 0,
        isLocked: false,
        meta: {
          mindmap: {
            semanticClass: 'connection',
            sourceNodeId: 'shape:root',
            targetNodeId: 'shape:child',
          },
        },
      },
      {
        id: 'shape:connection-b',
        type: 'arrow',
        x: 0,
        y: 0,
        isLocked: true,
        meta: {
          mindmap: {
            semanticClass: 'connection',
            sourceNodeId: 'shape:root',
            targetNodeId: 'shape:child-2',
          },
        },
      },
    ]);

    expect(updates).toEqual([
      {
        id: 'shape:connection-a',
        type: 'arrow',
        isLocked: true,
      },
    ]);
  });

  it('identifies orphan derived connections when source or target nodes no longer exist', () => {
    const rootShape = buildBoardMindmapRootShape({ x: 640, y: 360 });
    const root = collectBoardMindmapNodeRecords([rootShape as never])[0];
    const childShape = buildBoardMindmapChildShape(root, [root]);
    const child = collectBoardMindmapNodeRecords([childShape as never])[0];
    const connections = buildBoardMindmapConnectionShapes([root, child]);

    const orphanIds = collectBoardMindmapOrphanConnectionIds(connections as never, []);
    const healthyIds = collectBoardMindmapOrphanConnectionIds(connections as never, [root, child]);

    expect(orphanIds).toEqual([connections[0].id]);
    expect(healthyIds).toEqual([]);
  });

  it('builds a delete plan for a branch node including its descendants and derived connections', () => {
    const rootShape = buildBoardMindmapRootShape({ x: 640, y: 360 });
    const root = collectBoardMindmapNodeRecords([rootShape as never])[0];
    const childShape = buildBoardMindmapChildShape(root, [root]);
    const child = collectBoardMindmapNodeRecords([childShape as never])[0];
    const grandChildShape = buildBoardMindmapChildShape(child, [root, child]);
    const grandChild = collectBoardMindmapNodeRecords([grandChildShape as never])[0];

    const deletePlan = buildBoardMindmapDeletePlan([root, child, grandChild], child.id);

    expect(deletePlan.nodeShapeIds).toEqual([child.shapeId, grandChild.shapeId]);
    expect(deletePlan.connectionShapeIds).toEqual([
      buildBoardMindmapConnectionShapeId(child.id),
      buildBoardMindmapConnectionShapeId(grandChild.id),
    ]);
  });

  it('reclassifies the branch side when a node crosses the parent axis and keeps sibling order coherent', () => {
    const rootShape = buildBoardMindmapRootShape({ x: 640, y: 360 });
    const root = collectBoardMindmapNodeRecords([rootShape as never])[0];
    const rightChildShape = buildBoardMindmapChildShape(root, [root]);
    const rightChild = collectBoardMindmapNodeRecords([rightChildShape as never])[0];
    const leftChildShape = buildBoardMindmapChildShape(root, [root, rightChild]);
    const leftChild = collectBoardMindmapNodeRecords([leftChildShape as never])[0];

    const movedRightChild = {
      ...rightChild,
      x: root.x - rightChild.w - 48,
      y: leftChild.y + leftChild.h + 24,
    };

    const updates = buildBoardMindmapSemanticPlacementUpdates([root, movedRightChild, leftChild]);

    expect(updates).toHaveLength(1);
    expect(updates[0]).toMatchObject({
      id: movedRightChild.shapeId,
      type: 'geo',
      meta: {
        mindmap: expect.objectContaining({
          branchSide: 'left',
          order: 1,
        }),
      },
    });

    const reclassifiedNodes = [root, leftChild, movedRightChild].map((node) => {
      const update = updates.find((entry) => entry.id === node.shapeId);
      const meta = (update?.meta as { mindmap?: { branchSide?: 'left' | 'right'; order?: number } } | undefined)?.mindmap;

      if (!meta) {
        return node;
      }

      return {
        ...node,
        branchSide: meta.branchSide ?? node.branchSide,
        order: meta.order ?? node.order,
      };
    });

    const movedConnection = buildBoardMindmapConnectionShapes(reclassifiedNodes).find(
      (connection) =>
        (connection.meta as { mindmap?: { targetNodeId?: string } } | undefined)?.mindmap?.targetNodeId === movedRightChild.id,
    );

    expect(movedConnection?.x).toBe(root.x);
    expect(movedConnection?.props).toMatchObject({
      end: {
        x: movedRightChild.x + movedRightChild.w - root.x,
      },
      bend: -24,
    });
  });
});
