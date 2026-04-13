import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { BOARD_ARCHITECTURE_FLOW_DEFINITIONS, BOARD_ARCHITECTURE_NODE_DEFINITIONS } from '@/modules/boards/application/board-architecture-elements';
import { BoardCanvasLayout } from '@/modules/boards/ui/board-canvas-layout';
import { getSaveLabel } from '@/modules/boards/ui/board-save-state';

describe('BoardCanvasLayout', () => {
  it('renders toolbar copy, library sections and stage overlay', () => {
    const markup = renderToStaticMarkup(
      <BoardCanvasLayout
        titleEditor={<form><input aria-label="Titulo do board" defaultValue="Context map" /></form>}
        saveLabel={getSaveLabel('saved')}
        saveState="saved"
        nodeDefinitions={BOARD_ARCHITECTURE_NODE_DEFINITIONS}
        flowDefinitions={BOARD_ARCHITECTURE_FLOW_DEFINITIONS}
        controlsDisabled={false}
        onInsertNode={vi.fn()}
        onInsertFlow={vi.fn()}
        labelPopover={{
          visible: false,
          x: 0,
          y: 0,
          selectedColor: 'black',
          onApplyColor: vi.fn(),
        }}
        stage={<div>canvas stage</div>}
      />,
    );

    expect(markup).toContain('Board workspace');
    expect(markup).toContain('Biblioteca visual');
    expect(markup).toContain('Canvas ativo');
    expect(markup).toContain('Tudo salvo');
  });

  it('maps save states to user-facing labels', () => {
    expect(getSaveLabel('idle')).toBe('Pronto para editar');
    expect(getSaveLabel('saving')).toBe('Salvando...');
    expect(getSaveLabel('saved')).toBe('Tudo salvo');
    expect(getSaveLabel('error')).toBe('Falha ao salvar');
  });
});
