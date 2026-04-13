'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { TLShapePartial, TLStoreSnapshot } from '@tldraw/tlschema';
import { DefaultColorStyle, DefaultLabelColorStyle, Editor, Tldraw, getSnapshot } from 'tldraw';
import {
  BOARD_LABEL_COLOR_OPTIONS,
  BoardLabelColor,
  canApplyBoardLabelColor,
  getBoardTextColorMode,
  shapeHasEditableText,
  shapeUsesDirectTextColor,
  shouldShowBoardLabelPopover,
} from '@/modules/boards/application/board-label-style';
import { shouldPersistBoardSnapshot } from '@/modules/boards/application/board-persistence';
import { Board } from '@/modules/boards/domain/board';

type BoardCanvasProps = {
  board: Board;
};

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

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
  const [selectedLabelColor, setSelectedLabelColor] = useState<BoardLabelColor>('black');
  const [labelPopover, setLabelPopover] = useState<LabelPopoverState>(hiddenPopoverState);

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

  async function handleTitleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveState('saving');

    try {
      const response = await fetch(`/api/boards/${board.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      setSaveState(response.ok ? 'saved' : 'error');
    } catch {
      setSaveState('error');
    }
  }

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

  return (
    <main className="board-shell">
      <header className="board-toolbar">
        <div>
          <Link className="ghost-link" href="/">
            Voltar para boards
          </Link>
          <form className="board-title-form" onSubmit={handleTitleSubmit}>
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} aria-label="Titulo do board" />
            <button className="primary-button" type="submit">
              Salvar titulo
            </button>
          </form>
        </div>

        <span className={`save-pill save-pill--${saveState}`}>{getSaveLabel(saveState)}</span>
      </header>

      <section className="board-stage">
        {labelPopover.visible && (
          <div
            className="label-color-popover"
            style={{
              left: labelPopover.x,
              top: labelPopover.y,
            }}
          >
            <span className="label-color-popover__label">Texto</span>
            <div className="label-color-popover__swatches">
              {BOARD_LABEL_COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-swatch color-swatch--${color}`}
                  data-active={selectedLabelColor === color}
                  onClick={() => handleApplyLabelColor(color)}
                  disabled={!editor}
                  aria-label={`Aplicar cor ${color} ao texto do elemento selecionado`}
                  title={`Aplicar cor ${color}`}
                />
              ))}
            </div>
          </div>
        )}

        <Tldraw
          snapshot={initialSnapshot}
          onMount={(mountedEditor) => {
            setEditor(mountedEditor);
          }}
        />
      </section>
    </main>
  );
}

function getSaveLabel(saveState: SaveState) {
  switch (saveState) {
    case 'saving':
      return 'Salvando...';
    case 'saved':
      return 'Tudo salvo';
    case 'error':
      return 'Falha ao salvar';
    default:
      return 'Pronto para editar';
  }
}
