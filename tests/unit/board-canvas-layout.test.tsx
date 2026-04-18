import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { BOARD_ARCHITECTURE_FLOW_DEFINITIONS, BOARD_ARCHITECTURE_NODE_DEFINITIONS } from '@/modules/boards/application/board-architecture-elements';
import { BoardCanvasLayout } from '@/modules/boards/ui/board-canvas-layout';
import { getSaveLabel } from '@/modules/boards/ui/board-save-state';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('BoardCanvasLayout', () => {
  it('renders the compact toolbar, library sections and stage overlay', () => {
    const markup = renderToStaticMarkup(
      <BoardCanvasLayout
        titleEditor={<input aria-label="Titulo do board" defaultValue="Context map" />}
        saveLabel={getSaveLabel('saved')}
        saveState="saved"
        nodeDefinitions={BOARD_ARCHITECTURE_NODE_DEFINITIONS}
        flowDefinitions={BOARD_ARCHITECTURE_FLOW_DEFINITIONS}
        imageDefinitions={[{ kind: 'api', label: 'API', src: '/icons/api.png' }]}
        controlsDisabled={false}
        onInsertNode={vi.fn()}
        onInsertFlow={vi.fn()}
        onInsertImage={vi.fn()}
        labelPopover={{
          visible: false,
          x: 0,
          y: 0,
          selectedColor: 'black',
          onApplyColor: vi.fn(),
        }}
        mindmapNodeControls={{
          visible: true,
          x: 120,
          y: 80,
          canRemove: true,
          onAddChild: vi.fn(),
          onRemoveNode: vi.fn(),
        }}
        stage={<div>canvas stage</div>}
      />,
    );

    expect(markup).toContain('Voltar para boards');
    expect(markup).toContain('Biblioteca visual');
    expect(markup).toContain('Mindmap');
    expect(markup).toContain('Cria um topico central para iniciar o mapa mental');
    expect(markup).toContain('Imagens');
    expect(markup).toContain('API');
    expect(markup).toContain('Tudo salvo');
    expect(markup).toContain('Adicionar filho ao topico selecionado');
    expect(markup).toContain('Remover topico selecionado');
    expect(markup).not.toContain('5 acoes');
    expect(markup).not.toContain('Board workspace');
    expect(markup).not.toContain('Arraste, conecte e deixe o autosave');
  });

  it('maps save states to user-facing labels', () => {
    expect(getSaveLabel('idle')).toBe('Pronto para editar');
    expect(getSaveLabel('saving')).toBe('Salvando...');
    expect(getSaveLabel('saved')).toBe('Tudo salvo');
    expect(getSaveLabel('error')).toBe('Falha ao salvar');
  });
});
