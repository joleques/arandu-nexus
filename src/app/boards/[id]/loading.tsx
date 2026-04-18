import React from 'react';

export default function BoardRouteLoading() {
  return (
    <main className="route-loading-shell route-loading-shell--board" aria-busy="true" aria-live="polite">
      <div className="route-loading-card">
        <span className="route-loading-card__eyebrow">Workspace</span>
        <strong>Abrindo o board...</strong>
        <p>Carregando canvas, titulo e contexto para o board entrar pronto, em vez de aparecer como susto branco.</p>
      </div>
    </main>
  );
}
