import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { BoardDirectory } from '@/modules/boards/ui/board-directory';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('BoardDirectory', () => {
  it('renders create, open and delete actions with user-facing copy for slower interactions', () => {
    const markup = renderToStaticMarkup(
      <BoardDirectory
        boards={[
          {
            id: 'board-1',
            title: 'Fluxo de onboarding',
            updatedAt: '2026-04-18T12:00:00.000Z',
          },
        ]}
        createBoardAction={vi.fn(async () => {})}
        deleteBoardAction={vi.fn(async () => {})}
      />,
    );

    expect(markup).toContain('Criar board');
    expect(markup).toContain('Abrir workspace');
    expect(markup).toContain('Excluir');
    expect(markup).toContain('Novo board');
  });
});
