import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BoardDirectory } from '@/modules/boards/ui/board-directory';

describe('BoardDirectory', () => {
  it('renders the hero, creation form and board cards', () => {
    const markup = renderToStaticMarkup(
      <BoardDirectory
        boards={[
          {
            id: 'board-1',
            title: 'Arquitetura de onboarding',
            updatedAt: '2026-04-13T20:00:00.000Z',
          },
        ]}
        createBoardAction={async () => {}}
        deleteBoardAction={async () => {}}
      />,
    );

    expect(markup).toContain('Arquitetura visual com cara de workspace');
    expect(markup).toContain('Novo board');
    expect(markup).toContain('Arquitetura de onboarding');
    expect(markup).toContain('Abrir workspace');
    expect(markup).toContain('Excluir');
  });

  it('renders the empty state copy when there are no boards', () => {
    const markup = renderToStaticMarkup(
      <BoardDirectory boards={[]} createBoardAction={async () => {}} deleteBoardAction={async () => {}} />,
    );

    expect(markup).toContain('Nenhum board criado ainda.');
    expect(markup).toContain('O lado bom do vazio inicial');
  });
});
