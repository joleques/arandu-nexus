'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TLShapePartial, TLStoreSnapshot } from '@tldraw/tlschema';
import { DefaultColorStyle, DefaultLabelColorStyle, Editor, Tldraw, getSnapshot } from 'tldraw';
import { createBoardEditorAssetStore } from '@/modules/boards/application/board-editor-assets';
import {
  BOARD_ARCHITECTURE_FLOW_DEFINITIONS,
  BOARD_ARCHITECTURE_NODE_DEFINITIONS,
  type BoardArchitectureFlowKind,
  type BoardArchitectureNodeKind,
  buildBoardArchitectureFlowShape,
  buildBoardArchitectureNodeAsset,
  buildBoardArchitectureNodeShape,
} from '@/modules/boards/application/board-architecture-elements';
import {
  BOARD_IMAGE_LIBRARY_ITEMS,
  buildBoardImageLibraryAsset,
  buildBoardImageLibraryShape,
} from '@/modules/boards/application/board-image-library';
import {
  BOARD_MINDMAP_ACTION_DEFINITIONS,
  buildBoardMindmapDeletePlan,
  buildBoardMindmapChildShape,
  buildBoardMindmapCollapseToggleUpdates,
  buildBoardMindmapConnectionShapeId,
  buildBoardMindmapConnectionLockUpdates,
  buildBoardMindmapConnectionShapes,
  buildBoardMindmapRootShape,
  buildBoardMindmapSemanticPlacementUpdates,
  buildBoardMindmapSiblingShape,
  collectBoardMindmapConnectionIds,
  collectBoardMindmapConnectionRecords,
  collectBoardMindmapNodeRecords,
  collectBoardMindmapOrphanConnectionIds,
  getBoardMindmapRoot,
  getBoardMindmapSelectionHint,
  layoutBoardMindmap,
  type BoardMindmapActionKind,
  type BoardMindmapNodeRecord,
} from '@/modules/boards/application/board-mindmap';
import {
  BoardLabelColor,
  canApplyBoardLabelColor,
  getBoardTextColorMode,
  shapeHasEditableText,
  shapeUsesDirectTextColor,
  shouldShowBoardLabelPopover,
} from '@/modules/boards/application/board-label-style';
import { shouldPersistBoardSnapshot } from '@/modules/boards/application/board-persistence';
import { shouldPersistBoardTitle } from '@/modules/boards/application/board-title-persistence';
import { Board } from '@/modules/boards/domain/board';
import { BoardCanvasLayout } from '@/modules/boards/ui/board-canvas-layout';
import { SaveState, getSaveLabel } from '@/modules/boards/ui/board-save-state';
import { logAdapter } from '@/shared/logging/log-adapter';

type BoardCanvasProps = {
  board: Board;
};

type LabelPopoverState = {
  visible: boolean;
  x: number;
  y: number;
};

type MindmapNodeControlsState = {
  visible: boolean;
  x: number;
  y: number;
  canRemove: boolean;
};

const hiddenPopoverState: LabelPopoverState = {
  visible: false,
  x: 0,
  y: 0,
};

const hiddenMindmapNodeControlsState: MindmapNodeControlsState = {
  visible: false,
  x: 0,
  y: 0,
  canRemove: false,
};

export function BoardCanvas({ board }: BoardCanvasProps) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [title, setTitle] = useState(board.title);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastPersistedSnapshot, setLastPersistedSnapshot] = useState(board.currentDocument);
  const [lastFailedSnapshot, setLastFailedSnapshot] = useState('');
  const [lastPersistedTitle, setLastPersistedTitle] = useState(board.title);
  const [selectedLabelColor, setSelectedLabelColor] = useState<BoardLabelColor>('black');
  const [labelPopover, setLabelPopover] = useState<LabelPopoverState>(hiddenPopoverState);
  const [mindmapNodeControls, setMindmapNodeControls] = useState<MindmapNodeControlsState>(hiddenMindmapNodeControlsState);
  const [mindmapHint, setMindmapHint] = useState('Crie um topico central para iniciar o mindmap.');
  const [nodeInsertions, setNodeInsertions] = useState(0);
  const [flowInsertions, setFlowInsertions] = useState(0);
  const [imageInsertions, setImageInsertions] = useState(0);
  const mindmapSyncFrameRef = useRef<number | null>(null);
  const lastMindmapSignatureRef = useRef('');
  const isMindmapSyncingRef = useRef(false);

  const assetStore = useMemo(() => createBoardEditorAssetStore(board.id), [board.id]);

  const initialSnapshot = useMemo(() => {
    if (!board.currentDocument) {
      return undefined;
    }

    return JSON.parse(board.currentDocument) as TLStoreSnapshot;
  }, [board.currentDocument]);

  useEffect(() => {
    const interval = window.setInterval(async () => {
      const snapshot = editor ? JSON.stringify(getSnapshot(editor.store)) : '';

      if (!shouldPersistBoardSnapshot(Boolean(editor), snapshot, lastPersistedSnapshot)) {
        return;
      }

      if (snapshot === lastFailedSnapshot) {
        return;
      }

      try {
        setSaveState('saving');

        const response = await fetch(`/api/boards/${board.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentDocument: snapshot }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { message?: string } | null;
          const errorMessage = payload?.message ?? 'Unable to update board.';
          setLastFailedSnapshot(snapshot);
          logAdapter.error('Board autosave failed.', {
            boardId: board.id,
            status: response.status,
            snapshotLength: snapshot.length,
            error: errorMessage,
          });
          setSaveState('error');
          return;
        }

        setLastFailedSnapshot('');

        setLastPersistedSnapshot(snapshot);
        setSaveState('saved');
      } catch (error) {
        setLastFailedSnapshot(snapshot);
        logAdapter.error('Board autosave request failed.', {
          boardId: board.id,
          snapshotLength: snapshot.length,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        setSaveState('error');
      }
    }, 1200);

    return () => window.clearInterval(interval);
  }, [board.id, editor, lastFailedSnapshot, lastPersistedSnapshot]);

  useEffect(() => {
    if (!shouldPersistBoardTitle(title, lastPersistedTitle)) {
      return;
    }

    const normalizedTitle = title.trim();
    const timeout = window.setTimeout(async () => {
      try {
        setSaveState('saving');

        const response = await fetch(`/api/boards/${board.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: normalizedTitle }),
        });

        if (!response.ok) {
          setSaveState('error');
          return;
        }

        setLastPersistedTitle(normalizedTitle);
        setTitle((currentTitle) => (currentTitle.trim() === normalizedTitle ? normalizedTitle : currentTitle));
        setSaveState('saved');
      } catch {
        setSaveState('error');
      }
    }, 550);

    return () => window.clearTimeout(timeout);
  }, [board.id, title, lastPersistedTitle]);

  useEffect(() => {
    if (!editor) {
      setLabelPopover(hiddenPopoverState);
      setMindmapNodeControls(hiddenMindmapNodeControlsState);
      return;
    }

    const interval = window.setInterval(() => {
      const selectedShapeIds = editor.getSelectedShapeIds();
      const selectionBounds = editor.getSelectionPageBounds();
      const selectedShapes = selectedShapeIds.map((id) => editor.getShape(id));
      const mindmapNodes = collectBoardMindmapNodeRecords(editor.getCurrentPageShapes());
      const textColorMode = getBoardTextColorMode(selectedShapes);
      const selectedMindmapNodes = mindmapNodes.filter((node) => selectedShapeIds.includes(node.shapeId));

      setMindmapHint(getBoardMindmapSelectionHint(mindmapNodes, selectedShapeIds));

      if (selectedMindmapNodes.length === 1) {
        const selectedNode = selectedMindmapNodes[0];
        const nodeBounds = editor.getShapePageBounds(selectedNode.shapeId);

        if (nodeBounds) {
          const anchorPoint = editor.pageToViewport({
            x: nodeBounds.x + nodeBounds.w + 12,
            y: nodeBounds.y - 12,
          });

          setMindmapNodeControls({
            visible: true,
            x: anchorPoint.x,
            y: anchorPoint.y,
            canRemove: selectedNode.parentId !== null,
          });
        } else {
          setMindmapNodeControls((state) => (state.visible ? hiddenMindmapNodeControlsState : state));
        }
      } else {
        setMindmapNodeControls((state) => (state.visible ? hiddenMindmapNodeControlsState : state));
      }

      if (!shouldShowBoardLabelPopover(selectedShapes) || !selectionBounds) {
        setLabelPopover((state) => (state.visible ? hiddenPopoverState : state));
        return;
      }

      const sharedShapeTextColor = editor.getSharedStyles().get(DefaultColorStyle);
      const sharedLabelTextColor = editor.getSharedStyles().get(DefaultLabelColorStyle);

      if (textColorMode === 'shape-text' && sharedShapeTextColor?.type === 'shared') {
        setSelectedLabelColor(sharedShapeTextColor.value as BoardLabelColor);
      } else if (textColorMode === 'label-text' && sharedLabelTextColor?.type === 'shared') {
        setSelectedLabelColor(sharedLabelTextColor.value as BoardLabelColor);
      } else if (
        textColorMode === 'mixed-text' &&
        sharedShapeTextColor?.type === 'shared' &&
        sharedLabelTextColor?.type === 'shared' &&
        sharedShapeTextColor.value === sharedLabelTextColor.value
      ) {
        setSelectedLabelColor(sharedShapeTextColor.value as BoardLabelColor);
      }

      const anchorPoint = editor.pageToViewport({
        x: selectionBounds.x + selectionBounds.w / 2,
        y: selectionBounds.y + selectionBounds.h,
      });

      setLabelPopover({
        visible: true,
        x: anchorPoint.x,
        y: anchorPoint.y + 12,
      });
    }, 150);

    return () => window.clearInterval(interval);
  }, [editor]);

  function handleApplyLabelColor(color: BoardLabelColor) {
    if (!editor || !canApplyBoardLabelColor(true)) {
      return;
    }

    const selectedShapes = editor.getSelectedShapeIds().map((id) => editor.getShape(id));
    const textColorMode = getBoardTextColorMode(selectedShapes);

    if (textColorMode === 'shape-text') {
      editor.setStyleForSelectedShapes(DefaultColorStyle, color);
      setSelectedLabelColor(color);
      return;
    }

    if (textColorMode === 'label-text') {
      editor.setStyleForSelectedShapes(DefaultLabelColorStyle, color);
      setSelectedLabelColor(color);
      return;
    }

    if (textColorMode === 'mixed-text') {
      const updates: TLShapePartial[] = [];

      selectedShapes.forEach((shape) => {
        if (!shape || !shapeHasEditableText(shape)) {
          return;
        }

        if (shapeUsesDirectTextColor(shape)) {
          updates.push({ id: shape.id, type: 'text', props: { color } } as TLShapePartial);
          return;
        }

        updates.push({
          id: shape.id,
          type: shape.type as Exclude<typeof shape.type, 'text' | undefined>,
          props: { labelColor: color },
        } as TLShapePartial);
      });

      if (updates.length > 0) {
        editor.updateShapes(updates);
        setSelectedLabelColor(color);
      }
    }
  }

  const getMindmapNodes = useCallback((): BoardMindmapNodeRecord[] => {
    if (!editor) {
      return [];
    }

    return collectBoardMindmapNodeRecords(editor.getCurrentPageShapes());
  }, [editor]);

  const getSelectedMindmapNode = useCallback((nodes: BoardMindmapNodeRecord[]) => {
    if (!editor) {
      return null;
    }

    const selectedShapeIds = editor.getSelectedShapeIds();

    return nodes.find((node) => selectedShapeIds.includes(node.shapeId)) ?? null;
  }, [editor]);

  const rebuildMindmapConnections = useCallback((nodesOverride?: BoardMindmapNodeRecord[]) => {
    if (!editor) {
      return;
    }

    const shapes = editor.getCurrentPageShapes();
    const nodes = nodesOverride ?? collectBoardMindmapNodeRecords(shapes);
    const desiredConnections = buildBoardMindmapConnectionShapes(nodes);
    const desiredIds = new Set(
      desiredConnections.map((shape) => shape.id as ReturnType<typeof buildBoardMindmapConnectionShapeId>),
    );
    const existingConnections = collectBoardMindmapConnectionRecords(shapes);
    const obsoleteIds = existingConnections
      .filter((connection) => !desiredIds.has(connection.shapeId))
      .map((connection) => connection.shapeId);

    editor.run(() => {
      if (obsoleteIds.length > 0) {
        editor.deleteShapes(obsoleteIds);
      }

      const currentConnectionIds = new Set(
        collectBoardMindmapConnectionRecords(editor.getCurrentPageShapes()).map((connection) => connection.shapeId),
      );
      const updates: TLShapePartial[] = [];

      desiredConnections.forEach((shape) => {
        const shapeId = shape.id as ReturnType<typeof buildBoardMindmapConnectionShapeId>;

        if (currentConnectionIds.has(shapeId)) {
          updates.push(shape);
          return;
        }

        editor.createShape(shape);
      });

      if (updates.length > 0) {
        editor.updateShapes(updates);
      }

      desiredConnections.forEach((shape) => {
        const meta = (shape.meta as { mindmap?: { sourceNodeId?: string; targetNodeId?: string } } | undefined)?.mindmap;

        if (!meta?.sourceNodeId || !meta.targetNodeId) {
          return;
        }

        const arrowId = shape.id as ReturnType<typeof buildBoardMindmapConnectionShapeId>;
        const targetNode = nodes.find((node) => node.id === meta.targetNodeId);
        const isLeftBranch = targetNode?.branchSide === 'left';
        const bindings = [
          {
            terminal: 'start' as const,
            toId: meta.sourceNodeId,
            normalizedAnchor: isLeftBranch ? { x: 0, y: 0.5 } : { x: 1, y: 0.5 },
          },
          {
            terminal: 'end' as const,
            toId: meta.targetNodeId,
            normalizedAnchor: isLeftBranch ? { x: 1, y: 0.5 } : { x: 0, y: 0.5 },
          },
        ];

        bindings.forEach((bindingConfig) => {
          const existing = editor
            .getBindingsFromShape(arrowId, 'arrow')
            .find((binding) => binding.props.terminal === bindingConfig.terminal);

          const props = {
            terminal: bindingConfig.terminal,
            normalizedAnchor: bindingConfig.normalizedAnchor,
            isExact: false,
            isPrecise: true,
            snap: 'edge' as const,
          };

          if (existing) {
            editor.updateBinding({
              ...existing,
              toId: bindingConfig.toId as typeof existing.toId,
              props,
            });
            return;
          }

          editor.createBinding({
            type: 'arrow',
            fromId: arrowId,
            toId: bindingConfig.toId as typeof arrowId,
            props,
          });
        });
      });
    });
  }, [editor]);

  const rebuildMindmapLayout = useCallback(() => {
    if (!editor) {
      return;
    }

    const shapes = editor.getCurrentPageShapes();
    const nodes = collectBoardMindmapNodeRecords(shapes);
    const root = getBoardMindmapRoot(nodes);

    if (!root) {
      return;
    }

    const rootCenter = {
      x: root.x + root.w / 2,
      y: root.y + root.h / 2,
    };
    const { nodeUpdates, positionedNodes } = layoutBoardMindmap(nodes, rootCenter);

    editor.run(() => {
      if (nodeUpdates.length > 0) {
        editor.updateShapes(nodeUpdates);
      }
    });

    rebuildMindmapConnections(positionedNodes);
  }, [editor, rebuildMindmapConnections]);

  const getMindmapSignature = useCallback((nodes: BoardMindmapNodeRecord[]) => {
    return nodes
      .map((node) => `${node.id}:${node.parentId ?? 'root'}:${node.collapsed ? 1 : 0}:${node.branchSide}:${node.order}`)
      .sort()
      .join('|');
  }, []);

  const isMindmapEditorStateStable = useCallback(() => {
    if (!editor) {
      return false;
    }

    return (
      !editor.getEditingShapeId() &&
      !editor.isIn('select.translating') &&
      !editor.isIn('select.resizing') &&
      !editor.isIn('select.rotating') &&
      !editor.isIn('select.dragging_handle') &&
      !editor.isIn('select.pointing_handle') &&
      !editor.isIn('select.crop')
    );
  }, [editor]);

  const syncMindmapDocument = useCallback(() => {
    if (!editor) {
      return;
    }

    if (isMindmapSyncingRef.current) {
      return;
    }

    isMindmapSyncingRef.current = true;

    try {
    let shapes = editor.getCurrentPageShapes();
    let nodes = collectBoardMindmapNodeRecords(shapes);
    const semanticUpdates = buildBoardMindmapSemanticPlacementUpdates(nodes);

    if (semanticUpdates.length > 0) {
      editor.updateShapes(semanticUpdates);
      shapes = editor.getCurrentPageShapes();
      nodes = collectBoardMindmapNodeRecords(shapes);
    }

    const lockUpdates = buildBoardMindmapConnectionLockUpdates(shapes);

    if (lockUpdates.length > 0) {
      editor.updateShapes(lockUpdates);
      shapes = editor.getCurrentPageShapes();
    }

    if (nodes.length === 0) {
      lastMindmapSignatureRef.current = '';
      const residualConnectionIds = collectBoardMindmapConnectionIds(shapes);

      if (residualConnectionIds.length > 0) {
        editor.deleteShapes(residualConnectionIds);
      }

      return;
    }

    const orphanConnectionIds = collectBoardMindmapOrphanConnectionIds(shapes, nodes);
    const nextSignature = getMindmapSignature(nodes);

    if (lockUpdates.length === 0 && orphanConnectionIds.length === 0 && nextSignature === lastMindmapSignatureRef.current) {
      return;
    }

    if (orphanConnectionIds.length > 0) {
      editor.deleteShapes(orphanConnectionIds);
    }

    rebuildMindmapConnections(nodes);
    lastMindmapSignatureRef.current = nextSignature;
    } finally {
      isMindmapSyncingRef.current = false;
    }
  }, [editor, getMindmapSignature, rebuildMindmapConnections]);

  const handleMindmapAction = useCallback((kind: BoardMindmapActionKind) => {
    if (!editor) {
      return;
    }

    const nodes = getMindmapNodes();
    const selectedNode = getSelectedMindmapNode(nodes);

    switch (kind) {
      case 'create-root': {
        const root = getBoardMindmapRoot(nodes);

        if (root) {
          editor.select(root.shapeId);
          rebuildMindmapLayout();
          return;
        }

        const rootShape = buildBoardMindmapRootShape(editor.getViewportPageBounds().center);

        editor.createShape(rootShape).select(rootShape.id);
        rebuildMindmapLayout();
        return;
      }

      case 'create-child': {
        if (!selectedNode) {
          return;
        }

        if (selectedNode.collapsed) {
          editor.updateShapes(buildBoardMindmapCollapseToggleUpdates(nodes, selectedNode.id, false));
        }

        const childShape = buildBoardMindmapChildShape(selectedNode, nodes);

        editor.createShape(childShape).select(childShape.id);
        rebuildMindmapLayout();
        return;
      }

      case 'create-sibling': {
        if (!selectedNode || !selectedNode.parentId) {
          return;
        }

        const siblingShape = buildBoardMindmapSiblingShape(selectedNode, nodes);

        editor.createShape(siblingShape).select(siblingShape.id);
        rebuildMindmapLayout();
        return;
      }

      case 'toggle-collapse': {
        if (!selectedNode) {
          return;
        }

        editor.updateShapes(buildBoardMindmapCollapseToggleUpdates(nodes, selectedNode.id));
        rebuildMindmapLayout();
        return;
      }

      case 'organize': {
        rebuildMindmapLayout();
        return;
      }
    }
  }, [editor, getMindmapNodes, getSelectedMindmapNode, rebuildMindmapLayout]);

  const handleRemoveSelectedMindmapNode = useCallback(() => {
    if (!editor) {
      return;
    }

    const nodes = getMindmapNodes();
    const selectedNode = getSelectedMindmapNode(nodes);

    if (!selectedNode || !selectedNode.parentId) {
      return;
    }

    const deletePlan = buildBoardMindmapDeletePlan(nodes, selectedNode.id);
    const shapeIdsToDelete = [...deletePlan.nodeShapeIds, ...deletePlan.connectionShapeIds];

    if (shapeIdsToDelete.length === 0) {
      return;
    }

    editor.run(() => {
      editor.deleteShapes(shapeIdsToDelete);
    }, { ignoreShapeLock: true });
    setMindmapNodeControls(hiddenMindmapNodeControlsState);
  }, [editor, getMindmapNodes, getSelectedMindmapNode]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentEditor = editor;

    function handleKeydown(event: KeyboardEvent) {
      if (currentEditor.getEditingShapeId()) {
        return;
      }

      const nodes = getMindmapNodes();
      const selectedNode = getSelectedMindmapNode(nodes);

      if (!selectedNode) {
        return;
      }

      if (event.key === 'Enter' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        handleMindmapAction('create-child');
        return;
      }

      if (event.key === 'Tab' && !event.shiftKey) {
        event.preventDefault();
        handleMindmapAction('create-sibling');
        return;
      }

      if (event.key === 'Tab' && event.shiftKey) {
        event.preventDefault();
        handleMindmapAction('toggle-collapse');
        return;
      }

      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handleMindmapAction('organize');
      }
    }

    window.addEventListener('keydown', handleKeydown);

    return () => window.removeEventListener('keydown', handleKeydown);
  }, [editor, getMindmapNodes, getSelectedMindmapNode, handleMindmapAction]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const scheduleMindmapSync = () => {
      if (mindmapSyncFrameRef.current !== null) {
        return;
      }

      mindmapSyncFrameRef.current = window.requestAnimationFrame(() => {
        mindmapSyncFrameRef.current = null;

        if (!isMindmapEditorStateStable()) {
          scheduleMindmapSync();
          return;
        }

        syncMindmapDocument();
      });
    };

    scheduleMindmapSync();

    const removeOperationHandler = editor.sideEffects.registerOperationCompleteHandler(() => {
      if (isMindmapSyncingRef.current) {
        return;
      }

      scheduleMindmapSync();
    });

    return () => {
      removeOperationHandler();

      if (mindmapSyncFrameRef.current !== null) {
        window.cancelAnimationFrame(mindmapSyncFrameRef.current);
        mindmapSyncFrameRef.current = null;
      }
    };
  }, [editor, isMindmapEditorStateStable, syncMindmapDocument]);

  function handleInsertNode(kind: BoardArchitectureNodeKind) {
    if (!editor) {
      return;
    }

    const viewportCenter = editor.getViewportPageBounds().center;
    const x = viewportCenter.x - 180 + (nodeInsertions % 3) * 210;
    const y = viewportCenter.y - 160 + (Math.floor(nodeInsertions / 3) % 3) * 150;
    const asset = buildBoardArchitectureNodeAsset(kind);

    if (asset) {
      editor.createAssets([asset]);
    }

    const shape = buildBoardArchitectureNodeShape(kind, x, y, asset?.id);

    editor.createShape(shape).select(shape.id);
    setNodeInsertions((value) => value + 1);
  }

  function handleInsertFlow(kind: BoardArchitectureFlowKind) {
    if (!editor) {
      return;
    }

    const viewportCenter = editor.getViewportPageBounds().center;
    const x = viewportCenter.x - 180 + (flowInsertions % 2) * 90;
    const y = viewportCenter.y + 180 + (Math.floor(flowInsertions / 2) % 2) * 72;
    const shape = buildBoardArchitectureFlowShape(kind, x, y);

    editor.createShape(shape).select(shape.id);
    setFlowInsertions((value) => value + 1);
  }

  function handleInsertImage(kind: string) {
    if (!editor) {
      return;
    }

    const item = BOARD_IMAGE_LIBRARY_ITEMS.find((entry) => entry.kind === kind);

    if (!item) {
      return;
    }

    const viewportCenter = editor.getViewportPageBounds().center;
    const x = viewportCenter.x - 180 + (imageInsertions % 3) * 160;
    const y = viewportCenter.y - 80 + (Math.floor(imageInsertions / 3) % 3) * 128;
    const asset = buildBoardImageLibraryAsset(item);

    editor.createAssets([asset]);
    const shape = buildBoardImageLibraryShape(item, x, y, asset.id);

    editor.createShape(shape).select(shape.id);
    setImageInsertions((value) => value + 1);
  }

  return (
    <BoardCanvasLayout
      titleEditor={
        <label className="board-title-field">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={80}
            aria-label="Titulo do board"
            placeholder="Titulo do board"
          />
        </label>
      }
      saveLabel={getSaveLabel(saveState)}
      saveState={saveState}
      nodeDefinitions={BOARD_ARCHITECTURE_NODE_DEFINITIONS}
      flowDefinitions={BOARD_ARCHITECTURE_FLOW_DEFINITIONS}
      mindmapActions={BOARD_MINDMAP_ACTION_DEFINITIONS}
      mindmapHint={mindmapHint}
      imageDefinitions={BOARD_IMAGE_LIBRARY_ITEMS}
      controlsDisabled={!editor}
      onInsertNode={(kind) => handleInsertNode(kind as BoardArchitectureNodeKind)}
      onInsertFlow={(kind) => handleInsertFlow(kind as BoardArchitectureFlowKind)}
      onMindmapAction={handleMindmapAction}
      onInsertImage={handleInsertImage}
      labelPopover={{
        ...labelPopover,
        selectedColor: selectedLabelColor,
        onApplyColor: handleApplyLabelColor,
      }}
      mindmapNodeControls={{
        ...mindmapNodeControls,
        onAddChild: () => handleMindmapAction('create-child'),
        onRemoveNode: handleRemoveSelectedMindmapNode,
      }}
      stage={
        <Tldraw
          assets={assetStore}
          snapshot={initialSnapshot}
          onMount={(mountedEditor) => {
            setEditor(mountedEditor);
          }}
        />
      }
    />
  );
}
