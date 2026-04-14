'use client';

import { useEffect, useMemo, useState } from 'react';
import type { TLShapePartial, TLStoreSnapshot } from '@tldraw/tlschema';
import { DefaultColorStyle, DefaultLabelColorStyle, Editor, Tldraw, getSnapshot } from 'tldraw';
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

type BoardCanvasProps = {
  board: Board;
};

type LabelPopoverState = {
  visible: boolean;
  x: number;
  y: number;
};

const hiddenPopoverState: LabelPopoverState = {
  visible: false,
  x: 0,
  y: 0,
};

export function BoardCanvas({ board }: BoardCanvasProps) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [title, setTitle] = useState(board.title);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastPersistedSnapshot, setLastPersistedSnapshot] = useState(board.currentDocument);
  const [lastPersistedTitle, setLastPersistedTitle] = useState(board.title);
  const [selectedLabelColor, setSelectedLabelColor] = useState<BoardLabelColor>('black');
  const [labelPopover, setLabelPopover] = useState<LabelPopoverState>(hiddenPopoverState);
  const [nodeInsertions, setNodeInsertions] = useState(0);
  const [flowInsertions, setFlowInsertions] = useState(0);
  const [imageInsertions, setImageInsertions] = useState(0);

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
          setSaveState('error');
          return;
        }

        setLastPersistedSnapshot(snapshot);
        setSaveState('saved');
      } catch {
        setSaveState('error');
      }
    }, 1200);

    return () => window.clearInterval(interval);
  }, [board.id, editor, lastPersistedSnapshot]);

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
      return;
    }

    const interval = window.setInterval(() => {
      const selectedShapeIds = editor.getSelectedShapeIds();
      const selectionBounds = editor.getSelectionPageBounds();
      const selectedShapes = selectedShapeIds.map((id) => editor.getShape(id));
      const textColorMode = getBoardTextColorMode(selectedShapes);

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
      imageDefinitions={BOARD_IMAGE_LIBRARY_ITEMS}
      controlsDisabled={!editor}
      onInsertNode={(kind) => handleInsertNode(kind as BoardArchitectureNodeKind)}
      onInsertFlow={(kind) => handleInsertFlow(kind as BoardArchitectureFlowKind)}
      onInsertImage={handleInsertImage}
      labelPopover={{
        ...labelPopover,
        selectedColor: selectedLabelColor,
        onApplyColor: handleApplyLabelColor,
      }}
      stage={
        <Tldraw
          snapshot={initialSnapshot}
          onMount={(mountedEditor) => {
            setEditor(mountedEditor);
          }}
        />
      }
    />
  );
}
