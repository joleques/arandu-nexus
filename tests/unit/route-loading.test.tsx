import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RootLoading from '@/app/loading';
import BoardRouteLoading from '@/app/boards/[id]/loading';

describe('route loading states', () => {
  it('renders a generic loading shell for page transitions', () => {
    const markup = renderToStaticMarkup(<RootLoading />);

    expect(markup).toContain('Preparando a proxima tela...');
    expect(markup).toContain('Carregando');
  });

  it('renders a board-specific loading shell when entering a workspace', () => {
    const markup = renderToStaticMarkup(<BoardRouteLoading />);

    expect(markup).toContain('Abrindo o board...');
    expect(markup).toContain('Workspace');
  });
});
